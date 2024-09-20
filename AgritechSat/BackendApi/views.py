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
            # Assuming the request is in JSON format, DRF automatically parses it.
            data = dict(request.data)
            data_json = json.dumps(data)
            data_json = data_json.get('_content')  # Access the content from the QueryDict
            data_json = data_json[0].replace("\r\n", "")
            print(data_json)
            data1 = json.loads(data_json)
            print(data1)
            temperature = data.get('temperature')
            humidity = data.get('humidity')

            # Simple validation check
            if temperature is None or humidity is None:
                return Response({"error": "Missing fields"}, status=status.HTTP_400_BAD_REQUEST)

            # Do something with the data (e.g., save to DB or further processing)
            return Response({"message": "Success", "data": data}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)