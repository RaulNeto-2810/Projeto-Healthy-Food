# backend/config/urls.py
from django.contrib import admin
from django.urls import path, re_path, include # Adicione 'include'
from core.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('api/auth/', include('dj_rest_auth.urls')),
    path('api/auth/registration/', include('dj_rest_auth.registration.urls')),
    
    re_path(r'^.*$', index),
]