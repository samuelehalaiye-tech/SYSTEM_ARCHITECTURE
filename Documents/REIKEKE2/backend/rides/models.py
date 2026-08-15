from django.db import models
import uuid
from accounts.models import DriverProfile, RiderProfile
from .utils import calculate_haversine_distance
import random
from django.conf import settings
from django.utils import timezone
# Create your models here.
class PriceConfig(models.Model):
    id=models.UUIDField(editable=False, default=uuid.uuid4, primary_key=True)
    base_fare=models.DecimalField(max_digits=20,decimal_places=2)
    min_fare=models.DecimalField(max_digits=20,decimal_places=2)
    distance_price=models.DecimalField(max_digits=20,decimal_places=2)
    is_active=models.BooleanField(default=True)
    created_at=models.DateTimeField(auto_now_add=True)


    def __str__(self):
        
        return f"Price Config {self.id} - Active: {self.is_active}"


class Status(models.TextChoices):
        SEARCHING= "SEARCHING","Looking for a keke"
        ACCEPTED="ACCEPTED",'Driver is on the way'
        STARTED="STARTED","Passenger is in the keke"
        COMPLETED="COMPLETED","Ride finished"
        CANCELLED="CANCELLED","Someone gave up"
        REJECTED="REJECTED","The driver rejected the trip"

class Trips(models.Model):
    id = models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)
    rider = models.ForeignKey(RiderProfile, on_delete=models.SET_NULL, null=True, blank=True)
    driver = models.ForeignKey(DriverProfile, on_delete=models.SET_NULL, null=True, blank=True)
    pickup_location_name = models.CharField(max_length=225)
    dropoff_location_name = models.CharField(max_length=225)
    pickup_lng = models.DecimalField(max_digits=20, decimal_places=6)
    pickup_lat = models.DecimalField(max_digits=20, decimal_places=6)
    dropoff_lng = models.DecimalField(max_digits=20, decimal_places=6)
    dropoff_lat = models.DecimalField(max_digits=20, decimal_places=6)
    driver_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    driver_lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    price_config = models.ForeignKey(PriceConfig, on_delete=models.CASCADE)
    total_distance = models.DecimalField(max_digits=20, decimal_places=6)
    final_fare = models.DecimalField(max_digits=20, decimal_places=2)
    
    status = models.CharField(max_length=225, choices=Status.choices, default=Status.SEARCHING)
    otp = models.CharField(max_length=6, null=True, blank=True)
    
    # FIX: Changed auto_now=True to null=True. 
    # auto_now=True overwrites your manual rotation timestamp every time you save.
    otp_created_at = models.DateTimeField(null=True, blank=True) 
    
    created_at = models.DateTimeField(auto_now_add=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    rejected_by = models.ManyToManyField(DriverProfile, related_name='rejected_trips', blank=True)

    def rotate_otp(self):
        """Force a new 6-digit PIN and update the timestamp"""
        self.otp = str(random.randint(100000, 999999))
        self.otp_created_at = timezone.now()

    def update_distance(self):
        """Calculates distance and saves ONLY that field to avoid loops"""
        dist = calculate_haversine_distance(
            self.pickup_lat, self.pickup_lng, 
            self.dropoff_lat, self.dropoff_lng
        )
        self.total_distance = dist
        # We call super().save() or self.save(update_fields) 
        # but be careful not to trigger custom logic that calls this again.
        self.save(update_fields=['total_distance'])

    def save(self, *args, **kwargs):
    # Get 'update_fields' from kwargs if it exists
        update_fields = kwargs.get('update_fields')

        # ONLY generate/rotate logic if we aren't doing a specific partial update
        # or if 'otp' is specifically being updated.
        if update_fields is None or 'otp' in update_fields or 'status' in update_fields:
            
            # 1. INITIAL OTP GENERATION
            if not self.otp:
                self.rotate_otp()
            
            # 2. AUTO-FILL TIMES
            if self.status == Status.STARTED and not self.started_at:
                self.started_at = timezone.now()
            elif self.status == Status.COMPLETED and not self.completed_at:
                self.completed_at = timezone.now()

            # 3. DEBUG TRACER
            print(f"\n🛰️  KEKE ENGINE: SAVING TRIP {str(self.id)[:8]} | STATUS: {self.status} | PIN: {self.otp}")

        super().save(*args, **kwargs)

class SafetyAlert(models.Model):
    trip = models.ForeignKey('Trips', on_delete=models.CASCADE, related_name='alerts')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    lat = models.DecimalField(max_digits=9, decimal_places=6)
    lng = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)

    def __str__(self):
        return f"SOS - Trip {self.trip.id} - {self.user.username}"