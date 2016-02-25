import logging
import json
import socket
import traceback


class JsonLogFormatter(logging.Formatter):
    """Log formatter that outputs machine-readable json.

    This log formatter outputs JSON format messages that are compatible with
    Mozilla's standard heka-based log aggregation infrastructure.

    See also:
    https://mana.mozilla.org/wiki/display/CLOUDSERVICES/Logging+Standard
    https://mana.mozilla.org/wiki/pages/viewpage.action?pageId=42895640

    Adapted from:
    https://github.com/mozilla-services/mozservices/blob/master/mozsvc/util.py#L106
    """
    LOGGING_FORMAT_VERSION = "2.0"

    # Map from Python logging to Syslog severity levels
    SYSLOG_LEVEL_MAP = {
        50: 2,  # CRITICAL
        40: 3,  # ERROR
        30: 4,  # WARNING
        20: 6,  # INFO
        10: 7,  # DEBUG
    }

    # Syslog level to use when/if python level isn't found in map
    DEFAULT_SYSLOG_LEVEL = 7

    EXCLUDED_LOGRECORD_ATTRS = set((
        'args', 'asctime', 'created', 'exc_info', 'exc_text', 'filename',
        'funcName', 'levelname', 'levelno', 'lineno', 'module', 'msecs',
        'message', 'msg', 'name', 'pathname', 'process', 'processName',
        'relativeCreated', 'stack_info', 'thread', 'threadName'
    ))

    def __init__(self, format=None, datefmt=None, style='%',
                 logger_name='TestPilot'):
        super(JsonLogFormatter, self).__init__(format, datefmt, style)
        self.logger_name = logger_name
        self.hostname = socket.gethostname()

    def format(self, record):
        """
        Map from Python LogRecord attributes to JSON log format fields

        * from - https://docs.python.org/3/library/logging.html#logrecord-attributes
        * to - https://mana.mozilla.org/wiki/pages/viewpage.action?pageId=42895640
        """
        out = dict(
            Timestamp=int(record.created * 1e9),
            Type=record.name,
            Logger=self.logger_name,
            Hostname=self.hostname,
            EnvVersion=self.LOGGING_FORMAT_VERSION,
            Severity=self.SYSLOG_LEVEL_MAP.get(record.levelno,
                                               self.DEFAULT_SYSLOG_LEVEL),
            Pid=record.process,
        )

        # Include any custom attributes set on the record.
        # These would usually be collected metrics data.
        fields = dict()
        for key, value in record.__dict__.items():
            if key not in self.EXCLUDED_LOGRECORD_ATTRS:
                fields[key] = value

        # Only include the 'message' key if it has useful content
        # and is not already a JSON blob.
        message = record.getMessage()
        if message:
            if not message.startswith("{") and not message.endswith("}"):
                fields["message"] = message

        # If there is an error, format it for nice output.
        if record.exc_info is not None:
            fields["error"] = repr(record.exc_info[1])
            fields["traceback"] = safer_format_traceback(*record.exc_info)

        out['Fields'] = fields

        return json.dumps(out)


def safer_format_traceback(exc_typ, exc_val, exc_tb):
    """Format an exception traceback into safer string.
    We don't want to let users write arbitrary data into our logfiles,
    which could happen if they e.g. managed to trigger a ValueError with
    a carefully-crafted payload.  This function formats the traceback
    using "%r" for the actual exception data, which passes it through repr()
    so that any special chars are safely escaped.
    """
    lines = ["Uncaught exception:\n"]
    lines.extend(traceback.format_tb(exc_tb))
    lines.append("%r\n" % (exc_typ,))
    lines.append("%r\n" % (exc_val,))
    return "".join(lines)
