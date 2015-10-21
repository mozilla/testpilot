from django.conf import settings
from django.core.urlresolvers import reverse
from django.test import TestCase
from django.test import Client
from django.contrib.auth.models import User
from rest_framework import fields

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
        """/api/me resource should contain no data for unauth'd user"""
        resp = self.client.get(self.url)
        data = json.loads(str(resp.content, encoding='utf8'))

        self.assertEqual(len(data.keys()), 0)

    def test_get_logged_in(self):
        """/api/me resource should contain data for auth'd user"""
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

        experiment = self.experiments['test-1']

        UserInstallation.objects.create(
            experiment=experiment,
            user=self.user
        )

        resp = self.client.get(self.url)
        # HACK: Use a rest framework field to format dates as expected
        date_field = fields.DateTimeField()
        self.assertJSONEqual(
            str(resp.content, encoding='utf8'),
            {
                'id': self.email,
                'addon': self.addonData,
                'installed': [
                    {
                        'id': experiment.pk,
                        'url': 'http://testserver/api/experiments/%s' %
                               experiment.pk,
                        'slug': experiment.slug,
                        'title': experiment.title,
                        'description': experiment.description,
                        'version': experiment.version,
                        'changelog_url': experiment.changelog_url,
                        'contribute_url': experiment.contribute_url,
                        'thumbnail': None,
                        'xpi_url': experiment.xpi_url,
                        'details': [],
                        'created': date_field.to_representation(
                            experiment.created),
                        'modified': date_field.to_representation(
                            experiment.modified),
                    }
                ]
            }
        )
