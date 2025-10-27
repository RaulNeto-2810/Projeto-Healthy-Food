# backend/core/views.py

from django.shortcuts import render
from dj_rest_auth.registration.views import RegisterView # Importe
from .serializers import ProducerRegisterSerializer      # Importe

# --- ADICIONE ESTES IMPORTS ---
from rest_framework import viewsets, permissions, generics
from .models import Product, ProducerProfile
from .serializers import ProductSerializer, ProducerProfileSerializer

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
    
class ProducerListView(generics.ListAPIView):
    """
    View para listar todos os perfis de produtores cadastrados.
    Acessível por qualquer usuário (com ou sem autenticação).
    """
    queryset = ProducerProfile.objects.all().order_by('name') # Busca todos os perfis
    serializer_class = ProducerProfileSerializer
    permission_classes = [permissions.AllowAny] # Permite acesso sem autenticação

class ProducerDetailView(generics.RetrieveAPIView):
    """
    View para obter detalhes de um produtor específico.
    Acessível por qualquer usuário (com ou sem autenticação).
    """
    queryset = ProducerProfile.objects.all()
    serializer_class = ProducerProfileSerializer
    permission_classes = [permissions.AllowAny]

class ProducerProductsView(generics.ListAPIView):
    """
    View para listar produtos de um produtor específico.
    Acessível por qualquer usuário (com ou sem autenticação).
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        producer_id = self.kwargs.get('pk')
        # Busca o perfil do produtor
        try:
            producer_profile = ProducerProfile.objects.get(pk=producer_id)
            # Retorna os produtos do usuário associado ao produtor
            return Product.objects.filter(owner=producer_profile.user).order_by('-created_at')
        except ProducerProfile.DoesNotExist:
            return Product.objects.none()