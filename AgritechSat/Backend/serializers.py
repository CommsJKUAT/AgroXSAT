# backend/serializers.py
from rest_framework import serializers
from .models import SensorData
from django.contrib.auth.models import User

class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = ['temperature', 'humidity', 'timestamp']

class UserRegistrationSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'password': {'write_only': True}  # Make password write-only
        }

    def validate(self, attrs):
        # Validate that passwords match
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"detail": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove confirm_password from validated data
        user = User(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])  # Hash the password
        user.save()  # Save the user instance
        return user