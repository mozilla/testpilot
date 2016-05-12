from uuid import uuid1
import datetime

import logging


class RequestSummaryLogger(object):
    """Emit a request.summary type log entry for every request.
    https://github.com/mozilla-services/Dockerflow/blob/master/docs/mozlog.md
    """

    def __init__(self):
        self.logger = logging.getLogger('request.summary')

    def process_request(self, request):
        request._id = str(uuid1())
        request._logging_start_dt = datetime.datetime.utcnow()
        return None

    def _build_extra_meta(self, request):
        td = datetime.datetime.utcnow() - request._logging_start_dt
        t = int(td.total_seconds() * 1000)  # in ms
        return {
            "errno": 0,
            "agent": request.META.get('HTTP_USER_AGENT', ''),
            "lang": request.META.get('HTTP_ACCEPT_LANGUAGE', ''),
            "method": request.method,
            "path": request.path,
            "rid": request._id,
            "t": t,
            "uid": request.user.is_authenticated() and request.user.id or '',
        }

    def process_response(self, request, response):
        extra = self._build_extra_meta(request)
        self.logger.info('', extra=extra)
        return response

    def process_exception(self, request, exception):
        extra = self._build_extra_meta(request)
        extra['errno'] = 500
        self.logger.error(str(exception), extra=extra)
        return None
