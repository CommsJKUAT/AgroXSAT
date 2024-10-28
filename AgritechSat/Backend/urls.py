from django.urls import path
from . import views
from .views import calculate_distance,image_data_view
from .views import register

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)


urlpatterns = [
    #path('', sensor_data_view, name="homepage"),
    path('register/', register, name="register"),
    path('distance/', calculate_distance, name="homepage"),
    path('images/', image_data_view, name="image"),
    path('login/', views.login),
    
    
]