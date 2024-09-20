from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
import json



def homepage(request):
    return HttpResponse("Agrosat Backend Apis!")

@api_view(['POST'])
def backendapires(request):
    json_content = request.data
    print(json_content)
    if json_content:
        try:
            # Parse the JSON content
            content = json.loads(json_content)
            temperature = content.get('temperature')
            humidity = content.get('humidity')
            
            # Return the desired content format
            return Response({
                'temperature': temperature,
                'humidity': humidity
            }, status=status.HTTP_200_OK)
        except json.JSONDecodeError:
            return Response({
                'message': 'Invalid JSON format'
            }, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({
            'message': 'No content provided'
        }, status=status.HTTP_400_BAD_REQUEST)