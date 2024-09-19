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
    serializer = UserSerializer(data=request.data)
    content = request.data
    content = content.replace('\r\n', '').rstrip(',')
    data = json.loads(content)

    print(data)
    if serializer.is_valid():
        # Process data (e.g., save to database)
        return Response({
            'message': 'Data received successfully!',
            'data': serializer.validated_data
        }, status=status.HTTP_201_CREATED)
    else:
        return Response({
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)