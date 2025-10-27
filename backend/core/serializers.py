# backend/core/serializers.py

from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import ProducerProfile, Product 

class ProducerRegisterSerializer(RegisterSerializer):
    # Definimos os campos extras que virão do formulário
    name = serializers.CharField(required=True, max_length=255)
    cpf_cnpj = serializers.CharField(required=True, max_length=18)
    phone = serializers.CharField(required=False, allow_blank=True, max_length=20)

    def custom_signup(self, request, user):
        # Esta função é chamada após o usuário padrão ser criado
        # Aqui, criamos o Perfil do Produtor com os dados extras
        ProducerProfile.objects.create(
            user=user,
            name=self.validated_data.get('name', ''),
            cpf_cnpj=self.validated_data.get('cpf_cnpj', ''),
            phone=self.validated_data.get('phone', '')
        )
        
# --- ADICIONE A CLASSE ABAIXO ---
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        # O campo 'owner' não será enviado pelo frontend, ele será definido automaticamente.
        read_only_fields = ('owner', 'created_at', 'updated_at')

    def validate_name(self, value):
        """Valida que o nome do produto não seja vazio."""
        if not value or value.strip() == '':
            raise serializers.ValidationError("O nome do produto não pode ser vazio.")
        return value.strip()

    def validate_price(self, value):
        """Valida que o preço seja positivo."""
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero.")
        return value

    def validate_stock(self, value):
        """Valida que o estoque não seja negativo."""
        if value < 0:
            raise serializers.ValidationError("O estoque não pode ser negativo.")
        return value

    def validate_category(self, value):
        """Valida que a categoria não seja vazia."""
        if not value or value.strip() == '':
            raise serializers.ValidationError("A categoria é obrigatória.")
        return value.strip()
    
class ProducerProfileSerializer(serializers.ModelSerializer):
    # Poderíamos adicionar campos extras aqui no futuro, como imagem ou avaliação média
    class Meta:
        model = ProducerProfile
        # Selecionamos os campos que queremos expor na API
        fields = ['id', 'name', 'user_id'] 
        # Podemos adicionar 'phone' ou outros se necessário para o card