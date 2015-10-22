import json

from django.core.urlresolvers import reverse
from django.test import TestCase
from django.test import Client
from django.contrib.auth.models import User
from rest_framework import fields

from ..users.models import UserProfile
from .models import (Experiment)  # , ExperimentDetail, UserInstallation)

import logging
logger = logging.getLogger(__name__)


class ExperimentViewTests(TestCase):

    maxDiff = None

    @classmethod
    def setUpTestData(cls):
        cls.experiments = dict((obj.slug, obj) for (obj, created) in (
            Experiment.objects.get_or_create(
                slug="test-%s" % idx, defaults=dict(
                    title="Test %s" % idx,
                    description="This is a test"
                )) for idx in range(1, 4)))

        cls.users = dict((obj.username, obj) for obj in (
            User.objects.create_user(
                username='experimenttest-%s' % idx,
                email='experimenttest-%s@example.com' % idx,
                password='trustno%s' % idx
            ) for idx in range(0, 5)))

    def setUp(self):
        self.client = Client()

    def test_index(self):
        """Experiment list API resource should include all experiments"""
        url = reverse('experiment-list')
        resp = self.client.get(url)
        # HACK: Use a rest framework field to format dates as expected
        date_field = fields.DateTimeField()
        self.assertJSONEqual(
            str(resp.content, encoding='utf8'),
            {
                "count": 3,
                "next": None,
                "previous": None,
                "results": sorted(
                    ({
                        "id": experiment.pk,
                        "url": "http://testserver/api/experiments/%s" %
                               experiment.pk,
                        "title": experiment.title,
                        "slug": experiment.slug,
                        "thumbnail": None,
                        "description": experiment.description,
                        "measurements": experiment.measurements.rendered,
                        "version": experiment.version,
                        "changelog_url": experiment.changelog_url,
                        "contribute_url": experiment.contribute_url,
                        "addon_id": experiment.addon_id,

                        "created": date_field.to_representation(
                            experiment.created),
                        "modified": date_field.to_representation(
                            experiment.modified),
                        "xpi_url": "",
                        "details": [],
                        "contributors": []
                    } for (slug, experiment) in self.experiments.items()),
                    key=lambda x: x['id'])
            }
        )

    def test_contributors(self):
        """Experiment detail API resource should list contributor profiles"""
        users = [
            self.users['experimenttest-1'],
            self.users['experimenttest-2']
        ]

        profiles = [
            UserProfile.objects.get_profile(users[0]),
            UserProfile.objects.get_profile(users[1])
        ]

        profiles[0].title = 'chief cat wrangler'
        profiles[0].display_name = 'jane doe'
        profiles[0].save()

        profiles[1].title = 'assistant cat wrangler'
        profiles[1].display_name = 'john doe'
        profiles[1].save()

        experiment = self.experiments['test-1']
        experiment.contributors.add(users[0])
        experiment.contributors.add(users[1])

        url = reverse('experiment-detail', args=(experiment.pk,))
        resp = self.client.get(url)
        result = json.loads(str(resp.content, encoding='utf8'))

        contributors = result.get('contributors', None)
        self.assertIsNotNone(contributors)

        for idx in range(0, 2):
            profile = profiles[idx]
            user = users[idx]
            contributor = contributors[idx]

            self.assertEqual(contributor['username'], user.username)
            self.assertEqual(contributor['display_name'], profile.display_name)
            self.assertEqual(contributor['title'], profile.title)
            self.assertEqual(contributor['avatar'], None)
