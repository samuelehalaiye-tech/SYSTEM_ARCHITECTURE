from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Account, DriverProfile, RiderProfile

class AccountAdmin(UserAdmin):
    model = Account

    # 1. The columns shown on the main user list page
    list_display = ('phone_number', 'is_rider', 'is_driver', 'is_staff', 'is_active')

    # 2. The fields shown when EDITING an existing user (username is removed here)
    fieldsets = (
        (None, {'fields': ('phone_number', 'password')}),
        # AbstractUser includes these by default, so we can safely display them
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Platform Roles', {'fields': ('is_rider', 'is_driver')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

    # 3. The fields shown when CREATING a new user via the admin panel
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone_number', 'password', 'is_rider', 'is_driver'),
        }),
    )

    # 4. Remove 'username' from search and ordering
    search_fields = ('phone_number', 'first_name', 'last_name', 'email')
    ordering = ('phone_number',)


# Register the Account model using your custom AccountAdmin
admin.site.register(Account, AccountAdmin)

# Register the profiles normally
admin.site.register(DriverProfile)
admin.site.register(RiderProfile)