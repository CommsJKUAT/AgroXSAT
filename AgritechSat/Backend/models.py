from django.db import models

class SensorData(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Temp: {self.temperature}, Humidity: {self.humidity}, Time: {self.timestamp}"

class Coordinates(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lat: {self.latitude}, Long: {self.longitude}"

class Images(models.Model):
    temperature = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"Temp: {self.temperature}, Time: {self.timestamp}"
    
class GSCoordinates(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    updated_at = models.DateTimeField(auto_now=True)
    
    def coordinatesave(self, *args, **kwargs):
        # Before saving a new value, delete the previous value
        GSCoordinates.objects.all().delete()
        # super(GSCoordinates, self).save(*args, **kwargs)
        
    def __str__(self):
        return f"Lat: {self.latitude}, Long: {self.longitude}"    
    