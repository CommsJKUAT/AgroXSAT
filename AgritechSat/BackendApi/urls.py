from django.urls import path
from .views import homepage,backendapires,locationapi,imagesapi,groundstationCoordinates,get_gs


urlpatterns = [
    path('', backendapires.as_view(), name="homepage"),
    path('location/', locationapi.as_view(), name="location"),
    path('images/', imagesapi.as_view(), name="images"),
    path('baseStation/', groundstationCoordinates.as_view(), name="station"),  # this is for the esp 32 module
    path('mapgs/', get_gs, name="stationOnMap"),  
    
]