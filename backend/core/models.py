# backend/core/models.py

from django.db import models
from django.contrib.auth.models import User

# Crie este novo modelo
class ProducerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='producer_profile')
    name = models.CharField(max_length=255)
    cpf_cnpj = models.CharField(max_length=18, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return self.name