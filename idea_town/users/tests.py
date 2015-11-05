import json

from django.conf import settings
from django.core.urlresolvers import reverse
from django.test import TestCase
from django.test import Client
from django.contrib.auth.models import User
from rest_framework import fields

from ..utils import gravatar_url
from ..experiments.models import (Experiment, UserInstallation)
from .models import UserProfile

import logging
logger = logging.getLogger(__name__)


class UserProfileTests(TestCase):

    maxDiff = None

    @classmethod
    def setUpTestData(cls):
        cls.username = 'johndoe2'
        cls.password = 'trustno1'
        cls.email = '%s@example.com' % cls.username

        cls.user = User.objects.create_user(
            username=cls.username,
            email=cls.email,
            password=cls.password)

        UserProfile.objects.filter(user=cls.user).delete()

    def test_get_profile_nonexistent(self):
        """Profile should be created on first attempt to get"""

        profiles_count = UserProfile.objects.filter(user=self.user).count()
        self.assertEqual(0, profiles_count)

        profile = UserProfile.objects.get_profile(self.user)
        self.assertIsNotNone(profile)
        self.assertEqual(self.user, profile.user)

        profiles_count = UserProfile.objects.filter(user=self.user).count()
        self.assertEqual(1, profiles_count)

    def test_get_profile_exists(self):
        """Existing profile should be returned on get"""
        expected_title = 'chief cat wrangler'

        expected_profile = UserProfile(user=self.user, title=expected_title)
        expected_profile.save()

        result_profile = UserProfile.objects.get_profile(user=self.user)
        self.assertIsNotNone(result_profile)
        self.assertEqual(expected_title, result_profile.title)


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

        cls.experiments = dict((obj.slug, obj) for (obj, created) in (
            Experiment.objects.get_or_create(
                slug="test-%s" % idx, defaults=dict(
                    title="Test %s" % idx,
                    description="This is a test"
                )) for idx in range(1, 4)))

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
                'profile': {
                    'avatar': gravatar_url(self.email),
                    'display_name': 'johndoe',
                    'title': '',
                    'username': 'johndoe'
                },
                'addon': self.addonData,
                'installed': []
            }
        )

        experiment = self.experiments['test-1']

        UserInstallation.objects.create(
            experiment=experiment,
            user=self.user
        )

        # HACK: Use a rest framework field to format dates as expected
        date_field = fields.DateTimeField()

        resp = self.client.get(self.url)
        result_data = json.loads(str(resp.content, 'utf-8'))

        self.assertEqual(len(result_data['installed']), 1)
        self.assertDictEqual(
            result_data['installed'][0],
            {
                'id': experiment.pk,
                'url': 'http://testserver/api/experiments/%s' % experiment.pk,
                'slug': experiment.slug,
                'title': experiment.title,
                'description': experiment.description,
                'measurements': experiment.measurements.rendered,
                'version': experiment.version,
                'changelog_url': experiment.changelog_url,
                'contribute_url': experiment.contribute_url,
                'thumbnail': None,
                'xpi_url': experiment.xpi_url,
                'addon_id': experiment.addon_id,
                'details': [],
                'contributors': [],
                'created': date_field.to_representation(experiment.created),
                'modified': date_field.to_representation(experiment.modified),
            }
        )
