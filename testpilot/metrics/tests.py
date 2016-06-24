from django.test.utils import override_settings
from django.core.urlresolvers import reverse
from django.contrib.auth.models import User

import json

from mozilla_cloud_services_logger.formatters import JsonLogFormatter

from testfixtures import LogCapture
from ..utils import TestCase


class LogPingTestCase(TestCase):

    def setUp(self):
        super(LogPingTestCase, self).setUp()

        self.handler = LogCapture()

        self.username = 'johndoe2'
        self.password = 'trustno1'
        self.email = '%s@example.com' % self.username

        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password)

    def tearDown(self):
        self.handler.uninstall()

    def test_404_ping(self):
        """POST to /api/metrics/foobar should be a 404"""
        self.client.login(username=self.username,
                          password=self.password)
        log_name = 'foobar'
        url = reverse('log-ping', args=(log_name,))
        resp = self.client.post(url, {})
        self.assertEqual(404, resp.status_code)

    def test_unauth_ping(self):
        log_name = 'testpilottest'
        data = {
            "service": "wayforwardthing",
            "agent": "frobnitz browser"
        }
        url = reverse('log-ping', args=(log_name,))

        self.handler.records = []
        resp = self.client.post(
            url,
            content_type='application/json',
            data=json.dumps(data))

        self.assertEqual(200, resp.status_code)

        record = self.handler.records[0]
        formatter = JsonLogFormatter(logger_name=record.name)
        details = json.loads(formatter.format(record))
        fields = details['Fields']

        self.assertEqual(log_name, record.name)
        self.assertEqual(fields['service'], data['service'])
        self.assertEqual(fields['agent'], data['agent'])

    @override_settings(LOG_PING_WHITELIST=['alpha', 'beta', 'delta'])
    def test_auth_ping(self):
        """POST to /api/metrics/{name} should result in expected log event"""
        self.client.login(username=self.username,
                          password=self.password)

        for log_name in ['alpha', 'beta', 'delta']:
            url = reverse('log-ping', args=(log_name,))

            self.handler.records = []
            resp = self.client.post(
                url,
                content_type='application/json',
                data=json.dumps({'context': 'wheee'}))

            self.assertEqual(200, resp.status_code)

            record = self.handler.records[0]
            formatter = JsonLogFormatter(logger_name=record.name)
            details = json.loads(formatter.format(record))
            fields = details['Fields']

            self.assertEqual(log_name, record.name)
            self.assertEqual(fields['uid'], self.user.id)
            self.assertEqual(fields['context'], 'wheee')
