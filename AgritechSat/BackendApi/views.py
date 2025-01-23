from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
import json
from rest_framework.views import APIView
from Backend.models import Telemetry,Payload,GSCoordinates,Images,Coordinates
from Backend.models import GSCoordinates,Images
from django.views.decorators.csrf import csrf_exempt 
from geopy.geocoders import Nominatim
from dotenv import load_dotenv
import os
from geopy.geocoders import MapBox
import requests
from django.utils import timezone
from django.core.exceptions import ValidationError
load_dotenv()

def homepage(request):
    return HttpResponse("Agrosat Backend Apis!")

@permission_classes([AllowAny])
class imagesapi(APIView):
    def post(self, request, *args, **kwargs):
        try:
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                print("Parsed as JSON:", data)
            else:
                data = dict(request.data)
                data_json = data.get('_content', '') 
                data_json = data_json[0].replace("\r\n", "")  
                data = json.loads(data_json) 
            image= data.get('image')
            image_name = image.split('/')[0]
            image = image.split('/', 1) 
            image=image[1]
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
                features = location_data.get("features", [])
                if features:
                    place_formatted = features[0].get("properties", {}).get("place_formatted", "Unknown")
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
    
#tracks the satellite by giving the latest coordinates in the db
def get_location(request):
    coords = Coordinates.objects.all()  
    
    
    if coords.exists():
        coordinates_list = [
            {'latitude': coord.latitude, 'longitude': coord.longitude} for coord in coords
        ]
        return JsonResponse({'coordinates': coordinates_list})
    
    
    return JsonResponse({'coordinates': []})
        
@permission_classes([AllowAny])
class save_gs_coordinates(APIView):
    def post(self, request, *args, **kwargs):
        try:
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
                print("Parsed as JSON:", data)
            else:
                data = dict(request.data)
                data_json = data.get('_content', '')  
                data_json = data_json[0].replace("\r\n", "")  # Clean up new lines if any
                data = json.loads(data_json)  # Convert JSON string to a Python dictionary
            latitude = data.get('latitude')
            longitude = data.get('longitude')
            print(latitude)
            print(longitude)
            if latitude is None or longitude is None:
                return Response({"error": "Missing latitude or longitude"}, status=status.HTTP_400_BAD_REQUEST)
            coords, created = GSCoordinates.objects.update_or_create(
                id=1,  
                defaults={
                    'latitude': float(latitude),
                    'longitude': float(longitude),
                }
            )

            if created:
                return Response({"success": "GS set successfully"}, status=status.HTTP_201_CREATED)
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
    
#telemetry
@permission_classes([AllowAny])  
class TelemetryHandling(APIView):

    def post(self, request, *args, **kwargs):
        try:
            data = self.parse_request_data(request)
            if data is None:
                return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)

            # Extract fields from the request data
            required_fields = {
                'sat_temp': data.get('T'),
                'batt': data.get('BT'),
                'pressure': data.get('P'),
                'yaw': data.get('Z'),
                'humidity': data.get('H'),
                'pitch': data.get('X'),
                'roll': data.get('Y'),
                'altitude': data.get('A'),
                'eps_temp': data.get('M'),
                'voltage1': data.get('B1'),
                'voltage2': data.get('B2'),
                'current1': data.get('C1'),
                'current2': data.get('C2')
                
            }

            # Identify missing fields
            missing_fields = [key for key, value in required_fields.items() if value is None]

            if missing_fields:
                return Response(
                    {"error": "Missing required fields", "missing_fields": missing_fields},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create telemetry object
            telemetry = Telemetry.objects.create(
                sat_temp=required_fields['sat_temp'],
                batt=required_fields['batt'],
                pressure=required_fields['pressure'],
                yaw=required_fields['yaw'],
                altitude=required_fields['altitude'],
                humidity=required_fields['humidity'],
                pitch=required_fields['pitch'],
                roll=required_fields['roll'],
                eps_temp=required_fields['eps_temp'],
                voltage1=required_fields['voltage1'],
                voltage2=required_fields['voltage2'],
                current1=required_fields['current1'],
                current2=required_fields['current2']
                
            )

            return Response(
                {
                    "message": "Telemetry saved successfully",
                    "telemetry_id": telemetry.id,
                    "sat_temp": telemetry.sat_temp,
                    "batt": telemetry.batt,
                    "pressure": telemetry.pressure,
                    "yaw": telemetry.yaw,
                    "pitch": telemetry.pitch,
                    "roll": telemetry.roll,
                    "eps_temp": telemetry.eps_temp,
                    "voltage1": telemetry.voltage1,
                    "voltage2": telemetry.voltage2,
                    "current1": telemetry.current1,
                    "current2": telemetry.current2,
                    
                },
                status=status.HTTP_201_CREATED,
            )

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, *args, **kwargs):
        try:
            # Retrieve the latest telemetry data
            latest_telemetry = Telemetry.objects.latest('created_at')  # Assuming `created_at` is the field storing the timestamp
            
            return Response(
                {
                    "message": "Latest telemetry retrieved successfully",
                    "telemetry_id": latest_telemetry.id,
                    "sat_temp": latest_telemetry.sat_temp,
                    "batt": latest_telemetry.batt,
                    "pressure": latest_telemetry.pressure,
                    "yaw": latest_telemetry.yaw,
                    "pitch": latest_telemetry.pitch,
                    "roll": latest_telemetry.roll,
                    "eps_temp": latest_telemetry.eps_temp,
                    "voltage": latest_telemetry.voltage,
                    "current": latest_telemetry.current,
                    "created_at": latest_telemetry.created_at 
                },
                status=status.HTTP_200_OK,
            )
        except Telemetry.DoesNotExist:
            return Response({"error": "No telemetry data found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def parse_request_data(self, request):
        if isinstance(request.data, dict) and '_content' not in request.data:
            return request.data
        try:
            data = dict(request.data)
            data_json = data.get('_content', '')
            if isinstance(data_json, list):
                data_json = data_json[0].replace("\r\n", "")
            return json.loads(data_json)
        except (KeyError, json.JSONDecodeError):
            return None
        


@permission_classes([AllowAny])
class PayloadHandling(APIView):
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
          
            
            soil_moisture = data.get('SM')
            temperature = data.get('T')
            humidity = data.get('H')
            smoke_level = data.get('SL')
            soil_ph = data.get('SP')

            if None in [soil_moisture, temperature, humidity, smoke_level, soil_ph]:
                return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

            payload = Payload.objects.create(
                soil_moisture=soil_moisture,
                temperature=temperature,
                humidity=humidity,
                smoke_level=smoke_level,
                soil_ph=soil_ph
            )

            return Response(
                {
                    "message": "Payload saved successfully",
                    "payload_id": payload.id,
                    "soil_moisture": payload.soil_moisture,
                    "temperature": payload.temperature,
                    "humidity": payload.humidity,
                    "smoke_level": payload.smoke_level,
                    "soil_ph": payload.soil_ph,
                },
                status=status.HTTP_201_CREATED,
            )

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request, *args, **kwargs):
        try:
            
            payloads = Payload.objects.all()

            payload_data = [
                {
                    "payload_id": payload.id,
                    "soil_moisture": payload.soil_moisture,
                    "temperature": payload.temperature,
                    "humidity": payload.humidity,
                    "smoke_level": payload.smoke_level,
                    "soil_ph": payload.soil_ph,
                    "created_at": payload.created_at.isoformat() if hasattr(payload, 'created_at') else None,
                }
                for payload in payloads
            ]

            return Response(payload_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # Simple validation check
            if image is None:
                return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)
           
            return Response({"message": "Success", "data": data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        
#satellite location
@permission_classes([AllowAny])
class SaTracker(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Parse incoming data
            if isinstance(request.data, dict) and '_content' not in request.data:
                data = request.data
            else:
                data = dict(request.data)
                data_json = data.get('_content', '')
                if isinstance(data_json, list):
                    data_json = data_json[0].replace("\r\n", "")
                data = json.loads(data_json)
            print(data)
            # Extract latitude and longitude from data
            latitude = data.get('La')
            longitude = data.get('L')

            # Validate presence of coordinates
            if latitude is None or longitude is None:
                return Response({"error": "Missing latitude or longitude"}, status=status.HTTP_400_BAD_REQUEST)

            # Save coordinates
            try:
                coordinates = Coordinates.objects.create(
                    latitude=float(latitude),
                    longitude=float(longitude)
                )
                return Response(
                    {
                        "success": "Coordinates saved successfully",
                        "latitude": coordinates.latitude,
                        "longitude": coordinates.longitude,
                    },
                    status=status.HTTP_201_CREATED,
                )
            except ValidationError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)