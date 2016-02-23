from unittest.mock import patch

import io
import json

from django.core.urlresolvers import reverse
from django.db import OperationalError

from ..utils import TestCase

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
