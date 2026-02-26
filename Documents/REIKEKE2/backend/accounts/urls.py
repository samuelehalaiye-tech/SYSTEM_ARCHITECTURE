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