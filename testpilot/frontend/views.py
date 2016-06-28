from django.shortcuts import render
from django.views.decorators.clickjacking import xframe_options_exempt


def index(request, url=''):
    return render(request, 'testpilot/frontend/index.html',
                  {'user_id': request.user.email if not request.user.is_anonymous() else ''})


@xframe_options_exempt
def postmessage_proxy(request):
    return render(request, 'testpilot/frontend/proxy.html')
