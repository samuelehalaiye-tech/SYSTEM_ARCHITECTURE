from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from decimal import Decimal
from accounts.models import Account, RiderProfile, DriverProfile
from .models import Trips, PriceConfig, Status


class PassengerLocationTests(TestCase):
    def setUp(self):
        # Create price config
        self.price = PriceConfig.objects.create(
            base_fare=Decimal('100.00'),
            min_fare=Decimal('50.00'),
            distance_price=Decimal('20.00'),
            is_active=True,
        )

        # Rider user
        self.rider_user = Account.objects.create_user(phone_number='08000000001', password='pass')
        RiderProfile.objects.create(user=self.rider_user)

        # Driver user
        self.driver_user = Account.objects.create_user(phone_number='08000000002', password='pass')
        driver_profile = DriverProfile.objects.create(user=self.driver_user, plate_number='ABC123')

        # Create trip assigned to rider and driver
        self.trip = Trips.objects.create(
            rider=self.rider_user.rider_profile,
            driver=driver_profile,
            pickup_location_name='Test Pickup',
            dropoff_location_name='Test Dropoff',
            pickup_lat=Decimal('9.210000'),
            pickup_lng=Decimal('12.490000'),
            dropoff_lat=Decimal('9.220000'),
            dropoff_lng=Decimal('12.500000'),
            price_config=self.price,
            total_distance=Decimal('1.0'),
            final_fare=Decimal('120.00'),
            status=Status.ACCEPTED,
        )

        self.client = APIClient()

    def test_model_passenger_fields_settable(self):
        # Unit test: set and read passenger_lat/passenger_lng
        self.trip.passenger_lat = Decimal('9.211111')
        self.trip.passenger_lng = Decimal('12.499999')
        self.trip.save()

        t = Trips.objects.get(id=self.trip.id)
        self.assertEqual(float(t.passenger_lat), 9.211111)
        self.assertEqual(float(t.passenger_lng), 12.499999)

    def test_post_passenger_location_updates_trip(self):
        # Integration: rider posts device GPS
        url = reverse('passenger-location', kwargs={'trip_id': self.trip.id})
        self.client.force_authenticate(user=self.rider_user)
        payload = {'lat': 9.300000, 'lng': 12.600000}
        resp = self.client.post(url, data=payload, format='json')
        self.assertEqual(resp.status_code, 200)

        t = Trips.objects.get(id=self.trip.id)
        self.assertAlmostEqual(float(t.passenger_lat), 9.3, places=6)
        self.assertAlmostEqual(float(t.passenger_lng), 12.6, places=6)

    def test_get_passenger_location_by_driver(self):
        # Setup passenger coords
        self.trip.passenger_lat = Decimal('9.301000')
        self.trip.passenger_lng = Decimal('12.601000')
        self.trip.save()

        url = reverse('passenger-location', kwargs={'trip_id': self.trip.id})
        self.client.force_authenticate(user=self.driver_user)
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn('passenger_lat', data)
        self.assertIn('passenger_lng', data)
        self.assertAlmostEqual(float(data['passenger_lat']), 9.301, places=6)
        self.assertAlmostEqual(float(data['passenger_lng']), 12.601, places=6)

    def test_get_passenger_location_unauthorized(self):
        # Another user should be forbidden
        other = Account.objects.create_user(phone_number='08000000003', password='pass')
        url = reverse('passenger-location', kwargs={'trip_id': self.trip.id})
        self.client.force_authenticate(user=other)
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, 403)
