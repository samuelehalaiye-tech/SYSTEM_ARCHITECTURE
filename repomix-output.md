This file is a merged representation of the entire codebase, combined into a single document by Repomix.

# File Summary

## Purpose
This file contains a packed representation of the entire repository's contents.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Files are sorted by Git change count (files with more changes are at the bottom)

# Directory Structure
````
Documents/
  REIKEKE2/
    .continue/
      agents/
        new-config-1.yaml
        new-config-2.yaml
        new-config-3.yaml
        new-config.yaml
    .expo/
      devices.json
      README.md
      settings.json
    backend/
      accounts/
        migrations/
          __init__.py
          0001_initial.py
          0002_remove_driverprofile_is_active_and_more.py
        __init__.py
        admin.py
        apps.py
        models.py
        serializers.py
        signals.py
        tests.py
        urls.py
        views.py
      backend/
        __init__.py
        asgi.py
        settings.py
        urls.py
        wsgi.py
      rides/
        migrations/
          __init__.py
          0001_initial.py
          0002_remove_priceconfig_time_price_trips.py
          0003_trips_rejected_by_alter_trips_status.py
          0004_alter_trips_otp_alter_trips_otp_created_at.py
          0005_safetyalert.py
        __init__.py
        admin.py
        apps.py
        models.py
        serializers.py
        test_search.py
        tests.py
        urls.py
        utils.py
        views.py
      manage.py
      pyproject.toml
    frontend/
      .vscode/
        extensions.json
        settings.json
      app/
        (auth)/
          index.tsx
        (driver)/
          _layout.tsx
          driverHome.tsx
          driverLogin.tsx
          offers.tsx
          otp-verify.tsx
        (rider)/
          _layout.tsx
          riderConfirm.tsx
          riderHome.tsx
          riderLogin.tsx
          riderSignup.tsx
          searching.tsx
        _layout.tsx
      assets/
        images/
          android-icon-background.png
          android-icon-foreground.png
          android-icon-monochrome.png
          favicon.png
          icon.png
          partial-react-logo.png
          react-logo.png
          react-logo@2x.png
          react-logo@3x.png
          splash-icon.png
      components/
        ui/
          collapsible.tsx
          icon-symbol.ios.tsx
          icon-symbol.tsx
        external-link.tsx
        haptic-tab.tsx
        hello-wave.tsx
        LocationSearch.native.tsx
        parallax-scroll-view.tsx
        themed-text.tsx
        themed-view.tsx
      constants/
        theme.ts
      context/
        AuthContext.tsx
      hooks/
        use-color-scheme.ts
        use-color-scheme.web.ts
        use-theme-color.ts
      scripts/
        reset-project.js
      services/
        endpoints/
          auth.ts
          driver.ts
          rider.ts
          trips.ts
        config.ts
      src/
        styles.ts
      .env
      .gitignore
      app.json
      eas.json
      eslint.config.js
      package.json
      README.md
      tsconfig.json
    package.json
package.json
````

# Files

## File: Documents/REIKEKE2/.continue/agents/new-config-1.yaml
````yaml
{
  "models": [
    {
      "title": "Qwen 3B (Coding)",
      "provider": "ollama",
      "model": "qwen2.5-coder:3b"
    },
    {
      "title": "Mistral 7B (Planning)",
      "provider": "ollama",
      "model": "mistral"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Qwen 3B Autocomplete",
    "provider": "ollama",
    "model": "qwen2.5-coder:3b"
  }
}
````

## File: Documents/REIKEKE2/.continue/agents/new-config-2.yaml
````yaml
# This is an example configuration file
# To learn more, see the full config.yaml reference: https://docs.continue.dev/reference

name: Example Config
version: 1.0.0
schema: v1

# Define which models can be used
# https://docs.continue.dev/customization/models
models:
  - name: my gpt-5
    provider: openai
    model: gpt-5
    apiKey: YOUR_OPENAI_API_KEY_HERE
  - uses: ollama/qwen2.5-coder-7b
  - uses: anthropic/claude-4-sonnet
    with:
      ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

# MCP Servers that Continue can access
# https://docs.continue.dev/customization/mcp-tools
mcpServers:
  - uses: anthropic/memory-mcp
````

## File: Documents/REIKEKE2/.continue/agents/new-config-3.yaml
````yaml
name: Reikeke-Dev-Config
version: 1.0.0
schema: v1

models:
  # The "Speedster" for daily coding and UI styling
  - name: Qwen 3B (Coding)
    provider: ollama
    model: qwen2.5-coder:3b

  # The "Architect" for planning the Ride Engine logic
  - name: Mistral 7B (Planning)
    provider: ollama
    model: mistral

# This part makes the AI suggest code while you type
tabAutocompleteModel:
  name: Qwen Autocomplete
  provider: ollama
  model: qwen2.5-coder:3b

# This is important for your startup workflow
contextProviders:
  - name: code
  - name: docs
  - name: terminal
````

## File: Documents/REIKEKE2/.continue/agents/new-config.yaml
````yaml
{
  "models": [
    {
      "title": "Qwen 3B (Coding)",
      "provider": "ollama",
      "model": "qwen2.5-coder:3b"
    },
    {
      "title": "Mistral 7B (Planning)",
      "provider": "ollama",
      "model": "mistral"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Qwen 3B Autocomplete",
    "provider": "ollama",
    "model": "qwen2.5-coder:3b"
  }
}
````

## File: Documents/REIKEKE2/.expo/devices.json
````json
{
  "devices": []
}
````

## File: Documents/REIKEKE2/.expo/README.md
````markdown
> Why do I have a folder named ".expo" in my project?

The ".expo" folder is created when an Expo project is started using "expo start" command.

> What do the files contain?

- "devices.json": contains information about devices that have recently opened this project. This is used to populate the "Development sessions" list in your development builds.
- "settings.json": contains the server configuration that is used to serve the application manifest.

> Should I commit the ".expo" folder?

No, you should not share the ".expo" folder. It does not contain any information that is relevant for other developers working on the project, it is specific to your machine.
Upon project creation, the ".expo" folder is already added to your ".gitignore" file.
````

## File: Documents/REIKEKE2/.expo/settings.json
````json
{
  "hostType": "lan",
  "lanType": "ip",
  "dev": true,
  "minify": false,
  "urlRandomness": null,
  "https": false
}
````

## File: Documents/REIKEKE2/backend/accounts/migrations/__init__.py
````python

````

## File: Documents/REIKEKE2/backend/accounts/migrations/0001_initial.py
````python
# Generated by Django 6.0.2 on 2026-02-13 23:51

import django.db.models.deletion
import django.utils.timezone
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('email', models.EmailField(blank=True, max_length=254, verbose_name='email address')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('phone_number', models.CharField(max_length=20, unique=True)),
                ('is_rider', models.BooleanField(default=True)),
                ('is_driver', models.BooleanField(default=False)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='DriverProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=False)),
                ('plate_number', models.CharField(max_length=20)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='driver_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='RiderProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='rider_profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
````

## File: Documents/REIKEKE2/backend/accounts/migrations/0002_remove_driverprofile_is_active_and_more.py
````python
# Generated by Django 6.0.2 on 2026-02-17 00:00

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='driverprofile',
            name='is_active',
        ),
        migrations.AddField(
            model_name='driverprofile',
            name='is_online',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='driverprofile',
            name='last_active_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='driverprofile',
            name='last_lat',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
        migrations.AddField(
            model_name='driverprofile',
            name='last_lng',
            field=models.DecimalField(blank=True, decimal_places=6, max_digits=9, null=True),
        ),
    ]
````

## File: Documents/REIKEKE2/backend/accounts/__init__.py
````python

````

## File: Documents/REIKEKE2/backend/accounts/admin.py
````python
from django.contrib import admin
from .models import Account,DriverProfile,RiderProfile

admin.site.register(Account)
admin.site.register(DriverProfile)
admin.site.register(RiderProfile)
````

## File: Documents/REIKEKE2/backend/accounts/apps.py
````python
from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'accounts'

    def ready(self):
        import accounts.signals
````

## File: Documents/REIKEKE2/backend/accounts/models.py
````python
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
````

## File: Documents/REIKEKE2/backend/accounts/serializers.py
````python
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
````

## File: Documents/REIKEKE2/backend/accounts/signals.py
````python
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
````

## File: Documents/REIKEKE2/backend/accounts/tests.py
````python
from django.test import TestCase

# Create your tests here.
````

## File: Documents/REIKEKE2/backend/accounts/urls.py
````python
from django.urls import path
from .views import UserProfileView, RegisterView, MyTokenObtainPairView,RiderProfileView,DriverProfileView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/me/', UserProfileView.as_view(), name='user-profile'),
    path('users/me/rider/', RiderProfileView.as_view(), name='rider-profile'),
    path('users/me/driver/', DriverProfileView.as_view(), name='driver-profile'),
]
````

## File: Documents/REIKEKE2/backend/accounts/views.py
````python
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Account, DriverProfile,RiderProfile
from rest_framework import permissions
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer, DriverProfileSerializer, RegisterSerializer, AccountSerializer, RiderProfileSerializer
from rest_framework.authtoken.models import Token




class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        # 1. Validate first. If this fails, it sends 400 automatically.
        serializer.is_valid(raise_exception=True)
        
        # 2. Save the user
        user = serializer.save()
        
        # 3. Create/Get token safely
        token, _ = Token.objects.get_or_create(user=user)
        
        # 4. Return custom response
        return Response({
            "token": token.key,
            "phone_number": user.phone_number,
            "is_rider": user.is_rider,
            "is_driver": user.is_driver
        }, status=status.HTTP_201_CREATED)

    
class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = AccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # This ensures a user can only see THEIR OWN profile
        return self.request.user
    
class RiderProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = RiderProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # This ensures we only get the profile belonging to the logged-in user
        return RiderProfile.objects.get(user=self.request.user)

class DriverProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = DriverProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # This ensures we only get the profile belonging to the logged-in user
        return DriverProfile.objects.get(user=self.request.user)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
````

## File: Documents/REIKEKE2/backend/backend/__init__.py
````python

````

## File: Documents/REIKEKE2/backend/backend/asgi.py
````python
"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_asgi_application()
````

## File: Documents/REIKEKE2/backend/backend/urls.py
````python
"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/auth/', include('accounts.urls')),
    path('api/v1/rides/', include('rides.urls')),
    path('api/v1/', include('rides.urls')),
]
````

## File: Documents/REIKEKE2/backend/backend/wsgi.py
````python
import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

application = get_wsgi_application()

# Vercel serverless functions require this specific variable name
app = application
````

## File: Documents/REIKEKE2/backend/rides/migrations/__init__.py
````python

````

## File: Documents/REIKEKE2/backend/rides/migrations/0001_initial.py
````python
# Generated by Django 6.0.2 on 2026-02-15 00:05

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PriceConfig',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('base_fare', models.DecimalField(decimal_places=2, max_digits=20)),
                ('time_price', models.DecimalField(decimal_places=2, max_digits=20)),
                ('min_fare', models.DecimalField(decimal_places=2, max_digits=20)),
                ('distance_price', models.DecimalField(decimal_places=2, max_digits=20)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
````

## File: Documents/REIKEKE2/backend/rides/migrations/0002_remove_priceconfig_time_price_trips.py
````python
# Generated by Django 6.0.2 on 2026-02-15 20:46

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
        ('rides', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='priceconfig',
            name='time_price',
        ),
        migrations.CreateModel(
            name='Trips',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('pickup_location_name', models.CharField(max_length=225)),
                ('dropoff_location_name', models.CharField(max_length=225)),
                ('pickup_lng', models.DecimalField(decimal_places=6, max_digits=20)),
                ('pickup_lat', models.DecimalField(decimal_places=6, max_digits=20)),
                ('dropoff_lng', models.DecimalField(decimal_places=6, max_digits=20)),
                ('dropoff_lat', models.DecimalField(decimal_places=6, max_digits=20)),
                ('total_distance', models.DecimalField(decimal_places=6, max_digits=20)),
                ('final_fare', models.DecimalField(decimal_places=2, max_digits=20)),
                ('status', models.CharField(choices=[('SEARCHING', 'Looking for a keke'), ('ACCEPTED', 'Driver is on the way'), ('STARTED', 'Passenger is in the keke'), ('COMPLETED', 'Ride finished'), ('CANCELLED', 'Someone gave up')], default='SEARCHING', max_length=225)),
                ('otp', models.CharField(max_length=6, null=True)),
                ('otp_created_at', models.DateTimeField(auto_now=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('started_at', models.DateTimeField(blank=True, null=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('driver', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.driverprofile')),
                ('price_config', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rides.priceconfig')),
                ('rider', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='accounts.riderprofile')),
            ],
        ),
    ]
````

## File: Documents/REIKEKE2/backend/rides/migrations/0003_trips_rejected_by_alter_trips_status.py
````python
# Generated by Django 6.0.2 on 2026-02-17 22:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_remove_driverprofile_is_active_and_more'),
        ('rides', '0002_remove_priceconfig_time_price_trips'),
    ]

    operations = [
        migrations.AddField(
            model_name='trips',
            name='rejected_by',
            field=models.ManyToManyField(blank=True, related_name='rejected_trips', to='accounts.driverprofile'),
        ),
        migrations.AlterField(
            model_name='trips',
            name='status',
            field=models.CharField(choices=[('SEARCHING', 'Looking for a keke'), ('ACCEPTED', 'Driver is on the way'), ('STARTED', 'Passenger is in the keke'), ('COMPLETED', 'Ride finished'), ('CANCELLED', 'Someone gave up'), ('REJECTED', 'The driver rejected the trip')], default='SEARCHING', max_length=225),
        ),
    ]
````

## File: Documents/REIKEKE2/backend/rides/migrations/0004_alter_trips_otp_alter_trips_otp_created_at.py
````python
# Generated by Django 6.0.2 on 2026-03-02 02:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rides', '0003_trips_rejected_by_alter_trips_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='trips',
            name='otp',
            field=models.CharField(blank=True, max_length=6, null=True),
        ),
        migrations.AlterField(
            model_name='trips',
            name='otp_created_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
````

## File: Documents/REIKEKE2/backend/rides/migrations/0005_safetyalert.py
````python
# Generated by Django 6.0.2 on 2026-03-02 12:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rides', '0004_alter_trips_otp_alter_trips_otp_created_at'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='SafetyAlert',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('lat', models.DecimalField(decimal_places=6, max_digits=9)),
                ('lng', models.DecimalField(decimal_places=6, max_digits=9)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('is_resolved', models.BooleanField(default=False)),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='alerts', to='rides.trips')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
````

## File: Documents/REIKEKE2/backend/rides/__init__.py
````python

````

## File: Documents/REIKEKE2/backend/rides/admin.py
````python
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
````

## File: Documents/REIKEKE2/backend/rides/apps.py
````python
from django.apps import AppConfig


class RidesConfig(AppConfig):
    name = 'rides'
````

## File: Documents/REIKEKE2/backend/rides/models.py
````python
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
````

## File: Documents/REIKEKE2/backend/rides/serializers.py
````python
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
    pickup_lat = serializers.FloatField()
    pickup_lng = serializers.FloatField()
    dropoff_lat = serializers.FloatField()
    dropoff_lng = serializers.FloatField()

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
````

## File: Documents/REIKEKE2/backend/rides/test_search.py
````python
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from .models import DriverProfile, RiderProfile, Trips, PriceConfig, Status

User = get_user_model()

class DriverSearchTests(APITestCase):
    def setUp(self):
        # 1. Setup Pricing Logic
        self.config = PriceConfig.objects.create(
            base_fare=500, 
            distance_price=100, 
            min_fare=500
        )
        
        # 2. Setup Rider
        self.rider_user = User.objects.create_user(
            email='rider@test.com', 
            password='pass123', 
            phone_number='08011111111'
        )
        # Handle potential auto-creation from signals
        self.rider_profile, _ = RiderProfile.objects.get_or_create(user=self.rider_user)
        
        # 3. Setup Drivers
        # Driver 1: Online (Should be found)
        self.d1_user = User.objects.create_user(
            email='d1@test.com', password='pass123', phone_number='08022222222'
        )
        self.driver_ready, _ = DriverProfile.objects.get_or_create(user=self.d1_user)
        self.driver_ready.is_online = True
        self.driver_ready.save()
        
        # Driver 2: Offline (Should be ignored)
        self.d2_user = User.objects.create_user(
            email='d2@test.com', password='pass123', phone_number='08033333333'
        )
        self.driver_offline, _ = DriverProfile.objects.get_or_create(user=self.d2_user)
        self.driver_offline.is_online = False
        self.driver_offline.save()
        
        # Driver 3: Online but will reject (Should be ignored)
        self.d3_user = User.objects.create_user(
            email='d3@test.com', password='pass123', phone_number='08044444444'
        )
        self.driver_rejector, _ = DriverProfile.objects.get_or_create(user=self.d3_user)
        self.driver_rejector.is_online = True
        self.driver_rejector.save()

        # 4. Setup the Trip
        self.trip = Trips.objects.create(
            rider=self.rider_profile,
            pickup_location_name="Yola Market",
            dropoff_location_name="Jimeta",
            pickup_lat=9.2035, pickup_lng=12.4850,
            dropoff_lat=9.2350, dropoff_lng=12.4950,
            price_config=self.config,
            total_distance=5.0,
            final_fare=1000
        )

    def test_blast_search_finds_correct_drivers(self):
        """
        Verify that BlastSearch finds exactly one driver:
        - Excludes offline drivers
        - Excludes drivers who rejected the trip
        """
        # Simulate Driver 3 rejecting the trip
        self.trip.rejected_by.add(self.driver_rejector)
        
        url = reverse('search-drivers')
        data = {
            'trip_id': str(self.trip.id), 
            'lat': 9.2035, 
            'lng': 12.4850
        }
        
        self.client.force_authenticate(user=self.rider_user)
        response = self.client.post(url, data, format='json')

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Only self.driver_ready should be in the result
        self.assertEqual(response.data['drivers_notified'], 1)
````

## File: Documents/REIKEKE2/backend/rides/tests.py
````python

````

## File: Documents/REIKEKE2/backend/rides/urls.py
````python
from django.urls import path
from .views import (
    DriverHeartbeatView,
    SearchDriverView,
    RejectRiderView,
    AcceptRiderView,
    StartTripView,
    TrackingView,
    TripCancelView,
    EndTripView,
    DriverStatusView,
    DriverLocationView,
    TripEstimateView,
    TripRequestView,
    TripStatusView,
    AvailableOffersView,
    CurrentActiveTripView,
    VerifyTripOTPView,
    TriggerSOSView,
)

urlpatterns = [
    # 1. Static/Global Trip Operations (MOVE THIS TOP TO AVOID UUID COLLISION)
    path('trips/current/', CurrentActiveTripView.as_view(), name='current-active-trip'),
    path('offers/', AvailableOffersView.as_view(), name='available-offers'), 
    path('estimate/', TripEstimateView.as_view(), name='trip-estimate'),
    
    # 2. Driver Operations
    path('driver/heartbeat/', DriverHeartbeatView.as_view(), name='driver-heartbeat'),
    path('driver/status/', DriverStatusView.as_view(), name='driver-status'),
    # rides/urls.py
    path('<uuid:trip_id>/verify/', VerifyTripOTPView.as_view(), name='verify-otp'),
    path('driver/location/', DriverLocationView.as_view(), name='driver-location'),
    
    # 3. Ride Engine - Discovery Phase
    path('request/', SearchDriverView.as_view(), name='request-ride'),
    path('request-trip/', TripRequestView.as_view(), name='trip-request'), # Renamed slightly to avoid 'request/' duplicate
    
    # 4. Dynamic Trip Operations (UUID based)
    path('trips/<uuid:trip_id>/accept/', AcceptRiderView.as_view(), name='accept-trip'),
    path('trips/<uuid:trip_id>/reject/', RejectRiderView.as_view(), name='reject-trip'),
    path('trips/<uuid:trip_id>/status/', TripStatusView.as_view(), name='trip-status'),
    path('trips/<uuid:trip_id>/start/', StartTripView.as_view(), name='start-trip'),
    path('trips/<uuid:trip_id>/track/', TrackingView.as_view(), name='track-trip'),
    path('trips/<uuid:trip_id>/cancel/', TripCancelView.as_view(), name='cancel-trip'),
    path('trips/<uuid:trip_id>/end/', EndTripView.as_view(), name='end-trip'),
    path('trips/<int:trip_id>/sos/', TriggerSOSView.as_view(), name='trigger-sos'),
]
````

## File: Documents/REIKEKE2/backend/rides/utils.py
````python
import math
from decimal import Decimal
from accounts.models import DriverProfile


def calculate_haversine_distance(lat1, lon1, lat2, lon2):
  
    lat1, lon1, lat2, lon2 = map(float, [lat1, lon1, lat2, lon2])

    R = 6371.0 

    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = math.sin(dphi / 2)**2 + \
        math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2)**2
    

    a = min(1.0, max(0.0, a))
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    
    return Decimal(str(distance)).quantize(Decimal('0.01'))

def fare_estimator(config,distance_km):
    raw_fare=config.base_fare +(Decimal(distance_km)*config.distance_price)


    final_fare=max(raw_fare,config.min_fare)

    return final_fare.quantize(Decimal('0.01'))

def BlastSearch(trip_id):
    # Get all online drivers, minus those who already rejected this specific trip
    # We ignore location proximity for now since the pool is small in Yola
    drivers = DriverProfile.objects.filter(
        is_online=True
        # Optional: Add .filter(is_busy=False) if you have that field
    )

    if trip_id:
        drivers = drivers.exclude(rejected_trips__id=trip_id)

    # Return the QuerySet directly (or .all() if you need to force evaluation)
    return drivers
````

## File: Documents/REIKEKE2/backend/rides/views.py
````python
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .utils import BlastSearch, calculate_haversine_distance, fare_estimator
from decimal import Decimal
from . models import Trips, Status,  PriceConfig,SafetyAlert
from .serializers import DriverStatusSerializer, DriverLocationSerializer, TripEstimateSerializer, TripRequestSerializer
from django.db import transaction
from datetime import timedelta
from django.utils import timezone
from rest_framework import status

import random
# Create your views here.


class DriverHeartbeatView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        lat= request.data.get('lat')
        lng=request.data.get('lng')


        if not lat or not lng:
            return Response ({"error": "Coordinates Required"}, status=400)
        profile= request.user.driver_profile
        profile.update_presence(lat,lng)
        return Response({"status": "updated", "is_online": profile.is_online})



class SearchDriverView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        rider_profile = request.user.rider_profile

        # 1. Create the Trip Record first
        # We need this so the 'blast' has a real database ID to send to drivers
        try:
            # Grab the latest pricing config (Phase 1 logic)
            config = PriceConfig.objects.filter(is_active=True).last()
            dist_km = calculate_haversine_distance(
                float(data.get('pickup_lat')), float(data.get('pickup_lng')),
                float(data.get('dropoff_lat')), float(data.get('dropoff_lng'))
            )
            
            trip = Trips.objects.create(
                rider=rider_profile,
                pickup_location_name=data.get('pickup_location_name'),
                dropoff_location_name=data.get('dropoff_location_name'),
                pickup_lat=data.get('pickup_lat'),
                pickup_lng=data.get('pickup_lng'),
                dropoff_lat=data.get('dropoff_lat'),
                dropoff_lng=data.get('dropoff_lng'),
                final_fare=data.get('final_fare'),
                total_distance=Decimal(str(dist_km)),
                price_config=config,
                status=Status.SEARCHING
            )

            # 2. Now perform the "Blast" using the newly created trip
            drivers = BlastSearch(trip.id)

            if drivers.exists():
                # In a real startup, you'd trigger FCM here
                return Response({
                    'status': 'success',
                    'trip_id': str(trip.id),
                    'drivers_notified': drivers.count()
                })
            
            # If no drivers found, we still created the trip, 
            # but we tell the rider we're struggling
            return Response({
                'status': 'no_drivers_found',
                'trip_id': str(trip.id),
                'message': 'Keep searching? No drivers active in Jimeta right now.'
            }, status=200) # 200 because the trip was still created

        except Exception as e:
            print(f"Error creating trip: {e}")
            return Response({'status': 'error', 'message': str(e)}, status=400)

class RejectRiderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        driver_profile = request.user.driver_profile
        
        try:
            with transaction.atomic():
                # select_for_update() is still good practice here
                trip = Trips.objects.select_for_update().get(id=trip_id)

                # If it's already accepted, the reject button should just disappear
                if trip.status != Status.SEARCHING:
                    return Response({"status": "ignored", "message": "Trip no longer available"})

                # ADD DRIVER TO BLACKLIST
                trip.rejected_by.add(driver_profile)
                
                
                driver_profile.is_online = True
                driver_profile.save()

            return Response({"status": "success", "message": "Ride skipped."})

        except Trips.DoesNotExist:
            return Response({'error': 'Trip not found'}, status=404)

class AcceptRiderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        # 1. Get the driver profile safely
        try:
            driver_profile = request.user.driver_profile
        except AttributeError:
            return Response({'error': 'User is not a driver'}, status=403)

        try:
            with transaction.atomic():
                # 2. Lock the specific trip row immediately. 
                # select_for_update(nowait=False) makes others wait in line.
                trip = Trips.objects.select_for_update().get(id=trip_id)

                # 3. Double-check: Is the trip still available?
                if trip.status != Status.SEARCHING or trip.driver is not None:
                    return Response({
                        'error': "Too late! This ride was just snatched by another Keke."
                    }, status=400)

                # 4. Optional but Recommended: Is the driver already on a trip?
                # This prevents one driver from 'hoarding' multiple blast requests.
                if Trips.objects.filter(driver=driver_profile, status=Status.ACCEPTED).exists():
                    return Response({'error': "You already have an active trip!"}, status=400)

                # 5. Atomic Update
                trip.driver = driver_profile
                trip.status = Status.ACCEPTED
                trip.save()

                # 6. Update Driver State
                # Instead of going 'offline', we mark them as busy.
                # If you use 'is_online=False', remember to flip it back on 'End Trip'.
                driver_profile.is_online = False 
                driver_profile.save()

                # 7. TODO: Trigger a Push Notification to the Rider here!
                # "Your Keke is on the way!"

            return Response({
                "status": 'success',
                'message': 'Ride secured! Drive safely.',
                'trip_details': {
                    'rider_name': trip.rider.user.get_full_name(),
                    'pickup': trip.pickup_location_name,
                    'otp': trip.otp # They'll need this for Step 8
                }
            })

        except Trips.DoesNotExist:
            return Response({'error': 'Trip no longer exists'}, status=404)
        except Exception as e:
            # Log this for your internal Sentry/Logs
            return Response({'error': 'A server error occurred'}, status=500)


class StartTripView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request,trip_id):
        input_pin=request.data.get('otp')
        driver=request.user.driver_profile

        try:
            with transaction.atomic():
                trip = Trips.objects.select_for_update().get(id=trip_id, driver=driver)

                if trip.status != Status.ACCEPTED:
                    return Response({'error': ' Trip cannot be started from thsi state '}, status=400)
                
                if input_pin !=trip.otp:
                    return Response({'error':'Invalid PIN. Ask the rider for the PIN on thier screen '},status=403)
                
                trip.status=Status.STARTED
                trip.started_at=timezone.now()
                trip.save()
            return Response({"status": "success", "message": "Trip started. Drive safely!"})
        except:
            return Response({'error':" The trip is not found or you are not assigned to the right driver"})



class TrackingView(APIView):

    permission_classes=[IsAuthenticated]

    def post(self,request,trip_id):
        lat=request.data.get('lat')
        lng=request.data.get('lng')

        try:
            trip=Trips.objects.get(id=trip_id, driver__user=request.user,status=Status.STARTED)
            trip.current_lat=lat
            trip.current_lng=lng
            trip.save(update_fields=['current_lat', 'current_lng'])
            return Response({"status": "tracked"})
        except Trips.DoesNotExist:
            return Response({"error": "No active trip found."}, status=404)
        

from django.utils import timezone
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Trips, Status

class TripCancelView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        user = request.user
        
        try:
            with transaction.atomic():
                # Lock the trip
                trip = Trips.objects.select_for_update().get(id=trip_id)

                # 1. Check if the Rider is cancelling (Allowed during SEARCHING or ACCEPTED)
                if hasattr(user, 'rider_profile') and trip.rider == user.rider_profile:
                    if trip.status in [Status.SEARCHING, Status.ACCEPTED]:
                        trip.status = Status.CANCELLED
                        trip.save()
                        
                        # If a driver was already assigned, put them back online
                        if trip.driver:
                            trip.driver.is_online = True
                            trip.driver.save()
                            
                        return Response({"status": "success", "message": "Trip cancelled by rider."})
                    else:
                        return Response({"error": "You cannot cancel a trip that has already started."}, status=400)

                # 2. Check if the Driver is cancelling (Your original logic)
                elif hasattr(user, 'driver_profile') and trip.driver == user.driver_profile:
                    if trip.status in [Status.ACCEPTED, Status.STARTED]: # Use STARTED to match your status model
                        trip.status = Status.CANCELLED
                        trip.save()
                        
                        # Define the profile here so it doesn't crash
                        driver_prof = user.driver_profile 
                        driver_prof.is_online = True
                        driver_prof.save()
                        
                        return Response({"status": "success", "message": "Trip cancelled."})
                
                return Response({"error": "Unauthorized to cancel this trip."}, status=403)

        except Trips.DoesNotExist:
            return Response({"error": "Trip not found."}, status=404)
        


class EndTripView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        
        input_pin = request.data.get('otp')
        driver = request.user.driver_profile

        if not input_pin:
            return Response({"error": "Completion PIN is required to end the trip."}, status=400)

        try:
            with transaction.atomic():
        
                trip = Trips.objects.select_for_update().get(
                    id=trip_id, 
                    driver=driver, 
                    status=Status.STARTED
                )

            
                if input_pin != trip.otp:
                    return Response({
                        "error": "Invalid PIN. Please ask the rider for the code to confirm arrival."
                    }, status=403)

                trip.status = Status.COMPLETED
                trip.completed_at = timezone.now()
                trip.save()

                driver.is_online = True
                driver.save()

            return Response({
                "status": "success",
                "message": "Trip completed and verified. You are now back online!"
            })

        except Trips.DoesNotExist:
            return Response({"error": "Active trip not found or already completed."}, status=404)


# ============================================================================
# PHASE 1 & 2: RIDE ENGINE ENDPOINTS
# ============================================================================


class DriverStatusView(APIView):
    """Toggle driver online/offline status"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """POST /api/v1/driver/status - Toggle driver online/offline"""
        try:
            driver_profile = request.user.driver_profile
        except:
            return Response(
                {"error": "User does not have a driver profile"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = DriverStatusSerializer(data=request.data)
        if serializer.is_valid():
            driver_profile.is_online = serializer.validated_data['is_online']
            driver_profile.save(update_fields=['is_online'])
            
            return Response({
                "status": "success",
                "message": f"Driver is now {'online' if driver_profile.is_online else 'offline'}",
                "is_online": driver_profile.is_online
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DriverLocationView(APIView):
    """Update driver's GPS location"""
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        """PATCH /api/v1/driver/location - Update GPS coordinates"""
        try:
            driver_profile = request.user.driver_profile
        except:
            return Response(
                {"error": "User does not have a driver profile"},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = DriverLocationSerializer(data=request.data)
        if serializer.is_valid():
            driver_profile.last_lat = serializer.validated_data.get('last_lat')
            driver_profile.last_lng = serializer.validated_data.get('last_lng')
            driver_profile.last_active_at = timezone.now()
            driver_profile.save(update_fields=['last_lat', 'last_lng', 'last_active_at'])
            
            return Response({
                "status": "success",
                "message": "Location updated",
                "location": {
                    "lat": float(driver_profile.last_lat),
                    "lng": float(driver_profile.last_lng),
                    "last_active_at": driver_profile.last_active_at.isoformat()
                }
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TripEstimateView(APIView):
    """Calculate fare estimate based on pickup and dropoff coordinates"""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        """POST /api/v1/trips/estimate - Get fare estimate"""
        serializer = TripEstimateSerializer(data=request.data)
        
        if serializer.is_valid():
            pickup_lat = serializer.validated_data['pickup_lat']
            pickup_lng = serializer.validated_data['pickup_lng']
            dropoff_lat = serializer.validated_data['dropoff_lat']
            dropoff_lng = serializer.validated_data['dropoff_lng']

            # Calculate distance
            distance = calculate_haversine_distance(
                pickup_lat, pickup_lng, 
                dropoff_lat, dropoff_lng
            )

            # Get active pricing config
            try:
                price_config = PriceConfig.objects.get(is_active=True)
            except PriceConfig.DoesNotExist:
                return Response(
                    {"error": "No active pricing configuration found"},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )

            # Calculate fare
            estimated_fare = fare_estimator(price_config, distance)

            return Response({
                "status": "success",
                "estimate": {
                    "distance_km": float(distance),
                    "estimated_fare": float(estimated_fare),
                    "base_fare": float(price_config.base_fare),
                    "currency": "NGN"
                }
            }, status=status.HTTP_200_OK)
        print("DEBUG SERIALIZER ERRORS:", serializer.errors)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TripRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        
        try:
            # 1. Get the Gatekeeper (PriceConfig)
            config = PriceConfig.objects.filter(is_active=True).first()
            if not config:
                return Response({"error": "Pricing not configured"}, status=400)

            # 2. Calculate Distance (KM)
            dist_km = calculate_haversine_distance(
                data['pickup_lat'], data['pickup_lng'],
                data['dropoff_lat'], data['dropoff_lng']
            )
            
            # 3. Calculate Fare using your model's logic
            # Price = Base + (KM * Distance Price)
            raw_fare = Decimal(config.base_fare) + (Decimal(dist_km) * Decimal(config.distance_price))
            
            # Ensure it doesn't fall below min_fare
            final_fare = max(raw_fare, Decimal(config.min_fare))

            # 4. Create the Trip with ALL required fields
            # Note: The 'otp' is generated automatically in your model's save()
            trip = Trips.objects.create(
                rider=request.user.rider_profile, # Assumes 1-to-1 link on User
                pickup_location_name=data['pickup_location_name'],
                dropoff_location_name=data['dropoff_location_name'],
                pickup_lat=data['pickup_lat'],
                pickup_lng=data['pickup_lng'],
                dropoff_lat=data['dropoff_lat'],
                dropoff_lng=data['dropoff_lng'],
                price_config=config,
                total_distance=Decimal(dist_km),
                final_fare=final_fare,
                status=Status.SEARCHING
            )

            return Response({
                "trip_id": str(trip.id),
                "fare": float(final_fare),
                "otp": trip.otp, # Usually you don't send this to rider yet, but good for debug
                "status": trip.status
            }, status=201)

        except Exception as e:
            print(f"TRIP CREATION FAILED: {str(e)}")
            return Response({"error": "Failed to initiate trip"}, status=500)
           
        
class TripStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, trip_id):
        try:
            # We fetch the trip and ensure it belongs to the requesting rider
            trip = Trips.objects.select_related('driver__user').get(id=trip_id, rider__user=request.user)
            
            response_data = {
                'trip_id': str(trip.id),
                'status': trip.status,
                'final_fare': trip.final_fare, # Good to show the rider what they will pay
            }

            # If the driver has accepted OR the trip has started, send driver info & the current OTP
            if trip.status in [Status.ACCEPTED, Status.STARTED] and trip.driver:
                response_data['driver'] = {
                    'name': trip.driver.user.get_full_name() or trip.driver.user.username,
                    'phone': getattr(trip.driver.user, 'phone_number', 'N/A'),
                    'keke_plate': getattr(trip.driver, 'plate_number', 'N/A'),
                }
                
                # THE MAGIC: 
                # If status is ACCEPTED, this is the Start PIN.
                # If status is STARTED, this is the newly generated End PIN.
                response_data['otp'] = trip.otp

            return Response(response_data, status=200)

        except Trips.DoesNotExist:
            return Response({'error': 'Trip not found'}, status=404)
        
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
# (Assuming Trips and Status are imported here)

class AvailableOffersView(APIView):
    """
    Returns a list of trips that are currently SEARCHING, 
    have NOT been rejected by this driver, 
    and were created within the last 30 minutes.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            driver_profile = request.user.driver_profile
        except AttributeError:
            return Response({'error': 'Only drivers can view offers'}, status=403)

        # Calculate the cutoff time (30 minutes ago)
        thirty_minutes_ago = timezone.now() - timedelta(minutes=30)

        # 1. Filter trips: 
        # - Status is SEARCHING
        # - Not already assigned to a driver
        # - Created within the last 30 minutes (<-- NEW)
        # - NOT in the rejected_by list for this specific driver
        offers = Trips.objects.filter(
            status=Status.SEARCHING,
            driver__isnull=True,
            created_at__gte=thirty_minutes_ago  # 'gte' means Greater Than or Equal to
        ).exclude(rejected_by=driver_profile).order_by('-created_at')

        # 2. Map the data to the format your React Native Frontend expects
        data = []
        for trip in offers:
            data.append({
                "id": trip.id,
                "rider_phone": trip.rider.user.phone_number,
                "pickup_location_name": trip.pickup_location_name,
                "dropoff_location_name": trip.dropoff_location_name,
                "final_fare": float(trip.final_fare),
                "pickup_lat": trip.pickup_lat,
                "pickup_lng": trip.pickup_lng,
                "created_at": trip.created_at
            })

        return Response(data)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Trips, Status

class CurrentActiveTripView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            # Look for an active trip assigned to this driver
            # We specifically check for ACCEPTED or STARTED states based on your audit
            active_trip = Trips.objects.filter(
                driver__user=request.user, 
                status__in=[Status.ACCEPTED, Status.STARTED]
            ).first()

            if not active_trip:
                return Response({"active": False}, status=200)

            return Response({
                "active": True,
                "trip_id": str(active_trip.id),
                "status": active_trip.status,
                "rider_name": active_trip.rider.user.get_full_name() or active_trip.rider.user.username,
                # We pull the 6-digit OTP that was generated by your Trips.save() override
                "otp": active_trip.otp, 
            }, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)




from django.db import transaction # <--- MANDATORY IMPORT
from rest_framework.permissions import IsAuthenticated

class VerifyTripOTPView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        action = request.data.get('action') 
        input_otp = request.data.get('otp')

        try:
            # 1. Start the transaction block here
            with transaction.atomic():
                # 2. This line WILL NOT CRASH anymore once inside atomic()
                trip = Trips.objects.select_for_update().get(
                    id=trip_id, 
                    driver__user=request.user
                )

                # 3. VERIFY PIN
                if str(trip.otp) != str(input_otp):
                    return Response({"error": "Invalid PIN."}, status=400)

                # 4. HANDLE ACTIONS
                if action == 'start':
                    if trip.status != Status.ACCEPTED:
                        return Response({"error": "Trip not in 'Accepted' state."}, status=400)
                    
                    trip.status = Status.STARTED
                    trip.rotate_otp() # Generate the completion PIN
                    trip.save() 
                    
                    return Response({
                        "message": "Ride Started! New PIN generated.",
                        "next_otp_for_testing": trip.otp 
                    })

                elif action == 'end':
                    if trip.status != Status.STARTED:
                        return Response({"error": "Ride must be started first."}, status=400)

                    trip.status = Status.COMPLETED
                    trip.save() 

                    return Response({"message": "Ride Completed Successfully."})

        except Trips.DoesNotExist:
            return Response({"error": "Trip not found or not assigned to you."}, status=404)
        except Exception as e:
            # This logs the real error to your VS Code / CMD terminal
            print(f"CRITICAL ERROR IN VERIFY: {str(e)}")
            return Response({"error": "Server error during verification."}, status=500)

class TriggerSOSView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, trip_id):
        try:
            trip = Trips.objects.get(id=trip_id)
            # Log the SOS in the database
            alert = SafetyAlert.objects.create(
                trip=trip,
                user=request.user,
                lat=request.data.get('lat'),
                lng=request.data.get('lng')
            )
            # FUTURE: Trigger SMS/Email to your Yola security partner here
            print(f"!!! SOS TRIGGERED !!! Trip: {trip_id} by {request.user.username}")
            
            return Response({"status": "success", "message": "Emergency alert logged."})
        except Trips.DoesNotExist:
            return Response({"error": "Trip not found"}, status=404)
````

## File: Documents/REIKEKE2/backend/manage.py
````python
#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys


def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == '__main__':
    main()
````

## File: Documents/REIKEKE2/backend/pyproject.toml
````toml
[project]
name = "reikeke-backend"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "Django==6.0.1",
    "psycopg2-binary",
    "dj-database-url",
    "djangorestframework",
    "djangorestframework-simplejwt",
    "django-cors-headers",
    "python-dotenv",
    "whitenoise",
]

[tool.vercel.scripts]
# uv run ensures the commands are executed inside the environment where Django is installed
build = "uv run python manage.py migrate --noinput && uv run python manage.py collectstatic --noinput --clear"

[tool.vercel]
entrypoint = "backend.wsgi:application"
````

## File: Documents/REIKEKE2/frontend/.vscode/extensions.json
````json
{ "recommendations": ["expo.vscode-expo-tools"] }
````

## File: Documents/REIKEKE2/frontend/.vscode/settings.json
````json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "explicit",
    "source.sortMembers": "explicit"
  }
}
````

## File: Documents/REIKEKE2/frontend/app/(auth)/index.tsx
````typescript
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Car, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
// 1. Import the Root View
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface RoleSelectionProps {
  onSelectRole: (role: 'driver' | 'passenger') => void;
}

export default function RoleSelection({ onSelectRole }: RoleSelectionProps) {
  const router = useRouter();

  return (
    // 2. Wrap the entire UI. flex: 1 is mandatory here.
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.title}>REIKEKE</Text>
            <Text style={styles.subtitle}>Select your role</Text>
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonContainer}>
            {/* Driver Button */}
            <Pressable 
              onPress={() => {
                console.log("Driver Pressed");
                router.push('/(driver)/driverLogin');;
              }}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed
              ]}
            >
              <Car size={32} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>I'm a Driver</Text>
            </Pressable>

            {/* Passenger Button */}
            <Pressable 
              onPress={() => {
                console.log("Passenger Pressed");
                router.replace('/riderLogin');
              }}
              style={({ pressed }) => [
                styles.outlineButton,
                pressed && styles.outlineButtonPressed
              ]}
            >
              <User size={32} color="#FF8C00" />
              <Text style={styles.outlineButtonText}>I'm a Passenger</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400, 
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  subtitle: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 8,
  },
  buttonContainer: {
    gap: 16, 
  },
  primaryButton: {
    backgroundColor: '#FF8C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF8C00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 12,
    gap: 16,
  },
  outlineButtonText: {
    color: '#FF8C00',
    fontSize: 20,
    fontWeight: '600',
  },
  buttonPressed: {
    backgroundColor: '#FF7700',
    opacity: 0.9,
  },
  outlineButtonPressed: {
    backgroundColor: '#FFF5E6',
  },
});
````

## File: Documents/REIKEKE2/frontend/app/(driver)/_layout.tsx
````typescript
import { Stack } from 'expo-router';

export default function DriverLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="driverLogin" />
      <Stack.Screen name="driverSignup" />
      <Stack.Screen name="driverHome" />
      <Stack.Screen name="offers" />
    </Stack>
  );
}
````

## File: Documents/REIKEKE2/frontend/app/(driver)/driverHome.tsx
````typescript
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  StyleSheet, 
  Switch, 
  SafeAreaView, 
  StatusBar,
  Alert ,
  ActivityIndicator
} from 'react-native';
import { Phone, List, Play, CheckCircle, XCircle } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { useRouter } from 'expo-router'; 

// Make sure you import the new getCurrentTrip function!
import { updateDriverStatus, getCurrentTrip  } from '../../services/endpoints/driver'; 
import { cancelTrip } from '@/services/endpoints/rider';

interface DriverHomeProps {
  phone: string;
}

export default function DriverHome({ phone }: DriverHomeProps) {
  const [isOnline, setIsOnline] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [activeTrip, setActiveTrip] = useState<any>(null); // The new state for our trip
  const router = useRouter(); 
  
  // Polling Logic: Check for active trip when component mounts, and every 10 seconds
  useEffect(() => {
    checkActiveTrip();
    const interval = setInterval(checkActiveTrip, 10000);
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const checkActiveTrip = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await getCurrentTrip(token);
      if (response && response.active) {
        setActiveTrip(response);
        // Force driver online if they have an active trip
        if (!isOnline) setIsOnline(true);
      } else {
        setActiveTrip(null);
      }
    } catch (error) {
      console.error("Failed to sync trip state", error);
    }
  };

  const handleLogout = async () => {
    setLoadingStatus(true);
    try {
      await AsyncStorage.removeItem('userToken'); 
      console.log("User logged out, token cleared.");
      router.replace('/(auth)'); 
    } catch (e) {
      Alert.alert("Error", "Failed to logout. Try again.");
    }
  };

  const [cancelling, setCancelling] = useState(false);

  const handleCancelTrip = async () => {
  if (!activeTrip) return;

  Alert.alert(
    "Cancel Trip",
    "Are you sure you want to cancel this trip?",
    [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            setCancelling(true);
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
              Alert.alert("Error", "Please login again");
              return;
            }

            const result = await cancelTrip(activeTrip.trip_id, token);

            if (result.status === "success") {
              setActiveTrip(null);
              Alert.alert("Success", "Trip cancelled successfully");
              // Optionally refresh online status
              await checkActiveTrip();
            } else {
              Alert.alert("Error", result.error || "Failed to cancel trip");
            }
          } catch (error) {
            Alert.alert("Error", "Network error. Please try again.");
          } finally {
            setCancelling(false);
          }
        }
      }
    ]
  );
};


  const toggleStatus = async (value: boolean) => {
    // Prevent going offline if there is an active ride
    if (activeTrip && !value) {
      Alert.alert("Action Denied", "You cannot go offline while on an active trip.");
      return;
    }

    const previousState = isOnline;
    setIsOnline(value);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Session expired. Please login again.');
        setIsOnline(previousState);
        return;
      }

      const result = await updateDriverStatus(value, token);
      if (result && !result.id && result.detail) {
        throw new Error(result.detail);
      }
    } catch (error) {
      setIsOnline(previousState);
      Alert.alert('Connection Error', 'Failed to update status. Check your internet.');
    }
    setLoadingStatus(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Keke Napep Driver</Text>
        <View style={styles.phoneContainer}>
          <Phone size={16} color="#FFFFFF" />
          {/* Use short-circuiting to ensure string is never null */}
          <Text style={styles.phoneText}>{phone || '---'}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.statusCard}>
          <View>
            <Text style={styles.statusLabel}>Current Status</Text>
            <Text style={[styles.statusValue, { color: isOnline ? '#22C55E' : '#EF4444' }]}>
              {isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
          <Switch
            trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
            thumbColor={isOnline ? '#22C55E' : '#9CA3AF'}
            onValueChange={toggleStatus}
            value={isOnline}
            style={styles.switchScale}
          />
        </View>

        {/* REFINED TERNARY: No comments inside the render branches */}
        {!activeTrip ? (
          <View>
            <Pressable 
              onPress={() => router.push('/offers')} 
              style={({ pressed }) => [
                styles.offersButton,
                pressed && styles.buttonPressed,
                !isOnline && styles.disabledButton 
              ]}
              disabled={!isOnline}
            >
              <List size={24} color="#FFFFFF" />
              <Text style={styles.offersButtonText}>View Ride Offers</Text>
            </Pressable>

            {!isOnline && (
              <Text style={styles.hintText}>
                Go online to start receiving ride requests in Yola.
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.activeTripCard}>
            <Text style={styles.activeTripTitle}>
              Current Trip: {activeTrip.rider_name || 'Rider'}
            </Text>
            
            <View style={styles.actionRow}>
              {activeTrip.status === 'ACCEPTED' ? (
                <Pressable 
                  style={[styles.actionButton, {backgroundColor: '#22C55E'}]} 
                  onPress={() => router.push({ pathname: '/otp-verify', params: { tripId: activeTrip.trip_id, action: 'start' }})}
                >
                  <Play size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>Start Ride</Text>
                </Pressable>
              ) : (
                <Pressable 
                  style={[styles.actionButton, {backgroundColor: '#3B82F6'}]} 
                  onPress={() => router.push({ pathname: '/otp-verify', params: { tripId: activeTrip.trip_id, action: 'end' }})}
                >
                  <CheckCircle size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>End Ride</Text>
                </Pressable>
              )}

              <Pressable
  style={[styles.actionButton, { backgroundColor: '#EF4444', opacity: cancelling ? 0.7 : 1 }]}
  onPress={handleCancelTrip}
  disabled={cancelling}
>
  {cancelling ? (
    <ActivityIndicator size="small" color="#FFF" />
  ) : (
    <>
      <XCircle size={20} color="#FFF" />
      <Text style={styles.actionButtonText}>Cancel</Text>
    </>
  )}
</Pressable>
            </View>
          </View>
        )}
        
        <View style={{ flex: 1 }} />

        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <Text style={{color: '#FFFFFF', fontWeight: 'bold'}}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#FF8C00', padding: 24, paddingTop: 40, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  phoneContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  phoneText: { color: '#FFFFFF', fontSize: 16, opacity: 0.9 },
  container: { flex: 1, padding: 24, gap: 20 },
  statusCard: { backgroundColor: '#F9FAFB', padding: 24, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: '#F3F4F6' },
  statusLabel: { fontSize: 14, color: '#6B7280', textTransform: 'uppercase', letterSpacing: 1 },
  statusValue: { fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  switchScale: { transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }] },
  offersButton: { backgroundColor: '#FF8C00', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 12, gap: 12, elevation: 3 },
  disabledButton: { opacity: 0.7 },
  offersButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  buttonPressed: { backgroundColor: '#FF7700' },
  hintText: { textAlign: 'center', color: '#9CA3AF', fontSize: 14, marginTop: 10 },
  logoutButton: { backgroundColor: '#FF8C00', paddingVertical: 15, paddingHorizontal: 25, borderRadius: 12, borderWidth: 2, borderColor: '#E57C00', alignItems: 'center', justifyContent: 'center', elevation: 3 },
  
  // NEW STYLES FOR THE TRIP CARD
  activeTripCard: { backgroundColor: '#FFFBEB', padding: 20, borderRadius: 16, borderWidth: 2, borderColor: '#FEF3C7', gap: 15 },
  activeTripTitle: { fontSize: 18, fontWeight: 'bold', color: '#92400E' },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 10, gap: 8 },
  actionButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 },
});
````

## File: Documents/REIKEKE2/frontend/app/(driver)/driverLogin.tsx
````typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { authStyles as styles } from '../../src/styles';
import { useRouter } from 'expo-router'; 
import { loginUser } from '@/services/endpoints/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DriverLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await loginUser({ 
        phone_number: phone, 
        password: password 
      });

      if (result.access) {
        // 1. SAVE THE TOKEN FIRST
        await AsyncStorage.setItem('userToken', result.access);
        await AsyncStorage.setItem('userRole', result.is_driver ? 'driver' : 'rider');
        
        // 2. LOG FOR DEBUGGING
        console.log("Login Success. Token persisted.");

        // 3. NAVIGATE BASED ON ROLE
        // Since this is the DriverLoginPage, we should prioritize result.is_driver
        if (result.is_driver) {
          router.replace('/driverHome');
        } else {
          // If a rider tries to log in through the driver portal
          Alert.alert("Access Denied", "This account is not registered as a Driver.");
          await AsyncStorage.removeItem('userToken'); // Clean up
        }
      } else {
        setError(result.detail || "Invalid phone or password");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Network Error", "Check your connection to the Yola server.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/(auth)')} style={styles.backButton}>
            <ArrowLeft size={24} color="#FF8C00" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formWrapper}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Driver Login</Text>
              <Text style={{ color: '#6B7280', marginTop: 8 }}>Welcome back to your Keke app</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad" 
                maxLength={11} 
                placeholder="080..." 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                />
                <Pressable onPress={() => setShowPassword(v => !v)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: '#FF8C00' }}>{showPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable 
              style={({ pressed }) => [
                styles.submitButton, 
                (pressed || loading) && styles.buttonPressed
              ]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Login</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
````

## File: Documents/REIKEKE2/frontend/app/(driver)/offers.tsx
````typescript
import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Pressable, StyleSheet, 
  SafeAreaView, StatusBar, Alert, ActivityIndicator 
} from 'react-native';
import { ArrowLeft, MapPin, Navigation, Phone, Banknote } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRideOffers, acceptRide, rejectRide } from '@/services/endpoints/driver';

export default function DriverOffers({ onBack }: { onBack: () => void }) {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch live offers from Yola Keke Engine
  const fetchOffers = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const data = await getRideOffers(token);
        // Ensure data is an array before setting
        setOffers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to fetch offers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
    // Poll for new offers every 10 seconds
    const interval = setInterval(fetchOffers, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (tripId: string) => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    try {
      const result = await acceptRide(tripId, token);
      if (result.status === 'success') {
        Alert.alert("Success", "Trip Accepted! Head to pickup.");
        // Redirect to Phase 4: Tracking/Map screen
        // router.push({ pathname: '/(driver)/activeTrip', params: { tripId } });
      } else {
        Alert.alert("Error", result.error || "Could not accept ride.");
        fetchOffers(); // Refresh list to remove taken ride
      }
    } catch (error) {
      Alert.alert("Network Error", "Check your internet connection.");
    }
  };

  const handleReject = async (tripId: string) => {
    // 🔥 OPTIMISTIC UI: Remove it from the screen immediately!
    // No waiting for AsyncStorage or the network.
    setOffers(prev => prev.filter(offer => offer.id !== tripId));

    // Now handle the backend sync silently in the background
    const token = await AsyncStorage.getItem('userToken');
    if (!token) return;

    try {
      await rejectRide(tripId, token);
    } catch (error) {
      console.error("Reject Error:", error);
    }
  };

  const renderOfferItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.phoneRow}>
          <Phone size={16} color="#FF8C00" />
          <Text style={styles.phoneText}>{item.rider_phone || "Hidden Number"}</Text>
        </View>
        {/* Added Fare Display - Vital for Driver Decision */}
        <View style={styles.fareBadge}>
          <Banknote size={16} color="#10B981" />
          <Text style={styles.fareText}>₦{item.final_fare}</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <Navigation size={16} color="#FF8C00" style={styles.iconShift} />
          <View>
            <Text style={styles.locationLabel}>Pickup</Text>
            <Text style={styles.locationValue}>{item.pickup_location_name}</Text>
          </View>
        </View>

        <View style={[styles.locationRow, { marginTop: 12 }]}>
          <MapPin size={16} color="#FF8C00" style={styles.iconShift} />
          <View>
            <Text style={styles.locationLabel}>Dropoff</Text>
            <Text style={styles.locationValue}>{item.dropoff_location_name}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable 
          onPress={() => handleAccept(item.id)}
          style={({ pressed }) => [styles.acceptButton, pressed && styles.btnOpacity]}
        >
          <Text style={styles.acceptText}>Accept</Text>
        </Pressable>
        
        <Pressable 
          onPress={() => handleReject(item.id)}
          style={({ pressed }) => [styles.rejectButton, pressed && styles.btnGreyed]}
        >
          <Text style={styles.rejectText}>Reject</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFF" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Ride Offers</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#FF8C00" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={offers}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOfferItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No ride offers available in Jimeta right now</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  header: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
  },
  backButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  backText: { 
    color: '#FFF', 
    fontSize: 16, 
    marginLeft: 8 
  },
  headerTitle: { 
    color: '#FFF', 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  listContent: { 
    padding: 20 
  },
  card: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16, // Softer corners for a premium feel
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 15 
  },
  phoneRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  phoneText: { 
    marginLeft: 8, 
    fontSize: 16, 
    color: '#374151', 
    fontWeight: '600' 
  },
  fareBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#ECFDF5', // Light green background
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    borderRadius: 8, 
    gap: 4 
  },
  fareText: { 
    color: '#059669', // Deep green text
    fontWeight: 'bold', 
    fontSize: 18 
  },
  locationContainer: { 
    marginBottom: 20,
    paddingLeft: 4 // Alignment tweak
  },
  locationRow: { 
    flexDirection: 'row', 
    alignItems: 'flex-start' 
  },
  iconShift: { 
    marginTop: 4, 
    marginRight: 12 
  },
  locationLabel: { 
    fontSize: 11, 
    color: '#9CA3AF', 
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  locationValue: { 
    fontSize: 15, 
    color: '#111827', 
    fontWeight: '400',
    marginTop: 2
  },
  actionRow: { 
    flexDirection: 'row', 
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16
  },
  acceptButton: {
    flex: 1.5, // Accept button is wider/more prominent
    backgroundColor: '#FF8C00',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  acceptText: { 
    color: '#FFF', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  rejectButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#F3F4F6',
    backgroundColor: '#F9FAFB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  rejectText: { 
    color: '#6B7280', 
    fontWeight: '600', 
    fontSize: 16 
  },
  btnOpacity: { 
    opacity: 0.8 
  },
  btnGreyed: { 
    backgroundColor: '#E5E7EB' 
  },
  emptyContainer: { 
    marginTop: 100, 
    alignItems: 'center',
    paddingHorizontal: 40
  },
  emptyText: { 
    color: '#9CA3AF', 
    fontSize: 16, 
    textAlign: 'center',
    lineHeight: 22
  },
});
````

## File: Documents/REIKEKE2/frontend/app/(driver)/otp-verify.tsx
````typescript
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Pressable, 
  StyleSheet, 
  SafeAreaView, 
  Alert,
  ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { verifyTripOTP } from '../../services/endpoints/driver';
import { ShieldCheck, ArrowLeft } from 'lucide-react-native';

export default function OTPVerifyScreen() {
  const { tripId, action } = useLocalSearchParams();
  const router = useRouter();
  
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 'action' will be either 'start' or 'end'
  const isStarting = action === 'start';
  const titleText = isStarting ? 'Start Ride Verification' : 'End Ride Verification';
  const subtitleText = isStarting 
    ? "Ask the passenger for their 6-digit Start PIN to begin the trip." 
    : "Ask the passenger for their 6-digit Completion PIN to end the trip.";

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid Entry", "Please enter the complete 6-digit PIN.");
      return;
    }

    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token || !tripId) throw new Error("Missing authentication or trip data.");

      const response = await verifyTripOTP(tripId as string, otp, action as string, token);
      
      // Verification Successful!
      Alert.alert("Success", response.message);
      
      // Push them back to the Home page. 
      // The polling hook there will automatically pick up the new database state!
      router.replace('/driverHome');

    } catch (error: any) {
    
      Alert.alert("Verification Failed", error.message || "Incorrect PIN.");
      setOtp(''); // Clear the wrong PIN
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#111827" />
        </Pressable>
        <Text style={styles.headerTitle}>Verification</Text>
      </View>

      <View style={styles.container}>
        <ShieldCheck size={64} color="#FF8C00" style={styles.icon} />
        
        <Text style={styles.title}>{titleText}</Text>
        <Text style={styles.subtitle}>{subtitleText}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.otpInput}
            value={otp}
            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))} // Numbers only
            keyboardType="number-pad"
            maxLength={6}
            placeholder="000000"
            placeholderTextColor="#D1D5DB"
            autoFocus
          />
        </View>

        <Pressable 
          style={[
            styles.verifyButton, 
            otp.length === 6 ? styles.verifyButtonActive : styles.verifyButtonDisabled
          ]} 
          onPress={handleVerify}
          disabled={otp.length !== 6 || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.verifyButtonText}>
              {isStarting ? "Confirm & Start Ride" : "Confirm & End Ride"}
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  backButton: { paddingRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  container: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  icon: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', marginBottom: 40, lineHeight: 24, paddingHorizontal: 10 },
  inputContainer: { width: '100%', alignItems: 'center', marginBottom: 40 },
  otpInput: { fontSize: 40, fontWeight: 'bold', color: '#111827', letterSpacing: 8, textAlign: 'center', borderBottomWidth: 2, borderColor: '#FF8C00', paddingVertical: 10, width: '80%' },
  verifyButton: { width: '100%', paddingVertical: 18, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  verifyButtonActive: { backgroundColor: '#FF8C00', elevation: 3 },
  verifyButtonDisabled: { backgroundColor: '#F3F4F6' },
  verifyButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});
````

## File: Documents/REIKEKE2/frontend/app/(rider)/_layout.tsx
````typescript
import { Stack } from 'expo-router';

export default function RiderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="riderLogin" />
      <Stack.Screen name="riderSignup" />
      
      
      <Stack.Screen name="riderConfirm" />
      

    </Stack>
  );
}
````

## File: Documents/REIKEKE2/frontend/app/(rider)/riderConfirm.tsx
````typescript
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, ArrowRight, Navigation, Banknote } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestRide } from '@/services/endpoints/rider';

export default function ConfirmRide() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
    
  // Extract params (sent from riderHome)
  const { pickup, dropoff, pLat, pLng, dLat, dLng, price, distance } = params;

  const handleFinalAccept = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/(auth)');
        return;
      }

      // Re-map the params back to the format your service expects
      const rideData = {
  pickup_location_name: pickup,
  dropoff_location_name: dropoff,
  // Round these here too so the Trip Model doesn't reject the save!
  pickup_lat: parseFloat(parseFloat(pLat as string).toFixed(6)),
  pickup_lng: parseFloat(parseFloat(pLng as string).toFixed(6)),
  dropoff_lat: parseFloat(parseFloat(dLat as string).toFixed(6)),
  dropoff_lng: parseFloat(parseFloat(dLng as string).toFixed(6)),
  estimated_fare: parseFloat(price as string), 
};

      
      const response = await requestRide(rideData, token);

if (response && response.trip_id) {
  // Navigate to searching screen with the new trip ID
  router.replace({
   pathname: '/searching', // REMOVE the /(rider)/ part
   params: { trip_id: response.trip_id }
 });
}
    } catch (error) {
      Alert.alert("Network Error", "Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Confirm Your Ride</Text>
        
        {/* Route Summary */}
        <View style={styles.routeContainer}>
          <View style={styles.point}>
            <MapPin size={20} color="#FF8C00" />
            <Text style={styles.locationText} numberOfLines={1}>{pickup}</Text>
          </View>
          
          <View style={styles.line} />
          
          <View style={styles.point}>
            <Navigation size={20} color="#10B981" />
            <Text style={styles.locationText} numberOfLines={1}>{dropoff}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
              <Banknote size={20} color="#FF8C00" />
              <Text style={styles.infoLabel}>Estimated Fare</Text>
              {/* NOW IT SHOWS THE REAL PRICE */}
              <Text style={styles.infoValue}>₦{price || "---"}</Text> 
          </View>
          
          <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Distance</Text>
              <Text style={styles.infoValue}>{distance || "0"} km</Text>
          </View>
      </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <Pressable 
            style={[styles.btn, styles.cancelBtn]} 
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>

          <Pressable 
            style={[styles.btn, styles.confirmBtn]} 
            onPress={handleFinalAccept}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.confirmText}>Request Keke</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6', justifyContent: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 20, padding: 24, elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  routeContainer: { marginBottom: 24 },
  point: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10 },
  locationText: { fontSize: 16, color: '#374151', flex: 1 },
  line: { width: 2, height: 20, backgroundColor: '#E5E7EB', marginLeft: 10 },
  infoRow: { borderTopWidth: 1, borderColor: '#F3F4F6', paddingTop: 20, marginBottom: 24 },
  infoBox: { alignItems: 'center' },
  infoLabel: { fontSize: 12, color: '#6B7280' },
  infoValue: { fontSize: 18, fontWeight: 'bold', color: '#111827' },
  buttonGroup: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#F3F4F6' },
  confirmBtn: { backgroundColor: '#FF8C00' },
  cancelText: { color: '#6B7280', fontWeight: '600' },
  confirmText: { color: 'white', fontWeight: 'bold' },
});
````

## File: Documents/REIKEKE2/frontend/app/(rider)/riderHome.tsx
````typescript
import React, { useState, useEffect } from 'react';
import { 
  View, Text, Pressable, StyleSheet, StatusBar, Alert, KeyboardAvoidingView, Platform,ActivityIndicator
} from 'react-native';
// Use the modern Safe Area context
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { getTripStatus, cancelTrip } from '@/services/endpoints/rider'; 
import { BASE_URL } from '@/services/config';

export default function PassengerHome() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { active_trip_id } = useLocalSearchParams();
  const [cancelling, setCancelling] = useState(false);
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [pickupCoords, setPickupCoords] = useState<{lat: number | null, lng: number | null}>({ lat: null, lng: null });
  const [dropoffCoords, setDropoffCoords] = useState<{lat: number | null, lng: number | null}>({ lat: null, lng: null });
  const [activeTrip, setActiveTrip] = useState<any>(null);

  const handleCancelRide = async () => {
  if (!activeTrip) return;

  Alert.alert(
    "Cancel Ride",
    "Are you sure you want to cancel this ride?",
    [
      { text: "No", style: "cancel" },
      {
        text: "Yes, Cancel",
        style: "destructive",
        onPress: async () => {
          try {
            setCancelling(true);
            const token = await AsyncStorage.getItem('userToken');
            if (!token) {
              Alert.alert("Error", "Please login again");
              return;
            }

            const result = await cancelTrip(activeTrip.trip_id, token);

            if (result.status === "success") {
              setActiveTrip(null);
              router.setParams({ active_trip_id: '' });
              Alert.alert("Success", "Ride cancelled successfully");
            } else {
              Alert.alert("Error", result.error || "Failed to cancel ride");
            }
          } catch (error) {
            Alert.alert("Error", "Network error. Please try again.");
          } finally {
            setCancelling(false);
          }
        }
      }
    ]
  );
};

  const handleConfirm = async () => {
  if (!pickupCoords.lat || !dropoffCoords.lat) {
    Alert.alert("Error", "Please select valid locations.");
    return;
  }

  try {
    const token = await AsyncStorage.getItem('userToken');

    const response = await fetch(`${BASE_URL}/rides/estimate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        pickup_lat: pickupCoords.lat,
        pickup_lng: pickupCoords.lng,
        dropoff_lat: dropoffCoords.lat,
        dropoff_lng: dropoffCoords.lng,
      }),
    });

    const result = await response.json();

    if (response.ok && result.status === "success") {
      router.push({
        pathname: "/(rider)/riderConfirm",
        params: {
          pickup,
          dropoff,
          price: result.estimate.estimated_fare.toString(),
          distance: result.estimate.distance_km.toString(),
          pLat: pickupCoords.lat?.toString() ?? '',
          pLng: pickupCoords.lng?.toString() ?? '',
          dLat: dropoffCoords.lat?.toString() ?? '',
          dLng: dropoffCoords.lng?.toString() ?? '',
        }
      });
    } else {
      Alert.alert("Error", result.error || "Could not calculate fare.");
    }
  } catch (error) {
    Alert.alert("Connection Error", "Check your server.");
  }
};
  // Polling Logic
  useEffect(() => {
  let pollInterval: any;
  const runPolling = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const tripId = active_trip_id || (activeTrip?.id);
    if (token && tripId) {
      try {
        const result = await getTripStatus(tripId as string, token);
        if (result.status === 'CANCELLED') {
          setActiveTrip(null);
          router.setParams({ active_trip_id: '' });
          clearInterval(pollInterval);
        } else {
          setActiveTrip(result);
          if (result.status === 'COMPLETED') {
            clearInterval(pollInterval);
            setTimeout(() => { setActiveTrip(null); router.setParams({ active_trip_id: '' }); }, 5000);
          }
        }
      } catch (e) { console.error("Polling error:", e); }
    }
  };

  if (active_trip_id || activeTrip?.id) {
    runPolling();
    pollInterval = setInterval(runPolling, 5000);
  }
  return () => clearInterval(pollInterval);
}, [active_trip_id, activeTrip?.id]);

  const isButtonDisabled = !pickupCoords.lat || !dropoffCoords.lat || !!activeTrip;

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#FF8C00" />
      
      {/* Dynamic Header padding based on device notch */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={styles.headerTitle}>Keke Napep</Text>
        <Text style={styles.headerSubtitle}>Yola Private Engine</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>
          
          {/* LIVE DASHBOARD */}
          {activeTrip && (
  <View style={styles.statusCard}>
    <View style={styles.dashboardHeader}>
      <View style={styles.statusBadge}>
        <Text style={styles.statusBadgeText}>{activeTrip.status}</Text>
      </View>
      <Pressable onPress={() => Alert.alert("SOS", "Alerting Security...")} style={styles.sosButton}>
        <Text style={styles.sosText}>SOS</Text>
      </Pressable>
    </View>

    {activeTrip.status !== 'COMPLETED' ? (
      <View>
        <Text style={styles.mainStatusText}>
          {activeTrip.status === 'ACCEPTED' ? "🚕 Driver is arriving" : 
           activeTrip.status === 'STARTED' ? "✅ Trip in Progress" : 
           "🔍 Searching for nearby Keke..."}
        </Text>
        
        {/* OTP Section: Only shows once a driver is involved */}
        {(activeTrip.status === 'ACCEPTED' || activeTrip.status === 'STARTED') && (
          <View style={styles.otpContainer}>
            <Text style={styles.otpLabel}>
              {activeTrip.status === 'ACCEPTED' 
                ? "GIVE PIN TO DRIVER TO START:" 
                : "GIVE PIN TO DRIVER TO END:"}
            </Text>
            <Text style={styles.otpValue}>{activeTrip.otp || "----"}</Text>
          </View>
        )}

        {/* Cancel Button: Now visible for all active states */}
        <Pressable
          onPress={handleCancelRide}
          style={[styles.cancelButton, cancelling && styles.buttonDisabled2]}
          disabled={cancelling}
        >
          {cancelling ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.cancelButtonText}>Cancel Ride</Text>
          )}
        </Pressable>
      </View>
    ) : (
      /* Completion Message */
      <Text style={styles.successText}>✨ Trip Finished. Thank you!</Text>
    )}
  </View>
)}

          {/* INPUTS - Only show if no active trip */}
          {!activeTrip && (
            <View style={styles.inputCard}>
               <GooglePlacesAutocomplete
                  placeholder="Pickup Location"
                  fetchDetails={true}
                  onPress={(data, details = null) => {
                    setPickup(data.description);
                    if (details) setPickupCoords({ lat: details.geometry.location.lat, lng: details.geometry.location.lng });
                  }}
                  query={{ key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY, language: 'en', components: 'country:ng' }}
                  enablePoweredByContainer={false}
                  suppressDefaultStyles={true}
                  styles={{ textInput: styles.input, listView: styles.listView }}
                />
                <View style={{ height: 15 }} />
                <GooglePlacesAutocomplete
                  placeholder="Where to?"
                  fetchDetails={true}
                  onPress={(data, details = null) => {
                    setDropoff(data.description);
                    if (details) setDropoffCoords({ lat: details.geometry.location.lat, lng: details.geometry.location.lng });
                  }}
                  query={{ key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY, language: 'en', components: 'country:ng' }}
                  enablePoweredByContainer={false}
                  suppressDefaultStyles={true}
                  styles={{ textInput: styles.input, listView: styles.listView }}
                />
            </View>
          )}

          <Pressable 
            onPress={handleConfirm}
            disabled={isButtonDisabled}
            style={[styles.confirmButton, isButtonDisabled && styles.buttonDisabled]}
          >
            <Text style={styles.confirmButtonText}>
              {activeTrip ? 'Active Trip' : 'Confirm Ride'}
            </Text>
          </Pressable>
          <Pressable 
  onPress={async () => {
    await AsyncStorage.removeItem('userToken');
    router.replace('/(auth)');
  }}
  style={{
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15
  }}
>
  <Text style={{ color: 'white', fontWeight: 'bold' }}>
    Logout
  </Text>
</Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
  backgroundColor: '#EF4444',
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
  marginTop: 10
},
cancelButtonText: {
  color: '#FFFFFF',
  fontWeight: 'bold',
  fontSize: 16
},
buttonDisabled2: {
  opacity: 0.5
},
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    backgroundColor: '#FF8C00', 
    paddingHorizontal: 24, 
    paddingBottom: 30, 
    borderBottomLeftRadius: 30, 
    borderBottomRightRadius: 30 
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 16, color: '#FFFFFF', opacity: 0.9 },
  container: { flex: 1, padding: 20 },
  inputCard: { 
    backgroundColor: 'white', 
    borderRadius: 16, 
    padding: 16, 
    elevation: 10, 
    shadowColor: '#000', 
    shadowOpacity: 0.1, 
    shadowRadius: 10 
  },
  input: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, fontSize: 16 },
  listView: { position: 'absolute', top: 50, left: 0, right: 0, backgroundColor: 'white', zIndex: 1000, elevation: 5 },
  confirmButton: { backgroundColor: '#FF8C00', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 'auto' },
  buttonDisabled: { backgroundColor: '#D1D5DB' },
  confirmButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  statusCard: { backgroundColor: '#111827', padding: 20, borderRadius: 20 },
  dashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  statusBadge: { backgroundColor: '#FF8C00', paddingVertical: 4, paddingHorizontal: 12, borderRadius: 20 },
  statusBadgeText: { color: 'white', fontWeight: 'bold', fontSize: 12 },
  sosButton: { backgroundColor: '#EF4444', padding: 10, borderRadius: 10 },
  sosText: { color: 'white', fontWeight: 'bold' },
  mainStatusText: { color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  otpContainer: { marginTop: 20, padding: 20, backgroundColor: '#1F2937', borderRadius: 15, alignItems: 'center' },
  otpLabel: { color: '#9CA3AF', fontSize: 11, marginBottom: 10 },
  otpValue: { color: '#FF8C00', fontSize: 48, fontWeight: 'bold', letterSpacing: 10 },
  successText: { color: '#10B981', textAlign: 'center', fontWeight: 'bold', fontSize: 18 }
});
````

## File: Documents/REIKEKE2/frontend/app/(rider)/riderLogin.tsx
````typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { authStyles as styles } from '../../src/styles';
import { useRouter } from 'expo-router'; 
import { loginUser } from '@/services/endpoints/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RiderLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
  setLoading(true);
  setError('');

  try {
    const result = await loginUser({ 
      phone_number: phone, 
      password: password 
    });

    if (result.access) {
  // 1. Only allow login if they ARE a rider
  if (result.is_rider) {
    await AsyncStorage.setItem('userToken', result.access);
    await AsyncStorage.setItem('userRole', 'rider');
    
    console.log("Rider Login Success.");
    router.replace('/riderHome');
  } 
  // 2. If they are a driver trying to use the Rider login
  else if (result.is_driver) {
    Alert.alert(
      "Wrong Login", 
      "This is the Passenger login. Please use the Driver login page to start working."
    );
    // We do NOT save the token here, we make them go to the right page
  } else {
    Alert.alert("Account Error", "No role assigned to this account.");
  }
}
  } catch (err) {
    Alert.alert("Network Error", "Could not reach the Yola server.");
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/(auth)')} style={styles.backButton}>
            <ArrowLeft size={24} color="#FF8C00" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formWrapper}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Rider Login</Text>
              <Text style={{ color: '#6B7280', marginTop: 8 }}>Welcome back to your Keke app</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad" 
                maxLength={11} 
                placeholder="080..." 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                />
                <Pressable onPress={() => setShowPassword(v => !v)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: '#FF8C00' }}>{showPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable 
              style={({ pressed }) => [
                styles.submitButton, 
                (pressed || loading) && styles.buttonPressed
              ]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.submitButtonText}>Login</Text>
              )}
            </Pressable>

            <Pressable 
              onPress={() => router.push('/riderSignup')} 
              style={styles.toggleContainer}
            >
              <Text style={styles.toggleText}>
                Don't have an account? <Text style={styles.toggleTextHighlight}>Sign up</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
````

## File: Documents/REIKEKE2/frontend/app/(rider)/riderSignup.tsx
````typescript
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowLeft } from 'lucide-react-native';
import { authStyles as styles } from '../../src/styles';
import { useRouter } from 'expo-router'; 
import { registerUser } from '@/services/endpoints/auth';

export default function RiderSignupPage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    setError('');

    // 1. Strict Validation
    if (phone.length !== 11) {
      setError('Phone number must be 11 digits');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // 2. The Rider Payload (Notice is_rider: true)
      const result = await registerUser({
        phone_number: phone,
        password: password,
        is_rider: true,
        is_driver: false,
      });

      // 3. Handle Token & Navigation
      const token = result.token || result.access;

      if (token) {
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userRole', 'rider');
        Alert.alert('Success', 'Welcome to Yola Keke!');
        router.replace('/riderHome'); // Send to RIDER home, not driver
      } else {
        setError(result.message || 'Registration failed. Try a different number.');
      }
    } catch (err) {
      // If it "just loads" and then hits here, it's a network/timeout issue
      setError('Cannot reach server. Check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.header}>
          <Pressable onPress={() => router.push('/(auth)')} style={styles.backButton}>
            <ArrowLeft size={24} color="#FF8C00" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.formWrapper}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Rider Sign Up</Text>
              <Text style={{ color: '#6B7280', marginTop: 8 }}>Create your account to start booking rides</Text>
            </View>

            {/* Phone Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad" 
                maxLength={11} 
                placeholder="080..." 
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="••••••••"
                />
                <Pressable onPress={() => setShowPassword(!showPassword)} style={{ marginLeft: 8 }}>
                  <Text style={{ color: '#FF8C00' }}>{showPassword ? 'Hide' : 'Show'}</Text>
                </Pressable>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                placeholder="••••••••"
              />
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Pressable 
              style={[styles.submitButton, loading && styles.buttonPressed]} 
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Join as Rider</Text>}
            </Pressable>

            <Pressable onPress={() => router.push('/riderLogin')} style={styles.toggleContainer}>
              <Text style={styles.toggleText}>Already have an account? <Text style={styles.toggleTextHighlight}>Login</Text></Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
````

## File: Documents/REIKEKE2/frontend/app/(rider)/searching.tsx
````typescript
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { cancelRide, getTripStatus } from '@/services/endpoints/rider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SearchingForDriver() {
  const router = useRouter();
  const { trip_id } = useLocalSearchParams();
  const [dots, setDots] = useState('.');

  useEffect(() => {
    // 1. Simple animation for the "Searching..." text
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '.');
    }, 500);

    // 2. Start Polling the status
    const pollInterval = setInterval(async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token && trip_id) {
        const result = await getTripStatus(trip_id as string, token);
        
        if (result.status === 'ACCEPTED') {
  clearInterval(pollInterval);
  // Send them back home with the Trip ID as a parameter
  router.replace({
    pathname: '/(rider)/riderHome',
    params: { active_trip_id: trip_id }
  });
}
      }
    }, 5000); // Poll every 5 seconds for Yola network resilience

    return () => {
      clearInterval(interval);
      clearInterval(pollInterval);
    };
  }, [trip_id]);

  const handleCancel = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token && trip_id) {
      await cancelRide(trip_id as string, token);
      router.replace('/(rider)/riderHome');
    }
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF8C00" />
      <Text style={styles.title}>Looking for a Keke{dots}</Text>
      <Text style={styles.subtitle}>Connecting you with the nearest Private Keke in Jimeta...</Text>
      
      <Pressable style={styles.cancelBtn} onPress={handleCancel}>
        <Text style={styles.cancelText}>Cancel Request</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 20, color: '#111827' },
  subtitle: { textAlign: 'center', color: '#6B7280', marginTop: 10, fontSize: 16 },
  cancelBtn: { marginTop: 50, padding: 15 },
  cancelText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 }
});
````

## File: Documents/REIKEKE2/frontend/app/_layout.tsx
````typescript
import { useEffect, useState } from 'react';
import { useRouter, useSegments, useRootNavigationState, Slot } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  
  const [isReady, setIsReady] = useState(false);
  const [hasToken, setHasToken] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // 1. Navigation Readiness Check
  useEffect(() => {
    if (navigationState?.key) {
      setIsReady(true);
    }
  }, [navigationState?.key]);

  // 2. Auth & Role Check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const role = await AsyncStorage.getItem('userRole');
        setHasToken(!!token);
        setUserRole(role);
      } catch (e) {
        setHasToken(false);
      }
    };
    checkAuth();
  }, [segments]);

  // 3. The Bouncer (Guard) Logic
  useEffect(() => {
    // Stop if navigation isn't ready or we haven't finished the storage check
    if (!isReady || hasToken === null) return;

    const rootGroup = segments[0]; 
    const inAuthGroup = rootGroup === '(auth)';
    
    // MOVE THIS INSIDE THE EFFECT so it's always in scope
    const isAccessingPublicRoute = 
      segments.includes('driverLogin') || 
      segments.includes('riderLogin') ||
      segments.includes('riderSignup') || 
      segments.includes('driverSignup');

    if (!hasToken) {
      // If no token and not in auth/public pages, force to Role Selection
      if (!inAuthGroup && !isAccessingPublicRoute) {
        console.log("Guard: No token. Redirecting to Role Selection.");
        router.replace('/(auth)');
      }
    } else {
      // If HAS token and trying to go back to Login/Signup
      if (inAuthGroup || isAccessingPublicRoute) {
        console.log(`Guard: Token found (${userRole}). Redirecting to Home.`);
        
        if (userRole === 'driver') {
          router.replace('/driverHome');
        } else {
          router.replace('/riderHome');
        }
      }
    }
  }, [isReady, segments, hasToken, userRole]);

  // Show nothing while loading to avoid "ReferenceError" flash
  if (!isReady || hasToken === null) return null;

  return <Slot />;
}
````

## File: Documents/REIKEKE2/frontend/components/ui/collapsible.tsx
````typescript
import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
````

## File: Documents/REIKEKE2/frontend/components/ui/icon-symbol.ios.tsx
````typescript
import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}
````

## File: Documents/REIKEKE2/frontend/components/ui/icon-symbol.tsx
````typescript
// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
````

## File: Documents/REIKEKE2/frontend/components/external-link.tsx
````typescript
import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}
````

## File: Documents/REIKEKE2/frontend/components/haptic-tab.tsx
````typescript
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
````

## File: Documents/REIKEKE2/frontend/components/hello-wave.tsx
````typescript
import Animated from 'react-native-reanimated';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}
````

## File: Documents/REIKEKE2/frontend/components/LocationSearch.native.tsx
````typescript
import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

type Props = {
  label?: string;
  onSelect: (loc: { description: string; lat: number; lng: number }) => void;
};

export default function LocationSearch({ label = 'Search', onSelect }: Props) {
  return (
    <GooglePlacesAutocomplete
      placeholder={label}
      fetchDetails={true}
      onPress={(data, details = null) => {
        if (details?.geometry?.location) {
          onSelect({
            description: data.description,
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
          });
        }
      }}
      query={{ key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY, language: 'en', components: 'country:ng' }}
      enablePoweredByContainer={false}
      suppressDefaultStyles={true}
      styles={{ textInput: { backgroundColor: '#F3F4F6', padding: 12, borderRadius: 8, fontSize: 16 }, listView: { position: 'absolute', top: 50, left: 0, right: 0, zIndex: 1000 } }}
    />
  );
}
````

## File: Documents/REIKEKE2/frontend/components/parallax-scroll-view.tsx
````typescript
import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}>
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});
````

## File: Documents/REIKEKE2/frontend/components/themed-text.tsx
````typescript
import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
````

## File: Documents/REIKEKE2/frontend/components/themed-view.tsx
````typescript
import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
````

## File: Documents/REIKEKE2/frontend/constants/theme.ts
````typescript
/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
````

## File: Documents/REIKEKE2/frontend/context/AuthContext.tsx
````typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { getMyProfile } from '../services/endpoints/auth';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // 'driver' or 'passenger'
  const [isLoading, setIsLoading] = useState(true);

  const loadStorageData = async () => {
  try {
    const storedToken = await SecureStore.getItemAsync('userToken');
    let storedRole = await SecureStore.getItemAsync('userRole');

    // If we have a token but no role, try to fetch it, 
    // but put a timeout on it or wrap it in another try/catch
    if (storedToken && !storedRole) {
      try {
        const profile = await getMyProfile(storedToken);
        storedRole = profile.is_driver ? 'driver' : 'passenger';
        await SecureStore.setItemAsync('userRole', storedRole);
      } catch (profileError) {
        console.warn("Could not fetch profile, but continuing to app...");
        // If profile fetch fails, we don't set a role, 
        // which forces the user back to login anyway.
      }
    }

    setToken(storedToken);
    setRole(storedRole);
  } catch (e) {
    console.error("Storage Error", e);
  } finally {
    // This MUST run regardless of network success
    setIsLoading(false); 
  }
};

  useEffect(() => { loadStorageData(); }, []);

  return (
    <AuthContext.Provider value={{ token, role, setToken, setRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
````

## File: Documents/REIKEKE2/frontend/hooks/use-color-scheme.ts
````typescript
export { useColorScheme } from 'react-native';
````

## File: Documents/REIKEKE2/frontend/hooks/use-color-scheme.web.ts
````typescript
import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}
````

## File: Documents/REIKEKE2/frontend/hooks/use-theme-color.ts
````typescript
/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
````

## File: Documents/REIKEKE2/frontend/scripts/reset-project.js
````javascript
#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);
````

## File: Documents/REIKEKE2/frontend/services/endpoints/auth.ts
````typescript
import { createNavigationContainerRef } from '@react-navigation/native';
import {BASE_URL, API_HEADERS} from '../config'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

 export const registerUser = async (userData: any) => {
    try {
        const response = await fetch(`${BASE_URL}/auth/register/`, {
            method: 'POST',
            headers: API_HEADERS,
            body: JSON.stringify(userData)
        });

        const data = await response.json();

        if (!response.ok) {
            // If Django sends 400/500, throw the message so 'catch' handles it
            throw new Error(data.message || data.detail || JSON.stringify(data));
        }

        return data;
    } catch (error) {
        console.error("Service Error:", error);
        throw error; // Re-throw so the UI can show the error
    }
};

 export const loginUser= async(credentaials:any)=>{
    const response = await fetch(`${BASE_URL}/auth/login/`,{
        method:"POST",
        headers:API_HEADERS,
        body:JSON.stringify(credentaials)
    })
    return await response.json()
 }

export const getMyProfile= async(token: string)=>{
    const response=await fetch(`${BASE_URL}/auth/users/me`,{
        method:'GET',
        headers:{
            ...API_HEADERS,
            'Authorization':`Bearer ${token}`,

        }
    })
    return await response.json()
}
````

## File: Documents/REIKEKE2/frontend/services/endpoints/driver.ts
````typescript
import { BASE_URL,API_HEADERS } from "../config";



export const updateDriverStatus =async(isOnline:boolean, token:string)=>{
    try{
        const response= await fetch(`${BASE_URL}/auth/users/me/driver/`, {
            method: 'PATCH',
            headers: {
                ... API_HEADERS,
                'Authorization':`Bearer ${token}`
            },
            body: JSON.stringify({is_online:isOnline})

        })
        return await response.json()
    } catch (error){
        console.error("Status Toggle Error :", error);
        throw error;
    }
}



export const getRideOffers = async (token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/rides/offers/`, {
            method: 'GET',
            headers: {
                ...API_HEADERS,
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Offers Fetch Failed (${response.status}):`, errorText);
            return []; 
        }

        const data = await response.json();
        const rawOffers = Array.isArray(data) ? data : (data.results || []);
        
        // SAFETY NET: Filter out anything older than 30 mins (1800000 ms)
        // This ensures the frontend drops it immediately even if the backend lagged
        const thirtyMinsAgo = Date.now() - (30 * 60 * 1000);
        const validOffers = rawOffers.filter((offer: any) => {
             const offerTime = new Date(offer.created_at).getTime();
             return offerTime > thirtyMinsAgo;
        });

        return validOffers;
        
    } catch (error) {
        console.error("Fetch Ride Offers Error:", error);
        return []; 
    }
}
export const acceptRide=async (tripId:string, token:string)=>{
    try{
        const response =await fetch (`${BASE_URL}/rides/trips/${tripId}/accept/`, {
            method:'POST',
            headers: {
                ... API_HEADERS,
                'Authorization':`Bearer ${token}`
            }
        })
        const contentType = response.headers.get("content-type");
        if (response.ok && contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            // Handle non-JSON or error responses gracefully
            const errorText = await response.text();
            console.warn("Server returned non-JSON:", errorText);
            return { success: response.ok, status: response.status };
        }
    } catch (error) {
        console.error("Accept Ride Network Error:", error);
        throw error;
    }
}
// Add this new export to your existing file

export const getCurrentTrip = async (token: string) => {
  try {
    // Make sure API_BASE_URL matches whatever you use in this file
    const response = await fetch(`${BASE_URL}/trips/current/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    

    if (!response.ok) {
      throw new Error('Failed to fetch current trip state');
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching current trip:", error);
    throw error;
  }
};

export const verifyTripOTP = async (tripId: string, otp: string, action: string, token: string) => {
    console.log("Trip ID:", tripId);
  try {
    const response = await fetch(`${BASE_URL}/${tripId}/verify/`, { // Added api/v1
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp, action })
    });

    const text = await response.text();

    if (!response.ok) {
        // This will now catch the HTML and tell you why it failed
        console.error("Server Error Response:", text);
        throw new Error("Verification failed. Check console.");
    }

    return JSON.parse(text); // Semicolon here
  } catch (error) { // Line 133
    console.error("OTP Verification Error:", error);
    throw error;
  }
};
export const rejectRide=async (tripId:string, token:string)=>{
    try{
        const response =await fetch (`${BASE_URL}/trips/${tripId}/reject/`, {
            method:'POST',
            headers: {
                ... API_HEADERS,
                'Authorization':`Bearer ${token}`
            }
        })
        return await response.json()
    } catch (error){
        console.error("Reject Ride Error :", error);
        throw error;
    }
}
````

## File: Documents/REIKEKE2/frontend/services/endpoints/rider.ts
````typescript
import { BASE_URL, API_HEADERS } from "../config";
import { Alert } from "react-native";
import { router } from "expo-router";

export const requestRide = async (rideData: any, token: string) => {
  const payload = {
    pickup_location_name: rideData.pickup_location_name,
    dropoff_location_name: rideData.dropoff_location_name,
    pickup_lat: rideData.pickup_lat,
    pickup_lng: rideData.pickup_lng,
    dropoff_lat: rideData.dropoff_lat,
    dropoff_lng: rideData.dropoff_lng,
    final_fare: rideData.estimated_fare,
  };

  try {
    const response = await fetch(`${BASE_URL}/rides/request/`, {
      method: 'POST',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.code === "token_not_valid") {
      Alert.alert("Session Expired", "Please log in again to continue.");
      router.replace("/(auth)");
      return null;
    }

    return result;
  } catch (error) {
    console.error("NETWORK ERROR:", error);
    throw error;
  }
};

export const getCurrentTrip = async (token: string) => {
    
  try {
    const response = await fetch(`${BASE_URL}/rides/trips/current/`, {
      method: 'GET',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error(`Failed to fetch current trip (${response.status})`);
    return await response.json();
  } catch (error) {
    console.error("Status Check Error:", error);
    throw error;
  }
};

export const getTripStatus = async (tripId: string, token: string) => {
  if (!tripId) throw new Error("Missing Trip ID");
  try {
    const url = `${BASE_URL}/rides/trips/${tripId}/status/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`Backend Error (${response.status}):`, body);
      throw new Error(`Server returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Network/Service Error:", error);
    throw error;
  }
};

export const cancelTrip = async (tripId: string, token: string) => {
  try {
    const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/cancel/`, {
      method: 'POST',
      headers: {
        ...API_HEADERS,
        'Authorization': `Bearer ${token}`
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Cancel Trip Error:", error);
    throw error;
  }
};
````

## File: Documents/REIKEKE2/frontend/services/endpoints/trips.ts
````typescript
import { BASE_URL, API_HEADERS } from "../config";

export const startRide = async (tripId: string, otp: string, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/start/`, {
            method: 'POST',
            headers: {
                ...API_HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ otp }),
        });

        return await response.json();
    } catch (error) {
        console.error("Start Ride Error:", error);
        throw error;
    }
};

export const finishRide = async (tripId: string, otp: string, token: string) => {
    try {
        const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/end/`, {
            method: 'POST',
            headers: {
                ...API_HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ otp }),
        });

        return await response.json();
    } catch (error) {
        console.error("Finish Ride Error:", error);
        throw error;
    }
};

export const sendBreadcrumb = async (
    tripId: string,
    coords: { lat: number; lng: number },
    token: string
) => {
    try {
        const response = await fetch(`${BASE_URL}/rides/trips/${tripId}/track/`, {
            method: 'POST',
            headers: {
                ...API_HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(coords),
        });

        return await response.json();
    } catch (error) {
        console.log("Breadcrumb failed will retry at next interval");
    }
};
````

## File: Documents/REIKEKE2/frontend/services/config.ts
````typescript
// 1. No trailing slash
export const BASE_URL = "https://system-architecture-chi.vercel.app"; 

// 2. Dynamic header generator for JWT support
export const getApiHeaders = (token: string | null = null) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};
````

## File: Documents/REIKEKE2/frontend/src/styles.ts
````typescript
import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1 },
  header: { padding: 16 },
  backButton: { flexDirection: 'row', alignItems: 'center',marginTop:70 },
  backText: { color: '#FF8C00', fontSize: 16, marginLeft: 8 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  formWrapper: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  titleSection: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#FF8C00' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 16, color: '#374151', marginBottom: 8 },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontSize: 16,
    color: '#000',
    backgroundColor: '#FAFAFA'
  },
  errorText: { color: '#EF4444', textAlign: 'center', marginBottom: 16 },
  submitButton: {
    backgroundColor: '#FF8C00',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  buttonPressed: { backgroundColor: '#FF7700', opacity: 0.9 },
  toggleContainer: { marginTop: 24, alignItems: 'center' },
  toggleText: { color: '#4B5563', fontSize: 14 },
  toggleTextHighlight: { color: '#FF8C00', fontWeight: 'bold' },
});
````

## File: Documents/REIKEKE2/frontend/.env
````
EXPO_PUBLIC_API=http://192.168.3.115:8000/api/v1
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY='AIzaSyClL4a4RxTewNcthjseAWdIJRLy5TXlF2A'
````

## File: Documents/REIKEKE2/frontend/.gitignore
````
# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

app-example

# generated native folders
/ios
/android
````

## File: Documents/REIKEKE2/frontend/app.json
````json
{
  "expo": {
    "name": "frontend",
    "slug": "frontend",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "frontend",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false,
      "package": "com.onaopemipoehalaiye.frontend"
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true,
      "reactCompiler": true
    },
    "extra": {
      "router": {},
      "eas": {
        "projectId": "8a70b363-c14b-4ae9-a29b-5b7c2da2980f"
      }
    }
  }
}
````

## File: Documents/REIKEKE2/frontend/eas.json
````json
{
  "cli": {
    "version": ">= 21.4.0",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
````

## File: Documents/REIKEKE2/frontend/eslint.config.js
````javascript
// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);
````

## File: Documents/REIKEKE2/frontend/package.json
````json
{
  "name": "frontend",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "expo": "~54.0.33",
    "expo-constants": "~18.0.13",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-linking": "~8.0.11",
    "expo-location": "~19.0.8",
    "expo-router": "~6.0.23",
    "expo-secure-store": "~15.0.8",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-task-manager": "~14.0.9",
    "expo-web-browser": "~15.0.10",
    "lucide-react-native": "^0.575.0",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-google-places-autocomplete": "^2.6.4",
    "react-native-maps": "1.20.1",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-svg": "15.12.1",
    "react-native-web": "~0.21.0",
    "react-native-worklets": "0.5.1"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0",
    "typescript": "~5.9.2"
  },
  "private": true
}
````

## File: Documents/REIKEKE2/frontend/README.md
````markdown
# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
````

## File: Documents/REIKEKE2/frontend/tsconfig.json
````json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts"
  ]
}
````

## File: Documents/REIKEKE2/package.json
````json
{
  "dependencies": {
    "react-native-google-places-autocomplete": "^2.6.4"
  }
}
````

## File: package.json
````json
{
  "dependencies": {
    "repomix": "^1.17.0"
  }
}
````
