from django.shortcuts import render


def index(request, url=''):
    return render(request, 'idea_town/frontend/index.html',
                  {'user_id': request.user.email if not request.user.is_anonymous() else ''})
