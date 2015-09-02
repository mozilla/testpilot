from django.shortcuts import render


def index(request, url=''):
    return render(request, 'idea_town/frontend/index.html',
                  {"route_url": url})
