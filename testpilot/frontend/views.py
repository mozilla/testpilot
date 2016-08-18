from django.shortcuts import render

from ..social.models import SocialMetadata


def index(request, url=''):
    return render(request, 'testpilot/frontend/index.html', {
        'social': SocialMetadata.objects.for_request(request)
    })
