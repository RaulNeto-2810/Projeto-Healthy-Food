from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Recipe

# Esta view continua servindo o seu index.html com o React
def index(request):
    return render(request, "index.html")

# --- ADICIONE ESTA NOVA VIEW ABAIXO ---
class TestAPIView(APIView):
    def get(self, request):
        # Esta view responderá com um JSON simples
        data = {
            "message": "Olá! Esta mensagem veio do seu backend Django! 🎉"
        }
        return Response(data)
    
class RecipeListView(APIView):
    def get(self, request):
        # Busca todos os objetos Recipe do banco de dados
        recipes_from_db = Recipe.objects.all().order_by('-created_at')

        # Converte os dados para um formato que pode ser enviado como JSON
        serialized_recipes = [
            {
                "id": recipe.id,
                "title": recipe.title,
                "description": recipe.description,
                "image_url": recipe.image_url,
            }
            for recipe in recipes_from_db
        ]
        return Response(serialized_recipes)