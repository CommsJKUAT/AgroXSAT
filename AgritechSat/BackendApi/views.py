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
    print(json_content.get('_content'))
    return json_content