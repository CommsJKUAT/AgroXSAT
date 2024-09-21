from django.urls import path
from .views import sensor_data_view,register


urlpatterns = [
    path('', sensor_data_view, name="homepage"),
    path('register/', register, name="homepage"),
    
    
    
]