from django.shortcuts import render, redirect
from django.http import HttpResponse,JsonResponse


def homepage(request):
    return HttpResponse("Agrosat Backend!")
