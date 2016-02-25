from unittest.mock import patch

import os
import io
import json

from testfixtures import LogCapture
import jsonschema

from django.core.urlresolvers import reverse
from django.db import OperationalError

from ..utils import TestCase
from .logging import JsonLogFormatter

import logging
logger = logging.getLogger(__name__)


class OpsEndpointTests(TestCase):

    def test_ops_heartbeat_ok(self):
        """/__heartbeat__ should respond with 200 OK"""
        url = reverse('ops-heartbeat')
        self.assertEqual('/__heartbeat__', url)
        resp = self.client.get(url)
        self.assertEqual(200, resp.status_code)

    def test_ops_heartbeat_db_failure(self):
        """/__heartbeat__ should respond with 500 when there is a database problem"""
        url = reverse('ops-heartbeat')
        to_mock = 'django.db.backends.base.base.BaseDatabaseWrapper.ensure_connection'
        with patch(to_mock) as mock_ensure_connection:
            mock_ensure_connection.side_effect = OperationalError(
                'FATAL:  the database system is shutting down')
            resp = self.client.get(url)
            self.assertEqual(500, resp.status_code)

    def test_ops_lbheartbeat(self):
        """/__lbheartbeat__ should respond with 200 OK"""
        url = reverse('ops-lbheartbeat')
        self.assertEqual('/__lbheartbeat__', url)
        resp = self.client.get(url)
        self.assertEqual(200, resp.status_code)

    def test_ops_version_url(self):
        """/__version__ should be the ops endpoint URL"""
        self.assertEqual('/__version__', reverse('ops-version'))

    def test_ops_version_default(self):
        """/__version__ should respond with canned data if file not available"""
        with patch('os.path.exists') as mock_exists:
            mock_exists.return_value = False
            result = self.jsonGet('ops-version')
            expected = {
                "source": "https://github.com/mozilla/testpilot.git",
                "version": "dev",
                "commit": "dev"
            }
            self.assertEqual(expected, result)

    def test_ops_version_file(self):
        """/__version__ should respond with version.json file, if available"""
        with patch('os.path.exists') as mock_exists:
            mock_exists.return_value = True
            with patch('builtins.open') as mock_open:
                expected = {
                    "source": "test",
                    "version": "test",
                    "commit": "test"
                }
                mock_open.return_value = io.StringIO(json.dumps(expected))
                result = self.jsonGet('ops-version')
                self.assertEqual(expected, result)


class ContributeJsonTests(TestCase):

    def setUp(self):
        super(ContributeJsonTests, self).setUp()
        self.url = reverse('contribute-json')

    def test_success(self):
        resp = self.client.get(self.url)
        self.assertEqual(200, resp.status_code)

    def test_schema(self):
        resp = self.client.get(self.url)
        data = json.loads(resp.getvalue().decode('utf-8'))
        assert set(['name', 'description', 'repository']).issubset(data.keys())


class TestJsonLogFormatter(TestCase):

    def setUp(self):
        self.handler = LogCapture()
        self.logger_name = "TestingTestPilot"
        self.formatter = JsonLogFormatter(logger_name=self.logger_name)

    def tearDown(self):
        self.handler.uninstall()

    def _fetchLastLog(self):
        self.assertEquals(len(self.handler.records), 1)
        details = json.loads(self.formatter.format(self.handler.records[0]))
        jsonschema.validate(details, JSON_LOGGING_SCHEMA)
        return details

    def test_basic_operation(self):
        """Ensure log formatter contains all the expected fields and values"""
        message_text = "simple test"
        logging.debug(message_text)
        details = self._fetchLastLog()

        expected_present = ["Timestamp", "Hostname"]
        for key in expected_present:
            self.assertTrue(key in details)

        expected_meta = {
            "Severity": 7,
            "Type": "root",
            "Pid": os.getpid(),
            "Logger": self.logger_name,
            "EnvVersion": self.formatter.LOGGING_FORMAT_VERSION
        }
        for key, value in expected_meta.items():
            self.assertEquals(value, details[key])

        self.assertEquals(details['Fields']['message'], message_text)

    def test_custom_paramters(self):
        """Ensure log formatter can handle custom parameters"""
        logger = logging.getLogger("mozsvc.test.test_logging")
        logger.warn("custom test %s", "one", extra={"more": "stuff"})
        details = self._fetchLastLog()

        self.assertEquals(details["Type"], "mozsvc.test.test_logging")
        self.assertEquals(details["Severity"], 4)

        fields = details['Fields']
        self.assertEquals(fields["message"], "custom test one")
        self.assertEquals(fields["more"], "stuff")

    def test_logging_error_tracebacks(self):
        """Ensure log formatter includes exception traceback information"""
        try:
            raise ValueError("\n")
        except Exception:
            logging.exception("there was an error")
        details = self._fetchLastLog()

        expected_meta = {
            "Severity": 3,
        }
        for key, value in expected_meta.items():
            self.assertEquals(value, details[key])

        fields = details['Fields']
        expected_fields = {
            'message': 'there was an error',
            'error': "ValueError('\\n',)"
        }
        for key, value in expected_fields.items():
            self.assertEquals(value, fields[key])

        self.assertTrue(fields['traceback'].startswith('Uncaught exception:'))
        self.assertTrue("<class 'ValueError'>" in fields['traceback'])


# https://mana.mozilla.org/wiki/pages/viewpage.action?pageId=42895640
JSON_LOGGING_SCHEMA = json.loads("""
{
    "type":"object",
    "required":["Timestamp"],
    "properties":{
        "Timestamp":{
            "type":"integer",
            "minimum":0
        },
        "Type":{
            "type":"string"
        },
        "Logger":{
            "type":"string"
        },
        "Hostname":{
            "type":"string",
            "format":"hostname"
        },
        "EnvVersion":{
            "type":"string",
            "pattern":"^\\d+(?:\\.\\d+){0,2}$"
        },
        "Severity":{
            "type":"integer",
            "minimum":0,
            "maximum":7
        },
        "Pid":{
            "type":"integer",
            "minimum":0
        },
        "Fields":{
            "type":"object",
            "minProperties":1,
            "additionalProperties":{
                "anyOf": [
                    { "$ref": "#/definitions/field_value"},
                    { "$ref": "#/definitions/field_array"},
                    { "$ref": "#/definitions/field_object"}
                ]
            }
        }
    },
    "definitions":{
        "field_value":{
            "type":["string", "number", "boolean"]
        },
        "field_array":{
            "type":"array",
            "minItems": 1,
            "oneOf": [
                    {"items": {"type":"string"}},
                    {"items": {"type":"number"}},
                    {"items": {"type":"boolean"}}
            ]
        },
        "field_object":{
            "type":"object",
            "required":["value"],
            "properties":{
                "value":{
                    "oneOf": [
                        { "$ref": "#/definitions/field_value" },
                        { "$ref": "#/definitions/field_array" }
                    ]
                },
                "representation":{"type":"string"}
            }
        }
    }
}
""".replace("\\", "\\\\"))  # HACK: Fix escaping for easy copy/paste
