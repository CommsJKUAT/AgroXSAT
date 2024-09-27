from django.urls import path
from . import views
from .views import sensor_data_view,calculate_distance
from .views import register

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    path('', sensor_data_view, name="homepage"),
    path('register/', register, name="register"),
    path('distance/', calculate_distance, name="homepage"),
    
    path('login/', views.login),
    
    
]