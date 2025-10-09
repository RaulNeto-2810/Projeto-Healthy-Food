# backend/config/urls.py
from django.contrib import admin
from django.urls import path, re_path, include # Adicione 'include'
from core.views import index, ProducerRegisterView

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    
    path('api/auth/registration/producer/', ProducerRegisterView.as_view(), name='producer_register'),
    
    re_path(r'^.*$', index),
]