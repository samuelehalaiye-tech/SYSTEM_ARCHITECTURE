from django.urls import path
from .views import (
    DriverHeartbeatView,
    SearchDriverView,
    RejectRiderView,
    AcceptRiderView,
    StartTripView,
    TrackingView,
    TripCancelView,
    EndTripView,
    DriverStatusView,
    DriverLocationView,
    TripEstimateView,
    TripRequestView,
    TripStatusView,
    AvailableOffersView,
    CurrentActiveTripView,
    VerifyTripOTPView,
    TriggerSOSView,
    DriverLocationTrackingView,
)

urlpatterns = [
    # 1. Static/Global Trip Operations (MOVE THIS TOP TO AVOID UUID COLLISION)
    path('trips/current/', CurrentActiveTripView.as_view(), name='current-active-trip'),
    path('offers/', AvailableOffersView.as_view(), name='available-offers'), 
    path('estimate/', TripEstimateView.as_view(), name='trip-estimate'),
    
    # 2. Driver Operations
    path('driver/heartbeat/', DriverHeartbeatView.as_view(), name='driver-heartbeat'),
    path('driver/status/', DriverStatusView.as_view(), name='driver-status'),
    # rides/urls.py
    path('<uuid:trip_id>/verify/', VerifyTripOTPView.as_view(), name='verify-otp'),
    path('driver/location/', DriverLocationView.as_view(), name='driver-location'),
    
    # 3. Ride Engine - Discovery Phase
    path('request/', SearchDriverView.as_view(), name='request-ride'),
    path('request-trip/', TripRequestView.as_view(), name='trip-request'), # Renamed slightly to avoid 'request/' duplicate
    
    # 4. Dynamic Trip Operations (UUID based)
    path('trips/<uuid:trip_id>/accept/', AcceptRiderView.as_view(), name='accept-trip'),
    path('trips/<uuid:trip_id>/reject/', RejectRiderView.as_view(), name='reject-trip'),
    path('trips/<uuid:trip_id>/status/', TripStatusView.as_view(), name='trip-status'),
    path('trips/<uuid:trip_id>/start/', StartTripView.as_view(), name='start-trip'),
    path('trips/<uuid:trip_id>/track/', TrackingView.as_view(), name='track-trip'),
    path('trips/<uuid:trip_id>/cancel/', TripCancelView.as_view(), name='cancel-trip'),
    path('trips/<uuid:trip_id>/end/', EndTripView.as_view(), name='end-trip'),
    path('trips/<uuid:trip_id>/location/', DriverLocationTrackingView.as_view(), name='trip-location'),
    path('trips/<int:trip_id>/sos/', TriggerSOSView.as_view(), name='trigger-sos'),
]