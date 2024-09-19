from django.shortcuts import render, redirect
from django.http import HttpResponse,JsonResponse
from django.contrib.auth import login, authenticate
from .forms import CustomUserCreationForm

def homepage(request):
    return HttpResponse("Agrosat Backend!")



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

