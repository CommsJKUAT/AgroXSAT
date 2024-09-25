from django.contrib.auth.models import User

from django.db import models

#class CustomUser(AbstractUser):
#    phone_number = models.CharField(max_length=15, blank=True, null=True)
#    employee_id = models.CharField(max_length=15, blank=True, null=True)
#
#    def __str__(self):
#        return self.username


class SensorData(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Temp: {self.temperature}, Humidity: {self.humidity}, Time: {self.timestamp}"
