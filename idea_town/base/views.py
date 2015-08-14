from django.shortcuts import render


def home(request):
    return render(request, 'idea_town/home.html')
