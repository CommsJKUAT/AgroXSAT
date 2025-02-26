from django.db import models

class Coordinates(models.Model):
    longitude =models.FloatField()
    latitude=models.FloatField()
    timestamp = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Lat: {self.latitude}, Long: {self.longitude}"

class Images(models.Model):
    image = models.TextField()
    
    timestamp = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return f"Temp: {self.image}, Time: {self.timestamp}"
    
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

class Payload(models.Model):
    soil_moisture = models.FloatField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    smoke_level = models.FloatField()
    soil_ph = models.FloatField()
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
       return (
        f"smoisture: {self.soil_moisture}, temp: {self.temperature}, "
        f"hum: {self.humidity}, slvl: {self.smoke_level}, sph: {self.soil_ph}"
        )

    
class Telemetry(models.Model):
    sat_temp =models.FloatField()
    batt =models.FloatField()
    pressure =models.FloatField()
    yaw =models.FloatField()
    pitch =models.FloatField()
    roll =models.FloatField()
    altitude=models.FloatField()
    humidity=models.FloatField()
    eps_temp =models.FloatField()
    voltage1 =models.FloatField()
    voltage2 =models.FloatField()
    current1 =models.FloatField()
    current2 =models.FloatField()
    
    created_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return (
            f"stemp: {self.sat_temp}, batt: {self.batt},alt: {self.altitude}, prss: {self.pressure}, "
            f"yaw: {self.yaw},hum: {self.humidity}, pitch: {self.pitch}, roll: {self.roll}, "
            f"etemp: {self.eps_temp}, vol1: {self.voltage1},, vol2: {self.voltage2}, cur1: {self.current1}, cur2: {self.current2}"
            )
