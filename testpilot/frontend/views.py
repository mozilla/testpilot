from django.shortcuts import render

from ..experiments.models import Experiment


def index(request, url=''):
    return render(request, 'testpilot/frontend/index.html', {
        'experiment': Experiment.objects.for_request(request)
    })
