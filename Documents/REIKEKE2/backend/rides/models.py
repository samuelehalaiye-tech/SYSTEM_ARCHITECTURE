from django.db import models
import uuid
from accounts.models import DriverProfile, RiderProfile
from .utils import calculate_haversine_distance
import random
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
    id=models.UUIDField(default=uuid.uuid4,editable=False,primary_key=True)
    rider=models.ForeignKey(RiderProfile, on_delete=models.SET_NULL,null=True,blank=True)
    driver=models.ForeignKey(DriverProfile,on_delete=models.SET_NULL,null=True,blank=True)
    pickup_location_name=models.CharField(max_length=225)
    dropoff_location_name=models.CharField(max_length=225)
    pickup_lng=models.DecimalField(max_digits=20,decimal_places=6)
    pickup_lat=models.DecimalField( max_digits=20, decimal_places=6)
    dropoff_lng=models.DecimalField(max_digits=20,decimal_places=6)
    dropoff_lat=models.DecimalField(max_digits=20,decimal_places=6)
    price_config=models.ForeignKey(PriceConfig,models.CASCADE)
    total_distance=models.DecimalField(max_digits=20,decimal_places=6)
    final_fare=models.DecimalField(max_digits=20,decimal_places=2)
    def update_distance(self):
        calculate_distance=calculate_haversine_distance(self.pickup_lat,self.pickup_lng,self.dropoff_lat,self.dropoff_lng)
        self.total_distance=calculate_distance
        self.save(update_fields=['total_distance'])

    status=models.CharField(max_length=225,choices=Status.choices,default=Status.SEARCHING)
    otp= models.CharField(max_length=6, null=True)
            
    otp_created_at=models.DateTimeField(auto_now=True, null=True)
    created_at=models.DateTimeField(auto_now_add=True)
    started_at=models.DateTimeField(null=True, blank=True)
    completed_at=models.DateTimeField(null=True, blank=True)
    rejected_by = models.ManyToManyField(
        DriverProfile, 
        related_name='rejected_trips', 
        blank=True
    )


    def save(self, *args, **kwargs):
        if not self.otp:
            self.otp = str(random.randint(100000, 999999))
            self.otp_created_at = timezone.now()
        super().save(*args, **kwargs)












