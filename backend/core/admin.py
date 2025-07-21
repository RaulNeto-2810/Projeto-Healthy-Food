# backend/core/admin.py
from django.contrib import admin
from .models import Recipe # Importe seu novo modelo

# Registre o modelo aqui
admin.site.register(Recipe)