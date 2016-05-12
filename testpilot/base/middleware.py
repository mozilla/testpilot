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
        out = {
            "errno": 0,
            "agent": request.META.get('HTTP_USER_AGENT', ''),
            "lang": request.META.get('HTTP_ACCEPT_LANGUAGE', ''),
            "method": request.method,
            "path": request.path,
        }

        # HACK: It's possible some other middleware has replaced the request we
        # modified earlier, so be sure to check for existence of these
        # attributes before trying to use them.
        if hasattr(request, 'user'):
            out['uid'] = (request.user.is_authenticated() and
                          request.user.id or '')
        if hasattr(request, '_id'):
            out['rid'] = request._id
        if hasattr(request, '_logging_start_dt'):
            td = datetime.datetime.utcnow() - request._logging_start_dt
            out['t'] = int(td.total_seconds() * 1000)  # in ms

        return out

    def process_response(self, request, response):
        extra = self._build_extra_meta(request)
        self.logger.info('', extra=extra)
        return response

    def process_exception(self, request, exception):
        extra = self._build_extra_meta(request)
        extra['errno'] = 500
        self.logger.error(str(exception), extra=extra)
        return None
