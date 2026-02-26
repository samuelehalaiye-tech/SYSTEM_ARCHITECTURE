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


