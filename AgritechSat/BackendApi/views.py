from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer
import json
from django.http import QueryDict


def homepage(request):
    return HttpResponse("Agrosat Backend Apis!")

@api_view(['POST'])
def backendapires(request):
    serializer = UserSerializer(data=request.data)
    query_dict = request.data

    json_string = query_dict.get('_content', [None])[0]

    if json_string:
    # Clean up the JSON string
        cleaned_json_string = json_string.strip()
    
    # Create a new QueryDict with the cleaned JSON string
        cleaned_query_dict = QueryDict(
            dict(_content_type=query_dict['_content_type'], _content=[cleaned_json_string])
        )
    
        print(cleaned_query_dict)
    else:
        print("No JSON content found in QueryDict.")

    print(query_dict)
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