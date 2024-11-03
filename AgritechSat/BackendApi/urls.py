from django.urls import path
from .views import homepage,get_gs,save_gs_coordinates,temperatureapi,soilprecipitation,soilphapi,smokeapi,batteryapi,humidityapi,locationapi,imagesapi,groundstationCoordinates,get_gs


urlpatterns = [
    path('', get_gs, name="homepage"),
    path('location/', locationapi.as_view(), name="location"),
    path('images/', imagesapi.as_view(), name="images"),
    path('baseStation/', groundstationCoordinates.as_view(), name="station"),  # this is for the esp 32 module
    path('temperature/', temperatureapi.as_view(), name="temperature"),  
    path('humidity/', humidityapi.as_view(), name="humidity"), 
    path('soilph/', soilphapi.as_view(), name="soilph"), 
    path('soilprec/', soilprecipitation.as_view(), name="soilprec"), 
    path('batt/', batteryapi.as_view(), name="batt"), 
    path('setGS/' , save_gs_coordinates,name="basestation setting"),
    path('smoke/', smokeapi.as_view(), name="smoke"), 
    
]