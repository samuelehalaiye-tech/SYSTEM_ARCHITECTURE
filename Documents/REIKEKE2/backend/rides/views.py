from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .utils import BlastSearch, calculate_haversine_distance, fare_estimator
from decimal import Decimal
from . models import Trips, Status,  PriceConfig,SafetyAlert
from .serializers import DriverStatusSerializer, DriverLocationSerializer, TripEstimateSerializer, TripRequestSerializer
from django.db import transaction
from datetime import timedelta
from django.utils import timezone
from rest_framework import status

import random
# Create your views here.


class DriverHeartbeatView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        lat= request.data.get('lat')
        lng=request.data.get('lng')


        if not lat or not lng:
            return Response ({"error": "Coordinates Required"}, status=400)
        profile= request.user.driver_profile
        profile.update_presence(lat,lng)
        return Response({"status": "updated", "is_online": profile.is_online})



class SearchDriverView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        rider_profile = request.user.rider_profile

        # 1. Create the Trip Record first
        # We need this so the 'blast' has a real database ID to send to drivers
        try:
            # Grab the latest pricing config (Phase 1 logic)
            config = PriceConfig.objects.filter(is_active=True).last()
            dist_km = calculate_haversine_distance(
                float(data.get('pickup_lat')), float(data.get('pickup_lng')),
                float(data.get('dropoff_lat')), float(data.get('dropoff_lng'))
            )
            
            trip = Trips.objects.create(
                rider=rider_profile,
                pickup_location_name=data.get('pickup_location_name'),
                dropoff_location_name=data.get('dropoff_location_name'),
                pickup_lat=data.get('pickup_lat'),
                pickup_lng=data.get('pickup_lng'),
                dropoff_lat=data.get('dropoff_lat'),
                dropoff_lng=data.get('dropoff_lng'),
                final_fare=data.get('final_fare'),
                total_distance=Decimal(str(dist_km)),
                price_config=config,
                status=Status.SEARCHING
            )

            # 2. Now perform the "Blast" using the newly created trip
            drivers = BlastSearch(trip.id)

            if drivers.exists():
                # In a real startup, you'd trigger FCM here
                return Response({
                    'status': 'success',
                    'trip_id': str(trip.id),
                    'drivers_notified': drivers.count()
                })
            
            # If no drivers found, we still created the trip, 
            # but we tell the rider we're struggling
            return Response({
                'status': 'no_drivers_found',
                'trip_id': str(trip.id),
                'message': 'Keep searching? No drivers active in Jimeta right now.'
            }, status=200) # 200 because the trip was still created

        except Exception as e:
            print(f"Error creating trip: {e}")
            return Response({'status': 'error', 'message': str(e)}, status=400)

class RejectRiderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        driver_profile = request.user.driver_profile
        
        try:
            with transaction.atomic():
                # select_for_update() is still good practice here
                trip = Trips.objects.select_for_update().get(id=trip_id)

                # If it's already accepted, the reject button should just disappear
                if trip.status != Status.SEARCHING:
                    return Response({"status": "ignored", "message": "Trip no longer available"})

                # ADD DRIVER TO BLACKLIST
                trip.rejected_by.add(driver_profile)
                
                
                driver_profile.is_online = True
                driver_profile.save()

            return Response({"status": "success", "message": "Ride skipped."})

        except Trips.DoesNotExist:
            return Response({'error': 'Trip not found'}, status=404)

class AcceptRiderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        # 1. Get the driver profile safely
        try:
            driver_profile = request.user.driver_profile
        except AttributeError:
            return Response({'error': 'User is not a driver'}, status=403)

        try:
            with transaction.atomic():
                # 2. Lock the specific trip row immediately. 
                # select_for_update(nowait=False) makes others wait in line.
                trip = Trips.objects.select_for_update().get(id=trip_id)

                # 3. Double-check: Is the trip still available?
                if trip.status != Status.SEARCHING or trip.driver is not None:
                    return Response({
                        'error': "Too late! This ride was just snatched by another Keke."
                    }, status=400)

                # 4. Optional but Recommended: Is the driver already on a trip?
                # This prevents one driver from 'hoarding' multiple blast requests.
                if Trips.objects.filter(driver=driver_profile, status=Status.ACCEPTED).exists():
                    return Response({'error': "You already have an active trip!"}, status=400)

                # 5. Atomic Update
                trip.driver = driver_profile
                trip.status = Status.ACCEPTED
                trip.save()

                # 6. Update Driver State
                # Instead of going 'offline', we mark them as busy.
                # If you use 'is_online=False', remember to flip it back on 'End Trip'.
                driver_profile.is_online = False 
                driver_profile.save()

                # Set initial driver location on trip to driver's last known location
                if driver_profile.last_lat and driver_profile.last_lng:
                    trip.driver_lat = driver_profile.last_lat
                    trip.driver_lng = driver_profile.last_lng
                    trip.save(update_fields=['driver_lat', 'driver_lng'])

                # 7. TODO: Trigger a Push Notification to the Rider here!
                # "Your Keke is on the way!"
                
                from .google_directions import get_route_info
                route_info = None
                if trip.driver_lat and trip.driver_lng:
                    route_info = get_route_info(trip.driver_lat, trip.driver_lng, trip.pickup_lat, trip.pickup_lng)

            response_data = {
                "status": 'success',
                'message': 'Ride secured! Drive safely.',
                'trip_details': {
                    'rider_name': trip.rider.user.get_full_name(),
                    'pickup_location_name': trip.pickup_location_name,
                    'dropoff_location_name': trip.dropoff_location_name,
                    'pickup_lat': trip.pickup_lat,
                    'pickup_lng': trip.pickup_lng,
                    'driver_lat': trip.driver_lat,
                    'driver_lng': trip.driver_lng,
                    'otp': trip.otp # They'll need this for Step 8
                }
            }
            
            if route_info:
                response_data['trip_details']['route_info'] = route_info
                
            return Response(response_data)

        except Trips.DoesNotExist:
            return Response({'error': 'Trip no longer exists'}, status=404)
        except Exception as e:
            # Log this for your internal Sentry/Logs
            return Response({'error': 'A server error occurred'}, status=500)


class StartTripView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request,trip_id):
        input_pin=request.data.get('otp')
        driver=request.user.driver_profile

        try:
            with transaction.atomic():
                trip = Trips.objects.select_for_update().get(id=trip_id, driver=driver)

                if trip.status != Status.ACCEPTED:
                    return Response({'error': ' Trip cannot be started from thsi state '}, status=400)
                
                if input_pin !=trip.otp:
                    return Response({'error':'Invalid PIN. Ask the rider for the PIN on thier screen '},status=403)
                
                trip.status=Status.STARTED
                trip.started_at=timezone.now()
                trip.save()
            return Response({"status": "success", "message": "Trip started. Drive safely!"})
        except:
            return Response({'error':" The trip is not found or you are not assigned to the right driver"})



class TrackingView(APIView):

    permission_classes=[IsAuthenticated]

    def post(self,request,trip_id):
        lat=request.data.get('lat')
        lng=request.data.get('lng')

        try:
            trip=Trips.objects.get(id=trip_id, driver__user=request.user,status=Status.STARTED)
            trip.current_lat=lat
            trip.current_lng=lng
            trip.save(update_fields=['current_lat', 'current_lng'])
            return Response({"status": "tracked"})
        except Trips.DoesNotExist:
            return Response({"error": "No active trip found."}, status=404)
        

from django.utils import timezone
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Trips, Status

class TripCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        user = request.user
        
        try:
            with transaction.atomic():
                # Lock the trip
                trip = Trips.objects.select_for_update().get(id=trip_id)

                # 1. Check if the Rider is cancelling (Allowed during SEARCHING or ACCEPTED)
                if hasattr(user, 'rider_profile') and trip.rider == user.rider_profile:
                    if trip.status in [Status.SEARCHING, Status.ACCEPTED]:
                        trip.status = Status.CANCELLED
                        trip.save()
                        
                        # If a driver was already assigned, put them back online
                        if trip.driver:
                            trip.driver.is_online = True
                            trip.driver.save()
                            
                        return Response({"status": "success", "message": "Trip cancelled by rider."})
                    else:
                        return Response({"error": "You cannot cancel a trip that has already started."}, status=400)

                # 2. Check if the Driver is cancelling (Your original logic)
                elif hasattr(user, 'driver_profile') and trip.driver == user.driver_profile:
                    if trip.status in [Status.ACCEPTED, Status.STARTED]: # Use STARTED to match your status model
                        trip.status = Status.CANCELLED
                        trip.save()
                        
                        # Define the profile here so it doesn't crash
                        driver_prof = user.driver_profile 
                        driver_prof.is_online = True
                        driver_prof.save()
                        
                        return Response({"status": "success", "message": "Trip cancelled."})
                
                return Response({"error": "Unauthorized to cancel this trip."}, status=403)

        except Trips.DoesNotExist:
            return Response({"error": "Trip not found."}, status=404)
        


class EndTripView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        
        input_pin = request.data.get('otp')
        driver = request.user.driver_profile

        if not input_pin:
            return Response({"error": "Completion PIN is required to end the trip."}, status=400)

        try:
            with transaction.atomic():
        
                trip = Trips.objects.select_for_update().get(
                    id=trip_id, 
                    driver=driver, 
                    status=Status.STARTED
                )

            
                if input_pin != trip.otp:
                    return Response({
                        "error": "Invalid PIN. Please ask the rider for the code to confirm arrival."
                    }, status=403)

                trip.status = Status.COMPLETED
                trip.completed_at = timezone.now()
                trip.save()

                driver.is_online = True
                driver.save()

            return Response({
                "status": "success",
                "message": "Trip completed and verified. You are now back online!"
            })

        except Trips.DoesNotExist:
            return Response({"error": "Active trip not found or already completed."}, status=404)


# ============================================================================
# PHASE 1 & 2: RIDE ENGINE ENDPOINTS
# ============================================================================


class DriverStatusView(APIView):
    """Toggle driver online/offline status"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """POST /api/v1/driver/status - Toggle driver online/offline"""
        try:
            driver_profile = request.user.driver_profile
        except:
            return Response(
                {"error": "User does not have a driver profile"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = DriverStatusSerializer(data=request.data)
        if serializer.is_valid():
            driver_profile.is_online = serializer.validated_data['is_online']
            driver_profile.save(update_fields=['is_online'])
            
            return Response({
                "status": "success",
                "message": f"Driver is now {'online' if driver_profile.is_online else 'offline'}",
                "is_online": driver_profile.is_online
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DriverLocationView(APIView):
    """Update driver's GPS location"""
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        """PATCH /api/v1/driver/location - Update GPS coordinates"""
        try:
            driver_profile = request.user.driver_profile
        except:
            return Response(
                {"error": "User does not have a driver profile"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = DriverLocationSerializer(data=request.data)
        if serializer.is_valid():
            driver_profile.last_lat = serializer.validated_data.get('last_lat')
            driver_profile.last_lng = serializer.validated_data.get('last_lng')
            driver_profile.last_active_at = timezone.now()
            driver_profile.save(update_fields=['last_lat', 'last_lng', 'last_active_at'])
            
            return Response({
                "status": "success",
                "message": "Location updated",
                "location": {
                    "lat": float(driver_profile.last_lat),
                    "lng": float(driver_profile.last_lng),
                    "last_active_at": driver_profile.last_active_at.isoformat()
                }
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TripEstimateView(APIView):
    """Calculate fare estimate based on pickup and dropoff coordinates"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """POST /api/v1/trips/estimate - Get fare estimate"""
        serializer = TripEstimateSerializer(data=request.data)
        
        if serializer.is_valid():
            pickup_lat = serializer.validated_data['pickup_lat']
            pickup_lng = serializer.validated_data['pickup_lng']
            dropoff_lat = serializer.validated_data['dropoff_lat']
            dropoff_lng = serializer.validated_data['dropoff_lng']

            # Calculate distance
            distance = calculate_haversine_distance(
                pickup_lat, pickup_lng, 
                dropoff_lat, dropoff_lng
            )

            # Get active pricing config
            try:
                price_config = PriceConfig.objects.get(is_active=True)
            except PriceConfig.DoesNotExist:
                return Response(
                    {"error": "No active pricing configuration found"},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

            # Calculate fare
            estimated_fare = fare_estimator(price_config, distance)

            return Response({
                "status": "success",
                "estimate": {
                    "distance_km": float(distance),
                    "estimated_fare": float(estimated_fare),
                    "base_fare": float(price_config.base_fare),
                    "currency": "NGN"
                }
            }, status=status.HTTP_200_OK)
        print("DEBUG SERIALIZER ERRORS:", serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TripRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        
        try:
            # 1. Get the Gatekeeper (PriceConfig)
            config = PriceConfig.objects.filter(is_active=True).first()
            if not config:
                return Response({"error": "Pricing not configured"}, status=400)

            # 2. Calculate Distance (KM)
            dist_km = calculate_haversine_distance(
                data['pickup_lat'], data['pickup_lng'],
                data['dropoff_lat'], data['dropoff_lng']
            )
            
            # 3. Calculate Fare using your model's logic
            # Price = Base + (KM * Distance Price)
            raw_fare = Decimal(config.base_fare) + (Decimal(dist_km) * Decimal(config.distance_price))
            
            # Ensure it doesn't fall below min_fare
            final_fare = max(raw_fare, Decimal(config.min_fare))

            # 4. Create the Trip with ALL required fields
            # Note: The 'otp' is generated automatically in your model's save()
            trip = Trips.objects.create(
                rider=request.user.rider_profile, # Assumes 1-to-1 link on User
                pickup_location_name=data['pickup_location_name'],
                dropoff_location_name=data['dropoff_location_name'],
                pickup_lat=data['pickup_lat'],
                pickup_lng=data['pickup_lng'],
                dropoff_lat=data['dropoff_lat'],
                dropoff_lng=data['dropoff_lng'],
                price_config=config,
                total_distance=Decimal(dist_km),
                final_fare=final_fare,
                status=Status.SEARCHING
            )

            return Response({
                "trip_id": str(trip.id),
                "fare": float(final_fare),
                "otp": trip.otp, # Usually you don't send this to rider yet, but good for debug
                "status": trip.status
            }, status=201)

        except Exception as e:
            print(f"TRIP CREATION FAILED: {str(e)}")
            return Response({"error": "Failed to initiate trip"}, status=500)
           
        
class TripStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, trip_id):
        try:
            # We fetch the trip and ensure it belongs to the requesting rider
            trip = Trips.objects.select_related('driver__user').get(id=trip_id, rider__user=request.user)
            
            response_data = {
                'trip_id': str(trip.id),
                'status': trip.status,
                'final_fare': trip.final_fare, # Good to show the rider what they will pay
            }

            # If the driver has accepted OR the trip has started, send driver info & the current OTP
            if trip.status in [Status.ACCEPTED, Status.STARTED] and trip.driver:
                response_data['driver'] = {
                    'name': trip.driver.user.get_full_name() or trip.driver.user.username,
                    'phone': getattr(trip.driver.user, 'phone_number', 'N/A'),
                    'keke_plate': getattr(trip.driver, 'plate_number', 'N/A'),
                }
                
                # THE MAGIC: 
                # If status is ACCEPTED, this is the Start PIN.
                # If status is STARTED, this is the newly generated End PIN.
                response_data['otp'] = trip.otp
                
                response_data['driver_lat'] = trip.driver_lat
                response_data['driver_lng'] = trip.driver_lng
                response_data['pickup_lat'] = trip.pickup_lat
                response_data['pickup_lng'] = trip.pickup_lng
                
                if trip.status == Status.ACCEPTED and trip.driver_lat and trip.driver_lng:
                    from .google_directions import get_route_info
                    route_info = get_route_info(trip.driver_lat, trip.driver_lng, trip.pickup_lat, trip.pickup_lng)
                    if route_info:
                        response_data['distance_to_pickup'] = route_info.get('distance_text')
                        response_data['eta_minutes'] = route_info.get('duration_minutes')

            return Response(response_data, status=200)

        except Trips.DoesNotExist:
            return Response({'error': 'Trip not found'}, status=404)
        
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
# (Assuming Trips and Status are imported here)

class AvailableOffersView(APIView):
    """
    Returns a list of trips that are currently SEARCHING, 
    have NOT been rejected by this driver, 
    and were created within the last 30 minutes.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            driver_profile = request.user.driver_profile
        except AttributeError:
            return Response({'error': 'Only drivers can view offers'}, status=403)

        # Calculate the cutoff time (30 minutes ago)
        thirty_minutes_ago = timezone.now() - timedelta(minutes=30)

        # 1. Filter trips: 
        # - Status is SEARCHING
        # - Not already assigned to a driver
        # - Created within the last 30 minutes (<-- NEW)
        # - NOT in the rejected_by list for this specific driver
        offers = Trips.objects.filter(
            status=Status.SEARCHING,
            driver__isnull=True,
            created_at__gte=thirty_minutes_ago  # 'gte' means Greater Than or Equal to
        ).exclude(rejected_by=driver_profile).order_by('-created_at')

        # 2. Map the data to the format your React Native Frontend expects
        data = []
        for trip in offers:
            data.append({
                "id": trip.id,
                "rider_phone": trip.rider.user.phone_number,
                "pickup_location_name": trip.pickup_location_name,
                "dropoff_location_name": trip.dropoff_location_name,
                "final_fare": float(trip.final_fare),
                "pickup_lat": trip.pickup_lat,
                "pickup_lng": trip.pickup_lng,
                "created_at": trip.created_at
            })

        return Response(data)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Trips, Status

class CurrentActiveTripView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Look for an active trip assigned to this driver
            # We specifically check for ACCEPTED or STARTED states based on your audit
            active_trip = Trips.objects.filter(
                driver__user=request.user, 
                status__in=[Status.ACCEPTED, Status.STARTED]
            ).first()

            if not active_trip:
                return Response({"active": False}, status=200)

            return Response({
                "active": True,
                "trip_id": str(active_trip.id),
                "status": active_trip.status,
                "rider_name": active_trip.rider.user.get_full_name() or active_trip.rider.user.username,
                # We pull the 6-digit OTP that was generated by your Trips.save() override
                "otp": active_trip.otp, 
            }, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)




from django.db import transaction # <--- MANDATORY IMPORT
from rest_framework.permissions import IsAuthenticated

class VerifyTripOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        action = request.data.get('action') 
        input_otp = request.data.get('otp')

        try:
            # 1. Start the transaction block here
            with transaction.atomic():
                # 2. This line WILL NOT CRASH anymore once inside atomic()
                trip = Trips.objects.select_for_update().get(
                    id=trip_id, 
                    driver__user=request.user
                )

                # 3. VERIFY PIN
                if str(trip.otp) != str(input_otp):
                    return Response({"error": "Invalid PIN."}, status=400)

                # 4. HANDLE ACTIONS
                if action == 'start':
                    if trip.status != Status.ACCEPTED:
                        return Response({"error": "Trip not in 'Accepted' state."}, status=400)
                    
                    trip.status = Status.STARTED
                    trip.rotate_otp() # Generate the completion PIN
                    trip.save() 
                    
                    return Response({
                        "message": "Ride Started! New PIN generated.",
                        "next_otp_for_testing": trip.otp 
                    })

                elif action == 'end':
                    if trip.status != Status.STARTED:
                        return Response({"error": "Ride must be started first."}, status=400)

                    trip.status = Status.COMPLETED
                    trip.save() 

                    return Response({"message": "Ride Completed Successfully."})

        except Trips.DoesNotExist:
            return Response({"error": "Trip not found or not assigned to you."}, status=404)
        except Exception as e:
            # This logs the real error to your VS Code / CMD terminal
            print(f"CRITICAL ERROR IN VERIFY: {str(e)}")
            return Response({"error": "Server error during verification."}, status=500)

class TriggerSOSView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        try:
            trip = Trips.objects.get(id=trip_id)
            # Log the SOS in the database
            alert = SafetyAlert.objects.create(
                trip=trip,
                user=request.user,
                lat=request.data.get('lat'),
                lng=request.data.get('lng')
            )
            # FUTURE: Trigger SMS/Email to your Yola security partner here
            print(f"!!! SOS TRIGGERED !!! Trip: {trip_id} by {request.user.username}")
            
            return Response({"status": "success", "message": "Emergency alert logged."})
        except Trips.DoesNotExist:
            return Response({"error": "Trip not found"}, status=404)

from .google_directions import get_route_info

class DriverLocationTrackingView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, trip_id):
        """REST fallback for driver location updates when WebSocket is unavailable"""
        try:
            trip = Trips.objects.get(id=trip_id)
            
            # Verify driver owns this trip and it's ACCEPTED/STARTED
            if trip.driver and trip.driver.user == request.user and trip.status in [Status.ACCEPTED, Status.STARTED]:
                lat = request.data.get('lat')
                lng = request.data.get('lng')
                
                if not lat or not lng:
                    return Response({"error": "Latitude and longitude required"}, status=400)
                    
                # Update trip.driver_lat, trip.driver_lng
                trip.driver_lat = lat
                trip.driver_lng = lng
                trip.save(update_fields=['driver_lat', 'driver_lng'])
                
                # Update driver_profile.last_lat, last_lng
                driver_profile = request.user.driver_profile
                driver_profile.last_lat = lat
                driver_profile.last_lng = lng
                driver_profile.last_active_at = timezone.now()
                driver_profile.save(update_fields=['last_lat', 'last_lng', 'last_active_at'])
                
                return Response({"status": "success"})
            else:
                return Response({"error": "Unauthorized"}, status=403)
                
        except Trips.DoesNotExist:
            return Response({"error": "Trip not found"}, status=404)
        
    def get(self, request, trip_id):
        """Get latest driver position (for passenger REST fallback)"""
        try:
            trip = Trips.objects.get(id=trip_id)
            
            # Verify user is the passenger for this trip
            if trip.rider and trip.rider.user == request.user:
                if trip.status not in [Status.ACCEPTED, Status.STARTED]:
                    return Response({"error": "Trip not active"}, status=400)
                    
                response_data = {
                    "driver_lat": trip.driver_lat,
                    "driver_lng": trip.driver_lng
                }
                
                # Add route info if driver location is available
                if trip.driver_lat and trip.driver_lng:
                    if trip.status == Status.ACCEPTED:
                        # Driver going to pickup
                        route_info = get_route_info(trip.driver_lat, trip.driver_lng, trip.pickup_lat, trip.pickup_lng)
                    else:
                        # Driver going to dropoff
                        route_info = get_route_info(trip.driver_lat, trip.driver_lng, trip.dropoff_lat, trip.dropoff_lng)
                        
                    if route_info:
                        response_data["route_info"] = route_info
                        
                return Response(response_data)
            else:
                return Response({"error": "Unauthorized"}, status=403)
                
        except Trips.DoesNotExist:
            return Response({"error": "Trip not found"}, status=404)