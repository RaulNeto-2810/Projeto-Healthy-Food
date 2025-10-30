# backend/core/models.py

from django.db import models
from django.contrib.auth.models import User

# Crie este novo modelo
class ProducerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='producer_profile')
    name = models.CharField(max_length=255)
    cpf_cnpj = models.CharField(max_length=18, unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    address = models.CharField(max_length=500, blank=True, null=True)

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

class Order(models.Model):
    STATUS_CHOICES = [
        ('Pendente', 'Pendente'),
        ('Aceito', 'Aceito'),
        ('Cancelado', 'Cancelado'),
        ('Entregue', 'Entregue'),
    ]

    # Produtor que receberá o pedido
    producer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_orders')
    # Nome e informações do cliente (não autenticado)
    client_name = models.CharField(max_length=255)
    client_phone = models.CharField(max_length=20)
    client_email = models.EmailField(blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pendente')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Pedido #{self.id} - {self.client_name}"

    class Meta:
        ordering = ['-created_at']

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=255)  # Salva o nome para histórico
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.product_name}"

class Rating(models.Model):
    """
    Modelo para armazenar avaliações de produtores.
    Apenas clientes que receberam pedidos podem avaliar.
    """
    producer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ratings_received')
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='rating')
    client_name = models.CharField(max_length=255)
    client_phone = models.CharField(max_length=20)
    score = models.PositiveIntegerField()  # 1 a 5
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        # Garante que cada pedido só pode ter uma avaliação
        unique_together = ['order']

    def __str__(self):
        return f"Avaliação {self.score}/5 - {self.producer.producer_profile.name}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if self.score < 1 or self.score > 5:
            raise ValidationError('A avaliação deve ser entre 1 e 5.')
        if self.order.status != 'Entregue':
            raise ValidationError('Só é possível avaliar pedidos entregues.')