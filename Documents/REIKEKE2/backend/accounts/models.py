
from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
import uuid
from datetime import timezone


class AccountManager(BaseUserManager):
    def create_user(self, phone_number, password=None, **extra_fields):
        if not phone_number:
            raise ValueError("The Phone Number must be set")
        user = self.model(phone_number=phone_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone_number, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(phone_number, password, **extra_fields)


class Account(AbstractUser):
    username = None 
    
    id = models.UUIDField(primary_key=True, editable=False, default=uuid.uuid4)
    phone_number = models.CharField(max_length=20, unique=True)
    is_rider = models.BooleanField(default=True)
    is_driver = models.BooleanField(default=False)

    USERNAME_FIELD = 'phone_number' 
    REQUIRED_FIELDS = [] 
    
    objects = AccountManager() 



class RiderProfile(models.Model):
    user=models.OneToOneField(Account,on_delete=models.CASCADE,related_name='rider_profile')
    created_at=models.DateTimeField(auto_now_add=True)

class DriverProfile(models.Model):
    user=models.OneToOneField(Account,on_delete=models.CASCADE,related_name='driver_profile')
    created_at=models.DateTimeField(auto_now_add=True)
    is_online=models.BooleanField(default=True)
    plate_number=models.CharField(max_length=20)
    last_lat = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    last_lng = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    last_active_at=models.DateTimeField(null=True, blank=True)

    def update_self(self,lat,lng):
        self.last_lng=lng
        self.last_lat=lat
        self.last_active_at=timezone.now()
        self.is_online=True
        self.save()

