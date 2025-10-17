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
    
# --- ADICIONE O MODELO ABAIXO ---
class Product(models.Model):
    # Relacionamento que liga o produto ao usuário (produtor) que o criou.
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='products')
    
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=[('Ativo', 'Ativo'), ('Inativo', 'Inativo')], default='Ativo')
    stock = models.PositiveIntegerField(default=0)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name