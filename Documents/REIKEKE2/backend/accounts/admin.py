from django.contrib import admin
from .models import Account,DriverProfile,RiderProfile

admin.site.register(Account)
admin.site.register(DriverProfile)
admin.site.register(RiderProfile)