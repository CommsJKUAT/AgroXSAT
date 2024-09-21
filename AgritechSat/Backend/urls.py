from django.urls import path
from .views import sensor_data_view,register,calculate_distance


urlpatterns = [
    path('', sensor_data_view, name="homepage"),
    path('register/', register, name="homepage"),
    path('distance/', calculate_distance, name="homepage"),
    
    
    
]