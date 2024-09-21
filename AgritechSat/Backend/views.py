from django.shortcuts import render, redirect
from django.http import HttpResponse,JsonResponse
from django.contrib.auth import login, authenticate
from .forms import CustomUserCreationForm





def register(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('home.html')
    else:
        form = CustomUserCreationForm()
    return render(request, 'register.html', {'form': form})

from django.shortcuts import render
from .models import SensorData
from .forms import CoordinateForm
from geopy.distance import geodesic

def sensor_data_view(request):
    sensor_data = SensorData.objects.all()  # Fetch all records from the database
    return render(request, 'sensor_data.html', {'sensor_data': sensor_data})

def calculate_distance(request):
    distance = None
    if request.method == 'POST':
        form = CoordinateForm(request.POST)
        if form.is_valid():
            lat1 = form.cleaned_data['latitude']
            lon1 = form.cleaned_data['longitude']
            lat2 = -1.193179
            lon2 = 36.759202
            
            coords_1 = (lat1, lon1)
            coords_2 = (lat2, lon2)
            distance = geodesic(coords_1, coords_2).kilometers
    else:
        form = CoordinateForm()

    return render(request, 'calculate_distance.html', {'form': form, 'distance': distance})