# backend/config/urls.py
from django.contrib import admin
from django.urls import path, re_path, include
from core.views import index, ProducerRegisterView, ProductViewSet, ProducerListView, ProducerDetailView, ProducerProductsView, OrderViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

# Crie um router para a API de produtos e pedidos
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include(router.urls)),

    path('api/producers/', ProducerListView.as_view(), name='producer-list'),
    path('api/producers/<int:pk>/', ProducerDetailView.as_view(), name='producer-detail'),
    path('api/producers/<int:pk>/products/', ProducerProductsView.as_view(), name='producer-products'),

    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/auth/registration/producer/', ProducerRegisterView.as_view(), name='producer_register'),

    re_path(r'^.*$', index),
]