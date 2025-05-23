from django.shortcuts import render, redirect
from django.http import HttpResponse,JsonResponse
from django.contrib.auth import login, authenticate
from django.shortcuts import render, redirect
import json
from django.shortcuts import render
from .models import Images
from .forms import CoordinateForm
from geopy.distance import geodesic
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
import re
import dns.resolver  



def is_valid_email(email):
    
    
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return False
    
    
    domain = email.split('@')[1]
    
    try:
        
        dns.resolver.resolve(domain, 'MX')
        return True
    except (dns.resolver.NXDOMAIN, dns.resolver.NoAnswer, dns.resolver.NoNameservers):
        return False

def image_data_view(request):
    image_data = Images.objects.all()  
    return render(request, 'image_data.html', {'image_data': image_data})

def calculate_distance(request):
    distance = None
    if request.method == 'POST':
        form = CoordinateForm(request.POST)
        if form.is_valid():
            lat1 = form.cleaned_data['latitude']
            lon1 = form.cleaned_data['longitude']
            lat2 =-1.1017657065964066
            lon2 = 37.016449722103474
            
            coords_1 = (lat1, lon1)
            coords_2 = (lat2, lon2)
            distance = geodesic(coords_1, coords_2).kilometers
    else:
        form = CoordinateForm()

    return render(request, 'calculate_distance.html', {'form': form, 'distance': distance})

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    
    try:
        data = request.data
        username = data['username']
        email = data['email']
        password = data['password']
        print(data)
        
        # Enhanced email validation
        if not is_valid_email(email):
            return Response({
                "detail": "Invalid email. Please provide a valid email address with an existing domain."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({"detail": "User already exists. Log in"}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({"detail": "User with this email already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
        )
        user.save()
        return Response({"detail": "User created successfully!"}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    try:
        if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                
        else:
            # Convert QueryDict to a dictionary
            data = dict(request.data)
            print("QueryDict Data:", data)
            
            # Extract JSON content from '_content' key
            data_json = data.get('_content', '')  # Assuming '_content' exists in QueryDict
            print(data_json)
            data_json = data_json[0].replace("\r\n", "")  # Clean up new lines if any
            data = json.loads(data_json)  # Convert JSON string to a Python dictionary
        username = data.get('username')
        password = data.get('password')
        
        # Authenticate user
        user = authenticate(username=username, password=password)
        
        if user is not None:
            # Generate refresh and access tokens
            refresh = RefreshToken.for_user(user)
            access = refresh.access_token

            return Response({
                'refresh': str(refresh),
                'access': str(access),
                'user': {
                    'username': user.username,
                    'email': user.email,
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    
    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

