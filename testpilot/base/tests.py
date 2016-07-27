from unittest.mock import patch, Mock

import io
import json

from django.test import override_settings
from django.core.urlresolvers import reverse
from django.db import OperationalError

from constance.test import override_config

from testfixtures import LogCapture

from ..utils import TestCase
from .jinja import _hash_content, waffleintegrity, TestPilotExtension

import logging
logger = logging.getLogger(__name__)


class RequestSummaryLoggingTests(TestCase):

    def setUp(self):
        super(RequestSummaryLoggingTests, self).setUp()
        self.handler = LogCapture()

    def tearDown(self):
        self.handler.uninstall()

    def test_unblackisted_are_logged(self):
        self.handler.records = []
        url = '/__version__'
        resp = self.client.get(url)
        self.assertEqual(200, resp.status_code)
        record = self.handler.records[0]
        self.assertEqual(url, record.path)

    def test_blacklisted_are_not_logged(self):
        self.handler.records = []
        url = '/__heartbeat__'
        resp = self.client.get(url)
        self.assertEqual(200, resp.status_code)
        self.assertEqual(0, len(self.handler.records))


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


class _MockJinjaEnvironment(object):
    def __init__(self):
        self.globals = {}


MockStorageInstance = Mock()
MockStorageInstance.path = Mock(return_value='foo')
MockStorageInstance.hashed_files = {"foo": "bar"}
MockStorage = Mock(return_value=MockStorageInstance)


class TestPilotJinjaExtensionTests(TestCase):

    def setUp(self):
        self.environment = _MockJinjaEnvironment()
        self.extension = TestPilotExtension(self.environment)

    def test_hash_content(self):
        content = """
            Beard irony cold-pressed, venmo chicharrones PBR&B banh mi
            meditation. Forage street art meh artisan, tattooed
            gochujang pinterest fixie skateboard kombucha crucifix viral.
        """
        self.assertEqual(
            _hash_content(content.encode()),
            'sha384-1hLxRtQHxIHoyvc9LOFMWEOGa2gsPIK+4e5++etpYBwkHjxWe9MQOXp/9e4zYqHm'
        )

    @override_settings(DEBUG=True)
    @patch('django.contrib.staticfiles.finders')
    @patch('builtins.open')
    def test_staticintegrity_debug(self, mock_open, mock_finders):
        content = 'debug file'
        expected_hash = _hash_content(content.encode())
        mock_finders.find = Mock(return_value='foo')
        mock_open.return_value = io.BytesIO(content.encode('utf-8'))
        result = self.environment.globals['staticintegrity'](None, 'foo')
        self.assertEqual(result, expected_hash)

    @override_settings(DEBUG=False)
    @override_settings(STATICFILES_STORAGE='testpilot.base.tests.MockStorage')
    @patch('builtins.open')
    def test_staticintegrity_prod(self, mock_open):
        content = 'prod file'
        expected_hash = _hash_content(content.encode())
        mock_open.return_value = io.BytesIO(content.encode('utf-8'))
        result = self.environment.globals['staticintegrity'](None, 'foo')
        MockStorageInstance.path.assert_called_with('bar')
        self.assertEqual(result, expected_hash)

    def test_urlintegrity(self):
        expected_url = 'http://example.com'
        expected_hash = '8675309'
        with self.settings(URL_INTEGRITY_HASHES={expected_url: expected_hash}):
            result = self.environment.globals['urlintegrity'](None, expected_url)
            self.assertEqual(result, expected_hash)

    def test_urlintegrity_override(self):
        expected_url = 'http://example.com'
        expected_hash = '8675309'
        overrides = json.dumps({expected_url: expected_hash})
        with self.settings(URL_INTEGRITY_HASHES={expected_url: 'override me'}):
            with override_config(URL_INTEGRITY_HASHES_OVERRIDES=overrides):
                result = self.environment.globals['urlintegrity'](None, expected_url)
                self.assertEqual(result, expected_hash)

    @patch('waffle.views._generate_waffle_js')
    def test_waffleintegrity(self, mock_generate):
        expected_content = 'foobarbaz waffle'
        expected_hash = _hash_content(expected_content.encode())
        mock_generate.return_value = expected_content
        result = waffleintegrity(None, None)
        self.assertEqual(result, expected_hash)
