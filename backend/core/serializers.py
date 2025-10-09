# backend/core/serializers.py

from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from .models import ProducerProfile

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