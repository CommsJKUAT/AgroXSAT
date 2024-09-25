from django.urls import path
from . import views
from .views import sensor_data_view,calculate_distance
#from .views import MyTokenObtainPairViewregister,
#
#from rest_framework_simplejwt.views import (
#    TokenRefreshView,
#)
#

urlpatterns = [
    path('', sensor_data_view, name="homepage"),
    #path('register/', register, name="register"),
    path('distance/', calculate_distance, name="homepage"),
    #path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    #path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    #path('login/', views.login),
    
    
]