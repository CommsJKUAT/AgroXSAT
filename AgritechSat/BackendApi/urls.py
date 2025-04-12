from django.urls import path
from .views import get_location,get_gs,SaTracker,CommandView,PayloadHandling,save_gs_coordinates,imagesapi,groundstationCoordinates,TelemetryHandling
from BackendApi.views import GoogleLoginView


urlpatterns = [
    path('', get_gs, name="Ground"), #get
    path('satLocation/', get_location, name="satTracker"), #get
    path('sat/', SaTracker.as_view(), name="satTracker"), #post
    path('images/', imagesapi.as_view(), name="images"),
    path('baseStation/', groundstationCoordinates.as_view(), name="station"),  
    path('setGS/' , save_gs_coordinates.as_view(),name="basestation setting"),
    path('command/',CommandView.as_view()),
    path('payload/',PayloadHandling.as_view()),
    path('telemetry/',TelemetryHandling.as_view()),
    path('auth/google/', GoogleLoginView.as_view(), name='google_login'),

]