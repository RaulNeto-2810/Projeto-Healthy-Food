# backend/core/admin.py
from django.contrib import admin
from .models import ProducerProfile, Product

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