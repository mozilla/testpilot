import json
import os.path

from django.conf import settings
from django.http import HttpResponse, HttpResponseServerError, JsonResponse
from django.views import static

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


def contribute_json(request):
    return static.serve(request, 'contribute.json', document_root=settings.ROOT)


def privacy(request):
    return static.serve(request, 'legal-copy/privacy-notice.html', document_root=settings.ROOT)


def terms(request):
    return static.serve(request, 'legal-copy/terms-of-use.html', document_root=settings.ROOT)
