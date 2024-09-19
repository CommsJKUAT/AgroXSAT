from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
from rest_framework.parsers import JSONParser

def homepage(request):
    return HttpResponse("Agrosat Backend Apis!")

def backendapires(request):
    # Check if the request is POST and content-type is application/json
    if request.method == 'POST' and request.content_type == 'application/json':
        try:
            # Parse the JSON data from the request body
            data = JSONParser().parse(request)
        except Exception as e:
            return JsonResponse({'message': 'Error parsing JSON data', 'error': str(e)}, status=400)

        # Now use the parsed data
        serializer = UserSerializer(data=data)

        if serializer.is_valid():
            return JsonResponse({
                'message': 'Data received successfully!',
                'data': serializer.validated_data
            }, status=201)
        else:
            return JsonResponse({
                'message': 'Invalid data',
                'errors': serializer.errors
            }, status=400)
    else:
        return JsonResponse({'message': 'Invalid request method or content type'}, status=400)