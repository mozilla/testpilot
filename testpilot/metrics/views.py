import logging

from django.conf import settings
from django.http import Http404

from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view

DEFAULT_LOG_PING_WHITELIST = [
    'testpilottest'
]


@csrf_exempt
@api_view(['POST'])
@permission_classes([])
def log_ping(request, logger_name):
    """Accept and log metrics pings"""
    whitelist = getattr(settings, 'LOG_PING_WHITELIST', DEFAULT_LOG_PING_WHITELIST)
    if logger_name not in whitelist:
        raise Http404

    extra = {}
    if request.user.is_authenticated():
        extra['uid'] = request.user.id
    extra.update(request.data)
    logging.getLogger(logger_name).info('', extra=extra)

    return Response({'status': 'ok'})
