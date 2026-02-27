from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .utils import RippleSearch, calculate_haversine_distance, fare_estimator
from decimal import Decimal
from . models import Trips, Status,  PriceConfig
from .serializers import DriverStatusSerializer, DriverLocationSerializer, TripEstimateSerializer, TripRequestSerializer
from django.db import transaction
from datetime import timezone
from django.utils import timezone
from rest_framework import status
import math

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
    def post(self,request):
        lat=Decimal(request.data.get('lat'))
        lng=Decimal(request.data.get('lng'))

        drivers, found_radii= RippleSearch(lat,lng)

        if drivers:
            return Response({
                'status':'successs',
                'message':f"found {drivers.count()} drivers within {found_radii}km",
                'drivers': [d.id for d in drivers]
            })

        return Response({
            'status':'Empty',
            'message':'No drivers available nearby. Expanding search failed.',


        }, status=404)



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

class AcceptRiderVeiw(APIView):
    permission_classes=[IsAuthenticated]


    def post(self,request,trip_id):

        driver_profile=request.user.driver_profile

        try:
            with transaction.atomic():
                trip=Trips.objects.select_for_update().get(id=trip_id)

                if trip.status != Status.SEARCHING:
                    return Response({'error':"Ride has been taken by another keke"}, status=400)


                trip.driver=driver_profile
                trip.status=Status.ACCEPTED
                trip.save()

                driver_profile.is_online=False
                driver_profile.save()
            return Response({"status":'success','message':'The ride is yours'})
        

        except Trips.DoesNotExist:
            return Response({'error':'Trip not found'}, status=404)


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
        driver_profile = request.user.driver_profile
       

        try:
            with transaction.atomic():
                
                trip = Trips.objects.select_for_update().get(
                    id=trip_id, 
                    driver=driver_profile, 
                    status__in=[Status.ACCEPTED, Status.STARTED]
                )

                trip.status = Status.CANCELLED
            
                trip.completed_at = timezone.now() 
                trip.save()

              
                driver_profile.is_online = True
                driver_profile.save()

            return Response({
                "status": "success",
                "message": f"Trip {trip_id} cancelled. You are now back online."
            })

        except Trips.DoesNotExist:
            return Response({
                "error": "Cancellable trip not found. It may have already been completed."
            }, status=404)
        


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