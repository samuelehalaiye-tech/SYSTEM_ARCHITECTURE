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
)

urlpatterns = [
    # Driver Operations
    path('driver/heartbeat/', DriverHeartbeatView.as_view(), name='driver-heartbeat'),
    path('driver/status/', DriverStatusView.as_view(), name='driver-status'),  # PHASE 1
    path('driver/location/', DriverLocationView.as_view(), name='driver-location'),
    # rides/urls.py
path('offers/', AvailableOffersView.as_view(), name='available-offers'), 
      # PHASE 1
    
    # Ride Engine - Discovery Phase
    path('request/', SearchDriverView.as_view(), name='request-ride'),
    path('trips/<uuid:trip_id>/reject/', RejectRiderView.as_view(), name='reject-trip'),
    path('trips/<uuid:trip_id>/accept/', AcceptRiderView.as_view(), name='accept-trip'),
    
    # Ride Engine - Trip Management
    path('trips/<uuid:trip_id>/status/', TripStatusView.as_view(), name='trip-status'),
    path('estimate/', TripEstimateView.as_view(), name='trip-estimate'),  # PHASE 1
    path('request/', TripRequestView.as_view(), name='trip-request'),  # PHASE 1
    path('trips/<uuid:trip_id>/start/', StartTripView.as_view(), name='start-trip'),
    path('trips/<uuid:trip_id>/track/', TrackingView.as_view(), name='track-trip'),
    path('trips/<uuid:trip_id>/cancel/', TripCancelView.as_view(), name='cancel-trip'),
    path('trips/<uuid:trip_id>/end/', EndTripView.as_view(), name='end-trip'),
]
