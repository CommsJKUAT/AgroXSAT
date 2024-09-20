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
    json_content = request.content_type
    print(json_content)
    