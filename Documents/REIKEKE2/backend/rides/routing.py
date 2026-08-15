from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/tracking/<uuid:trip_id>/', consumers.TripTrackingConsumer.as_asgi()),
]
