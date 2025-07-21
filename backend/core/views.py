from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

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
        # Em uma aplicação real, você buscaria isso do banco de dados.
        # Por agora, vamos apenas simular com uma lista.
        recipes = [
            {
                "id": 1,
                "title": "Salada Caesar com Frango Grelhado",
                "description": "Uma salada clássica, completa e deliciosa, perfeita para uma refeição leve.",
                "image_url": "https://placehold.co/600x400/4CAF50/FFFFFF?text=Salada"
            },
            {
                "id": 2,
                "title": "Smoothie Verde Detox",
                "description": "Comece seu dia com energia! Uma mistura de espinafre, maçã verde, abacaxi e gengibre.",
                "image_url": "https://placehold.co/600x400/2E7D32/FFFFFF?text=Smoothie"
            },
            {
                "id": 3,
                "title": "Sopa de Lentilhas Nutritiva",
                "description": "Aconchegante e cheia de nutrientes, ideal para os dias mais frios.",
                "image_url": "https://placehold.co/600x400/E65100/FFFFFF?text=Sopa"
            },
            {
                "id": 4,
                "title": "Wrap de Hummus e Vegetais",
                "description": "Uma opção de almoço rápida, vegana e cheia de sabor e texturas.",
                "image_url": "https://placehold.co/600x400/3E2723/FFFFFF?text=Wrap"
            }
        ]
        return Response(recipes)