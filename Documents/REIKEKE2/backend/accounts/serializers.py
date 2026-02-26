from rest_framework import serializers
from .models import Account, RiderProfile, DriverProfile
from django.db import transaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
class RiderProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RiderProfile
        fields = '__all__' # Or specific fields like ['address', 'rating']

        

class DriverProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverProfile
        fields = '__all__'

class AccountSerializer(serializers.ModelSerializer):
    # This nests the profile data inside the account data
    rider_profile = RiderProfileSerializer(read_only=True)
    driver_profile = DriverProfileSerializer(read_only=True)

    class Meta:
        model = Account
        fields = [
            'id', 'phone_number',   'is_rider', 'is_driver', 'rider_profile', 'driver_profile'
        ]


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = ('phone_number', 'password', 'is_rider', 'is_driver')

    def create(self, validated_data):
    # Use an atomic transaction: if any part fails, the whole thing rolls back.
        with transaction.atomic():
            # 1. Create the User
            user = Account.objects.create_user(
                phone_number=validated_data['phone_number'],
                password=validated_data['password'],
                is_rider=validated_data.get('is_rider', False),
                is_driver=validated_data.get('is_driver', False),
            )
            
            # 2. Handle Rider Profile
            if user.is_rider:
                # get_or_create prevents the 500 error if the record somehow exists
                RiderProfile.objects.get_or_create(user=user)
            
            # 3. Handle Driver Profile
            if user.is_driver:
                # We use get_or_create to avoid the 'duplicate key' crash you saw
                DriverProfile.objects.get_or_create(user=user)
                print(f"DEBUG: Driver profile created/verified for {user.phone_number}")
        
        return user
    


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims (these are encoded INSIDE the token)
        token['is_driver'] = user.is_driver
        token['is_rider'] = user.is_rider
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add extra data to the response (this is visible in the JSON)
        data['is_driver'] = self.user.is_driver
        data['is_rider'] = self.user.is_rider
        return data