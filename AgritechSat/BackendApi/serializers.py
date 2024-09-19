# serializers.py
from rest_framework import serializers

class UserSerializer(serializers.Serializer):
    temperature = serializers.IntegerField()
    humidity = serializers.IntegerField()
