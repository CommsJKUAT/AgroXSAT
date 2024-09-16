from django.urls import path
from .views import homepage,register


urlpatterns = [
    path('', homepage, name="homepage"),
    path('register/', register, name="homepage"),
    
    
    
]