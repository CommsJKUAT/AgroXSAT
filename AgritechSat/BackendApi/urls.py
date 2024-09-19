from django.urls import path
from .views import homepage,backendapires


urlpatterns = [
    path('', backendapires, name="homepage"),
    
    
    
]