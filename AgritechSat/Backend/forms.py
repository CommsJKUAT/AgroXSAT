# forms.py
from django.contrib.auth.forms import UserChangeForm,UserCreationForm
#from .models import CustomUser
from django import forms

#class CustomUserChangeForm(UserChangeForm):
#    class Meta:
#        model = CustomUser
#        fields = ('username', 'first_name', 'last_name', 'email', 'phone_number', 'employee_id', 'is_active', 'is_staff')
#
#class CustomUserCreationForm(UserCreationForm):
#    class Meta:
#        model = CustomUser
#        fields = ('username', 'first_name', 'last_name', 'email', 'phone_number', 'employee_id', 'password1', 'password2')

class CoordinateForm(forms.Form):
    latitude = forms.FloatField(label='Latitude of Location 1')
    longitude = forms.FloatField(label='Longitude of Location 1')
       