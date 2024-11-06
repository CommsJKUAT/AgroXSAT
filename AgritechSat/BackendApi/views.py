from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
import json
from rest_framework.views import APIView
from Backend.models import smoke,batt,temperature,soilph,soilprecipitation,location
from Backend.models import GSCoordinates,Images
from django.views.decorators.csrf import csrf_exempt 
from geopy.geocoders import Nominatim
from dotenv import load_dotenv
import os
from geopy.geocoders import MapBox
import requests
load_dotenv()

def homepage(request):
    return HttpResponse("Agrosat Backend Apis!")

@permission_classes([AllowAny])
class imagesapi(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Check if request.data is a dictionary (it will be if the content is JSON)
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                print("Parsed as JSON:", data)
            else:
                # Convert QueryDict to a dictionary
                data = dict(request.data)
                print("QueryDict Data:", data)
                
                # Extract JSON content from '_content' key
                data_json = data.get('_content', '')  # Assuming '_content' exists in QueryDict
                print(data_json)
                data_json = data_json[0].replace("\r\n", "")  # Clean up new lines if any
                data = json.loads(data_json)  # Convert JSON string to a Python dictionary
                print("Extracted Data:", data)

            # Extract image
            image= data.get('image')
            image_name = image.split('/')[0]
            image = image.split('/', 1) 
            image=image[1]
            # Simple validation check
            if image is None:
                return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)
            
            image_data = Images(
                image=image,
                image_name=image_name   
            )
            image_data.save()
           
            return Response({"message": "Success", "data": image}, status=status.HTTP_200_OK)
      
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@permission_classes([AllowAny])
class temperatureapi(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Check if request.data is a dictionary (it will be if the content is JSON)
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                print("Parsed as JSON:", data)
            else:
                # Convert QueryDict to a dictionary
                data = dict(request.data)
                print("QueryDict Data:", data)
                
                # Extract JSON content from '_content' key
                data_json = data.get('_content', '')  # Assuming '_content' exists in QueryDict
                print(data_json)
                data_json = data_json[0].replace("\r\n", "")  # Clean up new lines if any
                data = json.loads(data_json)  # Convert JSON string to a Python dictionary
                print("Extracted Data:", data)

            # Extract temperature and humidity
            temperature_value= data.get('temperature')
            print(temperature)

            # Simple validation check
            if temperature_value is None:
                return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)
            
            temperature_data = temperature(
                temperature=temperature_value
                
                
            )
            temperature_data.save()
           
            return Response({"message": "Success", "data": data}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@permission_classes([AllowAny])
class humidityapi(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Check if request.data is a dictionary (it will be if the content is JSON)
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                print("Parsed as JSON:", data)
            else:
                # Convert QueryDict to a dictionary
                data = dict(request.data)
                print("QueryDict Data:", data)
                
                # Extract JSON content from '_content' key
                data_json = data.get('_content', '')  # Assuming '_content' exists in QueryDict
                print(data_json)
                data_json = data_json[0].replace("\r\n", "")  # Clean up new lines if any
                data = json.loads(data_json)  # Convert JSON string to a Python dictionary
                print("Extracted Data:", data)

            # Extract temperature and humidity
            humidity= data.get('humidity')
            print(humidity)

            # Simple validation check
            if humidity is None:
                return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)
            
            humidity_data = humidity(
                humidity=humidity
                
                
            )
            humidity_data.save()
           
            return Response({"message": "Success", "data": data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@permission_classes([AllowAny])
class batteryapi(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Check if request.data is a dictionary (it will be if the content is JSON)
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                
            else:
                data = dict(request.data)
                data_json = data.get('_content', '')  # Assuming '_content' exists in QueryDict
                data_json = data_json[0].replace("\r\n", "")  # Clean up new lines if any
                data = json.loads(data_json)  # Convert JSON string to a Python dictionary
        
            batt_value= data.get('batt')
            

            # Simple validation check
            if batt_value is None:
                return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)
            
            batt_data = batt(
                batt=batt_value               
                
            )
            batt_data.save()
           
            return Response({"message": "Success", "data": data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@permission_classes([AllowAny])
class smokeapi(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Check if request.data is a dictionary (it will be if the content is JSON)
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                
            else:
                # Convert QueryDict to a dictionary
                data = dict(request.data)
                
                data_json = data.get('_content', '')  
                
                data_json = data_json[0].replace("\r\n", "") 
                data = json.loads(data_json) 
                

            # Extract temperature and humidity
            smoke_value= data.get('smoke')
            

            # Simple validation check
            if smoke is None:
                return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)
            
            smoke_data = smoke(
                smoke=smoke_value
                
                
            )
            smoke_data.save()
           
            return Response({"message": "Success", "data": data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([AllowAny])
class soilphapi(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Check if request.data is a dictionary (it will be if the content is JSON)
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                print("Parsed as JSON:", data)
            else:
                data = dict(request.data)
                data_json = data.get('_content', '')  
                data_json = data_json[0].replace("\r\n", "")  
                data = json.loads(data_json)  
            soilph_value= data.get('soilph')
            if soilph_value is None:
                return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)
            
            soilph_data = soilph(
                soilph=soilph_value              
                
            )
            soilph_data.save()
           
            return Response({"message": "Success", "data": data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([AllowAny])
class locationapi(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Check if request.data is a dictionary (it will be if the content is JSON)
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                print("Parsed as JSON:", data)
            else:
                # Convert QueryDict to a dictionary
                data = dict(request.data)
                print("QueryDict Data:", data)
                
                # Extract JSON content from '_content' key
                data_json = data.get('_content', '')  # Assuming '_content' exists in QueryDict
                print(data_json)
                data_json = data_json[0].replace("\r\n", "")  # Clean up new lines if any
                data = json.loads(data_json)  # Convert JSON string to a Python dictionary
                print("Extracted Data:", data)
            
            #change this to suit the data on esp
            # Extract location data
            location_value = data.get('location')
            

            # Simple validation check
            if location_value is None:
                return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

           
            location_data = location(
                location=location_value
                
            )
            location_data.save() 
            return Response({"message": "Success", "data": data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@permission_classes([AllowAny])
class soilprecipitation(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Check if request.data is a dictionary (it will be if the content is JSON)
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                print("Parsed as JSON:", data)
            else:
                # Convert QueryDict to a dictionary
                data = dict(request.data)
                print("QueryDict Data:", data)
                
                # Extract JSON content from '_content' key
                data_json = data.get('_content', '')  # Assuming '_content' exists in QueryDict
                print(data_json)
                data_json = data_json[0].replace("\r\n", "")  # Clean up new lines if any
                data = json.loads(data_json)  # Convert JSON string to a Python dictionary
                print("Extracted Data:", data)
            
            #change this to suit the data on esp
            # Extract location data
            soilprecipitation = data.get('soilprecipitation')
            

            # Simple validation check
            if soilprecipitation is None:
                return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

            
            soilprecipitation_data = soilprecipitation(
                soilprecipitation=soilprecipitation
            )
            soilprecipitation_data.save() 
            return Response({"message": "Success", "data": data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})

MAPBOX_ACCESS_TOKEN = os.environ.get('MAPBOX')

@permission_classes([AllowAny])
class groundstationCoordinates(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            if '_content' in data:
                data = json.loads(data['_content'])
            latitude = data.get('latitude')
            longitude = data.get('longitude')
            if latitude is None or longitude is None:
                return Response({"error": "Missing latitude or longitude"}, status=status.HTTP_400_BAD_REQUEST)
            latitude = float(latitude)
            longitude = float(longitude)

            
            
            mapbox_url = f"https://api.mapbox.com/search/geocode/v6/reverse?longitude={longitude}&latitude={latitude}&access_token={MAPBOX_ACCESS_TOKEN}"
            response = requests.get(mapbox_url)

            if response.status_code == 200:
                location_data = response.json()

                # Extract place_formatted from the response if available
                features = location_data.get("features", [])
                if features:
                    place_formatted = features[0].get("properties", {}).get("place_formatted", "Unknown")

                    # Split place_formatted into place and country
                    place_parts = place_formatted.split(", ")
                    if len(place_parts) >= 2:
                        place = ", ".join(place_parts[:-1])  # Join all except last as place
                        country = place_parts[-1]  # Last part as country
                    else:
                        place = place_formatted
                        country = "Unknown"

                    return Response({
                        "status": "success",
                        "location": {
                            "place": place,
                            "country": country
                        }
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "Location not found"}, status=status.HTTP_404_NOT_FOUND)
            else:
                return Response({"error": "Mapbox API error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except ValueError:
            return Response({'status': 'error', 'message': "Invalid latitude or longitude values"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'status': 'error', 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def get_gs(request):
    coords = GSCoordinates.objects.first()
    if coords:
        return JsonResponse({
            'latitude': coords.latitude,
            'longitude': coords.longitude
        })
    else:
        return JsonResponse({
            'latitude': None,
            'longitude': None
        })
    


@permission_classes([AllowAny])
class save_gs_coordinates(APIView):
    def post(self, request, *args, **kwargs):
        try:
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                print("Parsed as JSON:", data)
            else:
                # Convert QueryDict to a dictionary
                data = dict(request.data)
                print("QueryDict Data:", data)
                
                # Extract JSON content from '_content' key
                data_json = data.get('_content', '')  # Assuming '_content' exists in QueryDict
                print(data_json)
                data_json = data_json[0].replace("\r\n", "")  # Clean up new lines if any
                data = json.loads(data_json)  # Convert JSON string to a Python dictionary
                print("Extracted Data:", data)
            latitude = data.get('latitude')
            longitude = data.get('longitude')
            print(latitude)
            print(longitude)
            if latitude is None or longitude is None:
                return Response({"error": "Missing latitude or longitude"}, status=status.HTTP_400_BAD_REQUEST)
            
                        
            coords, created = GSCoordinates.objects.update_or_create(
                id=1,  # Assuming you want to keep only one record
                defaults={
                    'latitude': float(latitude),
                    'longitude': float(longitude),
                }
            )

            if created:
                return Response({"success": "Coordinates created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"success": "Coordinates updated successfully"}, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "Invalid latitude or longitude format"}, status=status.HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)

@permission_classes([AllowAny])       
class CommandView(APIView):
    command_list = []  

    def post(self, request, *args, **kwargs):        
        command_data = request.data.get('command')        
        if command_data is None:
            return JsonResponse({"error": "Missing command"}, status=status.HTTP_400_BAD_REQUEST)
        
        self.__class__.command_list.append(command_data)        
        print(f"Received command: {command_data}")
        
        return JsonResponse({"success": "Command received"}, status=status.HTTP_200_OK)

    def get(self, request, *args, **kwargs):       
        if not self.__class__.command_list:
            return JsonResponse({"error": "No commands available"}, status=status.HTTP_404_NOT_FOUND)
        
        command_to_return = self.__class__.command_list.pop(0)
        print("Current command list after GET:", self.__class__.command_list)
        return JsonResponse({"command": command_to_return}, status=status.HTTP_200_OK)