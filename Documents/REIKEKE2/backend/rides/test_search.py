from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import DriverProfile, RiderProfile, Trips, PriceConfig, Status

User = get_user_model()

class DriverSearchTests(APITestCase):
    def setUp(self):
        # 1. Setup Pricing Logic
        self.config = PriceConfig.objects.create(
            base_fare=500, 
            distance_price=100, 
            min_fare=500
        )
        
        # 2. Setup Rider
        self.rider_user = User.objects.create_user(
            email='rider@test.com', 
            password='pass123', 
            phone_number='08011111111'
        )
        # Handle potential auto-creation from signals
        self.rider_profile, _ = RiderProfile.objects.get_or_create(user=self.rider_user)
        
        # 3. Setup Drivers
        # Driver 1: Online (Should be found)
        self.d1_user = User.objects.create_user(
            email='d1@test.com', password='pass123', phone_number='08022222222'
        )
        self.driver_ready, _ = DriverProfile.objects.get_or_create(user=self.d1_user)
        self.driver_ready.is_online = True
        self.driver_ready.save()
        
        # Driver 2: Offline (Should be ignored)
        self.d2_user = User.objects.create_user(
            email='d2@test.com', password='pass123', phone_number='08033333333'
        )
        self.driver_offline, _ = DriverProfile.objects.get_or_create(user=self.d2_user)
        self.driver_offline.is_online = False
        self.driver_offline.save()
        
        # Driver 3: Online but will reject (Should be ignored)
        self.d3_user = User.objects.create_user(
            email='d3@test.com', password='pass123', phone_number='08044444444'
        )
        self.driver_rejector, _ = DriverProfile.objects.get_or_create(user=self.d3_user)
        self.driver_rejector.is_online = True
        self.driver_rejector.save()

        # 4. Setup the Trip
        self.trip = Trips.objects.create(
            rider=self.rider_profile,
            pickup_location_name="Yola Market",
            dropoff_location_name="Jimeta",
            pickup_lat=9.2035, pickup_lng=12.4850,
            dropoff_lat=9.2350, dropoff_lng=12.4950,
            price_config=self.config,
            total_distance=5.0,
            final_fare=1000
        )

    def test_blast_search_finds_correct_drivers(self):
        """
        Verify that BlastSearch finds exactly one driver:
        - Excludes offline drivers
        - Excludes drivers who rejected the trip
        """
        # Simulate Driver 3 rejecting the trip
        self.trip.rejected_by.add(self.driver_rejector)
        
        url = reverse('search-drivers')
        data = {
            'trip_id': str(self.trip.id), 
            'lat': 9.2035, 
            'lng': 12.4850
        }
        
        self.client.force_authenticate(user=self.rider_user)
        response = self.client.post(url, data, format='json')

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Only self.driver_ready should be in the result
        self.assertEqual(response.data['drivers_notified'], 1)