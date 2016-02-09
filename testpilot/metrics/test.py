from django.core.urlresolvers import reverse
from django.test import TestCase
from django.test import Client
from django.contrib.auth.models import User

import logging
logger = logging.getLogger(__name__)


# need to test posting a metric data maybe?
class MetricsViewTests(TestCase):

    maxDiff = None

    @classmethod
    def setUpTestData(cls):
        cls.username = 'johndoe'
        cls.password = 'top_secret'
        cls.email = '%s@example.com' % cls.username
        cls.user = User.objects.create_user(
            username=cls.username,
            email=cls.email,
            password=cls.password)

        cls.url = reverse('metrics')

    def setUp(self):
        self.client = Client()

    def test_get_anonymous(self):
        """/api/metrics resource should contain no data for unauth'd user"""
        resp = self.client.get(self.url)

        self.assertJSONEqual(
            str(resp.content, encoding='utf8'),
            {
                'detail': 'Authentication credentials were not provided.'
            }
        )

    def test_get_logged_in(self):
        """/api/metrics resource should contain data for auth'd user"""
        self.client.login(username=self.username,
                          password=self.password)

        resp = self.client.get(self.url)
        self.assertJSONEqual(
            str(resp.content, encoding='utf8'),
            {}
        )
