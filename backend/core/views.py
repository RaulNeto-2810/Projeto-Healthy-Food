# backend/core/views.py

from django.shortcuts import render
from dj_rest_auth.registration.views import RegisterView # Importe
from .serializers import ProducerRegisterSerializer      # Importe

# --- ADICIONE ESTES IMPORTS ---
from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Product, ProducerProfile, Order, OrderItem
from .serializers import ProductSerializer, ProducerProfileSerializer, OrderSerializer, OrderStatusUpdateSerializer

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
    Filtra apenas produtores reais (exclui admins e staff).
    """
    serializer_class = ProducerProfileSerializer
    permission_classes = [permissions.AllowAny] # Permite acesso sem autenticação

    def get_queryset(self):
        """
        Retorna apenas perfis de produtores válidos.
        Exclui usuários staff, superusers e perfis sem dados completos.
        """
        return ProducerProfile.objects.filter(
            user__is_staff=False,
            user__is_superuser=False
        ).order_by('name')

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

class MyProducerProfileView(generics.RetrieveUpdateAPIView):
    """
    View para obter e atualizar o perfil do produtor logado.
    GET /api/my-profile/ - Retorna o perfil do produtor logado
    PATCH /api/my-profile/ - Atualiza o perfil do produtor logado
    """
    serializer_class = ProducerProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Retorna o perfil do produtor associado ao usuário logado.
        Se não existir, retorna 404.
        """
        try:
            return ProducerProfile.objects.get(user=self.request.user)
        except ProducerProfile.DoesNotExist:
            from rest_framework.exceptions import NotFound
            raise NotFound("Perfil de produtor não encontrado para este usuário.")

class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar pedidos.
    - Clientes podem criar pedidos (POST sem autenticação)
    - Produtores podem ver seus pedidos e atualizar status
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]  # Permite criação sem autenticação

    def get_queryset(self):
        """
        Se o usuário estiver autenticado, retorna apenas seus pedidos.
        Se houver um parâmetro client_phone, filtra por telefone do cliente.
        Caso contrário, retorna vazio.
        """
        # Permite buscar pedidos por telefone do cliente (para clientes não autenticados)
        client_phone = self.request.query_params.get('client_phone', None)
        if client_phone:
            return Order.objects.filter(client_phone=client_phone).order_by('-created_at')

        # Para produtores autenticados, mostra apenas seus pedidos
        if self.request.user.is_authenticated:
            return Order.objects.filter(producer=self.request.user).order_by('-created_at')

        return Order.objects.none()

    def get_permissions(self):
        """
        Define permissões por ação:
        - create: Qualquer pessoa (AllowAny)
        - list: Qualquer pessoa (se tiver client_phone) ou autenticado
        - retrieve, update, partial_update: Apenas autenticados
        """
        if self.action in ['create', 'list']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def update_status(self, request, pk=None):
        """
        Endpoint para atualizar apenas o status do pedido.
        PATCH /api/orders/{id}/update_status/
        """
        order = self.get_object()

        # Verifica se o pedido pertence ao produtor logado
        if order.producer != request.user:
            return Response(
                {"detail": "Você não tem permissão para atualizar este pedido."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = OrderStatusUpdateSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(OrderSerializer(order).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)