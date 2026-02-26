from django.contrib import admin
from .models import PriceConfig, Trips
# Register your models here.


admin.site.register(PriceConfig)
@admin.register(Trips)
class TripsAdmin(admin.ModelAdmin):
    
    list_display = ('id', 'rider', 'driver', 'status', 'otp', 'created_at')
    

    list_filter = ('status', 'created_at')
    
   
    search_fields = ('id', 'rider__username', 'driver__user__username')
    

    readonly_fields = ('otp', 'created_at', 'started_at', 'completed_at')


    def get_queryset(self, request):
        return super().get_queryset(request).select_related('rider', 'driver__user')