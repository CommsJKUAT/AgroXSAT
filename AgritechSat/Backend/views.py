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

def sensor_data_view(request):
    sensor_data = SensorData.objects.all()  # Fetch all records from the database
    return render(request, 'sensor_data.html', {'sensor_data': sensor_data})