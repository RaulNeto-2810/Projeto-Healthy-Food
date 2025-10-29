# backend/core/serializers.py

from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import ProducerProfile, Product, Order, OrderItem 

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
    categories = serializers.SerializerMethodField()
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = ProducerProfile
        # Selecionamos os campos que queremos expor na API
        fields = ['id', 'name', 'cpf_cnpj', 'phone', 'city', 'address', 'email', 'user_id', 'categories']
        # CPF/CNPJ e email são read-only (não podem ser alterados)
        read_only_fields = ['id', 'cpf_cnpj', 'user_id', 'email']

    def get_categories(self, obj):
        """Retorna lista de categorias únicas dos produtos deste produtor"""
        products = Product.objects.filter(owner=obj.user)
        categories = products.values_list('category', flat=True).distinct()
        return list(categories)

    def validate_name(self, value):
        """Valida que o nome não seja vazio."""
        if not value or value.strip() == '':
            raise serializers.ValidationError("O nome não pode ser vazio.")
        return value.strip()

    def validate_phone(self, value):
        """Valida o formato do telefone."""
        if value and len(value.strip()) < 10:
            raise serializers.ValidationError("Telefone inválido. Digite um número válido.")
        return value.strip() if value else value

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'unit_price', 'subtotal']
        read_only_fields = ['id']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    producer_name = serializers.CharField(source='producer.producer_profile.name', read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'producer', 'producer_name', 'client_name', 'client_phone', 'client_email',
                  'status', 'total_price', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        return order

class OrderStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']

    def validate_status(self, value):
        if value not in ['Pendente', 'Aceito', 'Cancelado', 'Entregue']:
            raise serializers.ValidationError("Status inválido.")
        return value