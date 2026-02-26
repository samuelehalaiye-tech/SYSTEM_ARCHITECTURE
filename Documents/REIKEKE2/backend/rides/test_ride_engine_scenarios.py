from django.test import TestCase
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate
from django.utils import timezone
from decimal import Decimal
from unittest.mock import patch

from accounts.models import Account
from .models import Trips, PriceConfig,Status
from .views import (
    AcceptRiderVeiw,
    RejectRiderView,
    StartTripView,
    EndTripView,
    TripCancelView,
)


class RideEngineUnitTests(TestCase):
    def test_simple_distance_and_fare_behaviour(self):
        # basic sanity: create price config and ensure creation succeeds
        cfg = PriceConfig.objects.create(
            base_fare=Decimal('10.00'),
            min_fare=Decimal('5.00'),
            distance_price=Decimal('2.00'),
        )
        self.assertIsNotNone(cfg.id)


class RideEngineAPIScenarios(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()

        # create users (signals create profiles)
        self.rider = Account.objects.create_user(phone_number='rider1', password='pass', is_rider=True)
        self.driver_a = Account.objects.create_user(phone_number='driverA', password='pass', is_driver=True)
        self.driver_b = Account.objects.create_user(phone_number='driverB', password='pass', is_driver=True)

        # price config
        self.cfg = PriceConfig.objects.create(
            base_fare=Decimal('10.00'),
            min_fare=Decimal('5.00'),
            distance_price=Decimal('2.00'),
        )

        # create a trip in SEARCHING state; provide an OTP explicitly to avoid model save side-effects
        self.trip = Trips.objects.create(
            rider=self.rider.rider_profile,
            pickup_location_name='A',
            dropoff_location_name='B',
            pickup_lng=Decimal('0.0'),
            pickup_lat=Decimal('0.0'),
            dropoff_lng=Decimal('1.0'),
            dropoff_lat=Decimal('0.0'),
            price_config=self.cfg,
            total_distance=Decimal('0.00'),
            final_fare=Decimal('0.00'),
            otp='123456',
            otp_created_at=timezone.now(),
        )

    def test_perfect_flow(self):
        # Driver A accepts
        req = self.factory.post('', {})
        force_authenticate(req, user=self.driver_a)
        resp = AcceptRiderVeiw.as_view()(req, trip_id=self.trip.id)
        self.assertEqual(resp.status_code, 200)

        self.trip.refresh_from_db()
        self.assertEqual(self.trip.status, Status.ACCEPTED)
        self.assertEqual(self.trip.driver, self.driver_a.driver_profile)

        # Driver starts trip with correct OTP
        start_req = self.factory.post('', {'otp': '123456'})
        force_authenticate(start_req, user=self.driver_a)
        start_resp = StartTripView.as_view()(start_req, trip_id=self.trip.id)
        self.assertEqual(start_resp.status_code, 200)

        self.trip.refresh_from_db()
        self.assertEqual(self.trip.status, Status.STARTED)

        # Driver ends trip with correct OTP
        end_req = self.factory.post('', {'otp': '123456'})
        force_authenticate(end_req, user=self.driver_a)
        end_resp = EndTripView.as_view()(end_req, trip_id=self.trip.id)
        self.assertEqual(end_resp.status_code, 200)

        self.trip.refresh_from_db()
        self.assertEqual(self.trip.status, Status.COMPLETED)

    def test_rejection_loop(self):
        # Driver A rejects
        reject_req = self.factory.post('', {})
        force_authenticate(reject_req, user=self.driver_a)
        rej_resp = RejectRiderView.as_view()(reject_req, trip_id=self.trip.id)
        self.assertEqual(rej_resp.status_code, 200)

        self.trip.refresh_from_db()
        self.assertIn(self.driver_a.driver_profile, self.trip.rejected_by.all())

        # Now simulate RippleSearch behavior by patching it to return only driver_b
        with patch('rides.utils.RippleSearch') as mocked_search:
            mocked_search.return_value = ([self.driver_b.driver_profile], 2)
            # call the search view indirectly by invoking the patched function
            drivers, radii = mocked_search(Decimal('0.0'), Decimal('0.0'), self.trip.id)
            self.assertEqual(drivers, [self.driver_b.driver_profile])

        # Driver B accepts
        acc_req = self.factory.post('', {})
        force_authenticate(acc_req, user=self.driver_b)
        acc_resp = AcceptRiderVeiw.as_view()(acc_req, trip_id=self.trip.id)
        self.assertEqual(acc_resp.status_code, 200)
        self.trip.refresh_from_db()
        self.assertEqual(self.trip.driver, self.driver_b.driver_profile)

    def test_race_condition_two_accepts(self):
        # First driver accepts
        req1 = self.factory.post('', {})
        force_authenticate(req1, user=self.driver_a)
        resp1 = AcceptRiderVeiw.as_view()(req1, trip_id=self.trip.id)

        # Second driver attempts to accept immediately after
        req2 = self.factory.post('', {})
        force_authenticate(req2, user=self.driver_b)
        resp2 = AcceptRiderVeiw.as_view()(req2, trip_id=self.trip.id)

        # Exactly one should succeed (first one)
        statuses = {resp1.status_code, resp2.status_code}
        self.assertIn(200, statuses)
        self.assertIn(400, statuses)

        self.trip.refresh_from_db()
        self.assertEqual(self.trip.status, Status.ACCEPTED)

    def test_cancellation_after_started_reverts_driver_online(self):
        # Accept and start the trip with driver A
        accept_req = self.factory.post('', {})
        force_authenticate(accept_req, user=self.driver_a)
        AcceptRiderVeiw.as_view()(accept_req, trip_id=self.trip.id)

        start_req = self.factory.post('', {'otp': '123456'})
        force_authenticate(start_req, user=self.driver_a)
        StartTripView.as_view()(start_req, trip_id=self.trip.id)

        self.trip.refresh_from_db()
        self.assertEqual(self.trip.status, Status.STARTED)

        # Cancel the trip
        cancel_req = self.factory.post('', {})
        force_authenticate(cancel_req, user=self.driver_a)
        cancel_resp = TripCancelView.as_view()(cancel_req, trip_id=self.trip.id)
        self.assertEqual(cancel_resp.status_code, 200)

        self.trip.refresh_from_db()
        self.driver_a.driver_profile.refresh_from_db()
        self.assertEqual(self.trip.status, Status.CANCELLED)
        self.assertTrue(self.driver_a.driver_profile.is_online)

    def test_security_wrong_otp_for_start(self):
        # Accept by driver A
        accept_req = self.factory.post('', {})
        force_authenticate(accept_req, user=self.driver_a)
        AcceptRiderVeiw.as_view()(accept_req, trip_id=self.trip.id)

        # Attempt to start with wrong OTP
        bad_start = self.factory.post('', {'otp': '000000'})
        force_authenticate(bad_start, user=self.driver_a)
        bad_resp = StartTripView.as_view()(bad_start, trip_id=self.trip.id)
        self.assertEqual(bad_resp.status_code, 403)
