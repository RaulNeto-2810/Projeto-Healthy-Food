# backend/core/views.py

from django.shortcuts import render
from dj_rest_auth.registration.views import RegisterView # Importe
from .serializers import ProducerRegisterSerializer      # Importe

# --- ADICIONE ESTES IMPORTS ---
from rest_framework import viewsets, permissions
from .models import Product
from .serializers import ProductSerializer

def index(request):
    return render(request, 'index.html')

# Adicione esta nova classe
class ProducerRegisterView(RegisterView):
    serializer_class = ProducerRegisterSerializer
    
# --- ADICIONE A VIEWSET ABAIXO ---
class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    # Garante que apenas usuários logados possam acessar esta API.
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        REGRA DE NEGÓCIO: Esta função garante que o usuário logado
        só possa ver e interagir com os seus próprios produtos.
        """
        return Product.objects.filter(owner=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        """
        Ao criar um novo produto, define automaticamente o 'owner'
        como o usuário que está fazendo a requisição.
        """
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        """
        Garante que o owner não pode ser alterado durante uma atualização.
        """
        serializer.save(owner=self.request.user)

    def get_object(self):
        """
        Sobrescreve o método para garantir que o usuário só possa
        acessar/editar/deletar seus próprios produtos.
        Retorna 404 se tentar acessar produto de outro produtor.
        """
        obj = super().get_object()
        # Dupla verificação de segurança
        if obj.owner != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Você não tem permissão para acessar este produto.")
        return obj