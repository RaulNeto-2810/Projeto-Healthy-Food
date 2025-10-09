# backend/core/views.py

from django.shortcuts import render
from dj_rest_auth.registration.views import RegisterView # Importe
from .serializers import ProducerRegisterSerializer      # Importe

def index(request):
    return render(request, 'index.html')

# Adicione esta nova classe
class ProducerRegisterView(RegisterView):
    serializer_class = ProducerRegisterSerializer