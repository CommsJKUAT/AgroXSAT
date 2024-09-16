# admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    # Add fields you want to display in the admin list view
    list_display = ('username', 'email', 'phone_number', 'employee_id', 'is_staff', 'is_active')
    
    fieldsets = UserAdmin.fieldsets + (
        (None, {'fields': ('phone_number', 'employee_id')}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {'fields': ('phone_number', 'employee_id')}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
