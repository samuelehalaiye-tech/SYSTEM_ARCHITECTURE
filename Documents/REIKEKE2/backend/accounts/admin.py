from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Account, DriverProfile, RiderProfile

# Register the Account model using Django's secure UserAdmin class
admin.site.register(Account, UserAdmin)

# Register the profiles normally
admin.site.register(DriverProfile)
admin.site.register(RiderProfile)