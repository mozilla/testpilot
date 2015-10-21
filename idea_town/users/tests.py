from django.conf import settings
from django.core.urlresolvers import reverse
from django.test import TestCase
from django.test import Client
from django.contrib.auth.models import User

from ..experiments.models import (Experiment, UserInstallation)

import json

import logging
logger = logging.getLogger(__name__)


class MeViewSetTests(TestCase):

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

        cls.experiments = dict((obj.slug, obj) for obj in (
            Experiment.objects.create(**kwargs) for kwargs in (
                dict(title='Test 1', slug='test-1', description='This is a test'),
                dict(title='Test 2', slug='test-2', description='This is a test'),
                dict(title='Test 3', slug='test-3', description='This is a test'),
            )))

        cls.addonData = {
            'name': 'Idea Town',
            'url': settings.ADDON_URL
        }

        cls.url = reverse('me-list')

    def setUp(self):
        self.client = Client()

    def test_get_anonymous(self):
        resp = self.client.get(self.url)
        data = json.loads(str(resp.content, encoding='utf8'))

        self.assertEqual(len(data.keys()), 0)

    def test_get_logged_in(self):
        self.client.login(username=self.username,
                          password=self.password)

        resp = self.client.get(self.url)
        self.assertJSONEqual(
            str(resp.content, encoding='utf8'),
            {
                'id': self.email,
                'addon': self.addonData,
                'installed': []
            }
        )

        UserInstallation.objects.create(
            experiment=self.experiments['test-1'],
            user=self.user
        )

        resp = self.client.get(self.url)
        self.assertJSONEqual(
            str(resp.content, encoding='utf8'),
            {
                'id': self.email,
                'addon': self.addonData,
                'installed': [
                    {
                        'id': 4,
                        'description': 'This is a test',
                        'measurements': '<p></p>',
                        'details': [],
                        'slug': 'test-1',
                        'thumbnail': None,
                        'title': 'Test 1',
                        'url': 'http://testserver/api/experiments/4',
                        'xpi_url': ''
                    }
                ]
            }
        )
