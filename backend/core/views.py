from django.shortcuts import render

# Esta view serve a aplicação React
def index(request):
    return render(request, "index.html")