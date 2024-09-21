from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
import json
from rest_framework.views import APIView




def homepage(request):
    return HttpResponse("Agrosat Backend Apis!")


class backendapires(APIView):
    def post(self, request, *args, **kwargs):
        try:
            # Check if request.data is a dictionary (it will be if the content is JSON)
            if isinstance(request.data, dict):
                data = request.data
            else:
                # If not, it's likely a QueryDict (e.g., form-encoded data)
                # Convert QueryDict to a regular dictionary
                data = dict(request.data)
                print(data)
                # Get the JSON content if needed
                data_json = data.get('_content', '')  # Assuming '_content' exists
                data_json = data_json.replace("\r\n", "")  # Clean up new lines if any
                data = json.loads(data_json)  # Convert JSON string to dict

            # Extract temperature and humidity
            temperature = data.get('temperature')
            humidity = data.get('humidity')

            # Simple validation check
            if temperature is None or humidity is None:
                return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

            # Do something with the data (e.g., save to DB or further processing)
            return Response({"message": "Success", "data": data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)