from django.urls import path
from .views import homepage,backendapires,locationapi,imagesapi


urlpatterns = [
    path('', backendapires.as_view(), name="homepage"),
    path('location/', locationapi.as_view(), name="location"),
    path('images/', imagesapi.as_view(), name="images"),
    
    
]