from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import datadog
import json
import datetime
import logging

logger = logging.getLogger(__name__)

datadog.initialize(**settings.DATADOG_KEYS)


class MetricsView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        return Response(request.data)

    def post(self, request):
        d = request.data
        if 'title' not in d:
            d['title'] = 'testpilot-generic-event'
        d['created'] = datetime.datetime.now().isoformat()
        handle_metric(d)
        return Response(d)


def handle_metric(metric):
    # will eventually handle multiple types of metrics, including
    # statsd types.
    datadog.api.Event.create(title=metric['title'], text=json.dumps(metric),
                             tags=metric['event-data']['tags'])
