from django.db.models.signals import post_save
from  django.dispatch import receiver
from .models import Account, DriverProfile, RiderProfile


@receiver(post_save, sender=Account)

def create_user_profile(sender, instance, created,**kwargs):
    if created:
        if instance.is_rider:
            RiderProfile.objects.create(user=instance)
            print(f"Rider Profile is created for {instance.phone_number}")
        if instance.is_driver:
            DriverProfile.objects.create(user=instance)
            print(f"Driver profile created for {instance.phone_number}")
