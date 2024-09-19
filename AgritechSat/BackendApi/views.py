from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer


def homepage(request):
    return HttpResponse("Agrosat Backend Apis!")

def backendapires(request):
    if request.method == 'POST':
        print("hello")
    return HttpResponse("Agrosat Backend Apis response!")