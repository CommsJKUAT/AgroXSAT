# backend/serializers.py
from rest_framework import serializers
from .models import SensorData
from django.contrib.auth.models import User

class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = ['temperature', 'humidity', 'timestamp']