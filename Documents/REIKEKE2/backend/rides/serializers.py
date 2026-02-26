from rest_framework import serializers
from accounts.models import DriverProfile
from .models import Trips, PriceConfig


class HeartbeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverProfile
        fields = ['current_lat', 'current_lng', 'is_online']


class DriverStatusSerializer(serializers.ModelSerializer):
    """Toggle driver online/offline status"""
    class Meta:
        model = DriverProfile
        fields = ['is_online']


class DriverLocationSerializer(serializers.ModelSerializer):
    """Update driver's GPS location coordinates"""
    class Meta:
        model = DriverProfile
        fields = ['last_lat', 'last_lng']


class TripEstimateSerializer(serializers.Serializer):
    """Calculate fare estimate for a trip"""
    pickup_lat = serializers.DecimalField(max_digits=20, decimal_places=6)
    pickup_lng = serializers.DecimalField(max_digits=20, decimal_places=6)
    dropoff_lat = serializers.DecimalField(max_digits=20, decimal_places=6)
    dropoff_lng = serializers.DecimalField(max_digits=20, decimal_places=6)


class TripRequestSerializer(serializers.ModelSerializer):
    """Initialize a new trip request"""
    class Meta:
        model = Trips
        fields = [
            'pickup_location_name',
            'dropoff_location_name',
            'pickup_lat',
            'pickup_lng',
            'dropoff_lat',
            'dropoff_lng',
        ] 