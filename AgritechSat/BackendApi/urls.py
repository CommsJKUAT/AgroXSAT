from django.urls import path
from .views import get_location,get_gs,CommandView,save_gs_coordinates,imagesapi,groundstationCoordinates,get_gs


urlpatterns = [
    path('', get_gs, name="homepage"),
    path('satLocation/', get_location, name="satTracker"),
    path('images/', imagesapi.as_view(), name="images"),
    path('baseStation/', groundstationCoordinates.as_view(), name="station"),  
    path('setGS/' , save_gs_coordinates.as_view(),name="basestation setting"),
    path('command/',CommandView.as_view())
]