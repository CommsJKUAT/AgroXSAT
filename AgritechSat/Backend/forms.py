# forms.py
from django import forms



class CoordinateForm(forms.Form):
    latitude = forms.FloatField(label='Latitude of Location 1')
    longitude = forms.FloatField(label='Longitude of Location 1')
       