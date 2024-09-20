from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
import json
from django.http import JsonResponse


def homepage(request):
    return HttpResponse("Agrosat Backend Apis!")


def backendapires(request):
    if request.method == "POST":
        try:
            # Parse the JSON data from the request body
            data = json.loads(request.body)
            temperature = data.get('temperature')
            humidity = data.get('humidity')
            
            # Process the data as needed
            return JsonResponse({'temperature': temperature, 'humidity': humidity})
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    return JsonResponse({'error': 'Invalid request method'}, status=405)