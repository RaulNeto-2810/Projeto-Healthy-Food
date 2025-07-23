from django.contrib import admin
from django.urls import path, re_path # Importe re_path
from core.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    # Esta rota garante que qualquer URL (exceto /admin/)
    # seja gerenciada pelo frontend do React.
    re_path(r'^.*$', index),
]