from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def profile(request):
    return render(request, 'idea_town/accounts/profile.html')
