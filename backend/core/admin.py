# backend/core/admin.py
from django.contrib import admin
from .models import ProducerProfile, Product, Order, OrderItem

@admin.register(ProducerProfile)
class ProducerProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'cpf_cnpj', 'phone', 'user')
    search_fields = ('name', 'cpf_cnpj', 'user__email')
    list_filter = ('user__date_joined',)
    readonly_fields = ('user',)

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'category', 'status', 'stock', 'price', 'created_at')
    search_fields = ('name', 'owner__username', 'owner__email', 'category')
    list_filter = ('status', 'category', 'created_at')
    readonly_fields = ('owner', 'created_at', 'updated_at')
    ordering = ('-created_at',)

    def get_queryset(self, request):
        """
        Administradores veem todos os produtos.
        Produtores (se tiverem acesso ao admin) veem apenas seus produtos.
        """
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(owner=request.user)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'product_name', 'quantity', 'unit_price', 'subtotal')
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'client_name', 'producer', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at')
    search_fields = ('client_name', 'client_phone', 'client_email', 'producer__username')
    readonly_fields = ('producer', 'client_name', 'client_phone', 'client_email', 'total_price', 'created_at', 'updated_at')
    inlines = [OrderItemInline]
    ordering = ('-created_at',)

    def get_queryset(self, request):
        """Produtores só veem seus próprios pedidos"""
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(producer=request.user)