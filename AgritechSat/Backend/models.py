from django.db import models

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

class batt(models.Model):
    batt = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"batt: {self.batt}, Time: {self.timestamp}"

class humidity(models.Model):
    humidity = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"batt: {self.batt}, Time: {self.timestamp}"
    
class temperature(models.Model):
    temperature = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"batt: {self.batt}, Time: {self.timestamp}"
class smoke(models.Model):
    smoke = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"batt: {self.batt}, Time: {self.timestamp}"
class soilph(models.Model):
    soilph = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"batt: {self.batt}, Time: {self.timestamp}"
class soilprecipitation(models.Model):
    soilprecipitation = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"batt: {self.batt}, Time: {self.timestamp}"
