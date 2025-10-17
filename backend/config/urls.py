# backend/config/urls.py
from django.contrib import admin
from django.urls import path, re_path, include
from core.views import index, ProducerRegisterView, ProductViewSet
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

# Crie um router para a API de produtos
router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/', include(router.urls)),

    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/auth/registration/producer/', ProducerRegisterView.as_view(), name='producer_register'),

    re_path(r'^.*$', index),
]