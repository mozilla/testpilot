import os.path
import json

from django.conf import settings
from django.http import HttpResponse, JsonResponse, HttpResponseServerError

from ..experiments.models import Experiment


def ops_lbheartbeat(request):
    return HttpResponse('ok')


def ops_heartbeat(request):
    try:
        # Check the database by counting Experiments
        Experiment.objects.count()
        # TODO: Add checks for other dependencies as we add them
        return HttpResponse('ok')
    except:
        return HttpResponseServerError('database failure')


def ops_version(request):
    VERSION_FN = '%s/version.json' % settings.ROOT
    if os.path.exists(VERSION_FN):
        data = json.load(open(VERSION_FN, 'r'))
    else:
        data = {
            "source": "https://github.com/mozilla/testpilot.git",
            "version": "dev",
            "commit": "dev"
        }
    return JsonResponse(data)
