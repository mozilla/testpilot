from django.core.urlresolvers import reverse
from django.test import TestCase
from django.test import Client
from django.contrib.auth.models import User

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
        self.assertJSONEqual(
            str(resp.content, encoding='utf8'),
            {
                "count": 3,
                "next": None,
                "previous": None,
                "results": sorted(
                    ({
                        "id": obj.pk,
                        "url": "http://testserver/api/experiments/%s" %
                               obj.pk,
                        "title": obj.title,
                        "slug": obj.slug,
                        "thumbnail": None,
                        "description": obj.description,
                        "xpi_url": "",
                        "details": [],
                        "contributors": []
                    } for (slug, obj) in self.experiments.items()),
                    key=lambda x: x['id'])
            }
        )

    def test_contributors(self):
        """Experiment detail API resource should list contributor profiles"""
        user_1 = self.users['experimenttest-1']
        user_2 = self.users['experimenttest-2']

        profile_1 = UserProfile.objects.get_profile(user_1)
        profile_1.title = 'chief cat wrangler'
        profile_1.display_name = 'jane doe'
        profile_1.save()

        profile_2 = UserProfile.objects.get_profile(user_2)
        profile_2.title = 'assistant cat wrangler'
        profile_2.display_name = 'john doe'
        profile_2.save()

        experiment = self.experiments['test-1']
        experiment.contributors.add(user_1)
        experiment.contributors.add(user_2)

        url = reverse('experiment-detail', args=(experiment.pk,))
        resp = self.client.get(url)
        self.assertJSONEqual(
            str(resp.content, encoding='utf8'),
            {
                "id": experiment.pk,
                "url": "http://testserver/api/experiments/%s" %
                       experiment.pk,
                "title": experiment.title,
                "slug": experiment.slug,
                "thumbnail": None,
                "description": experiment.description,
                "xpi_url": "",
                "details": [],
                "contributors": [
                    {
                        "username": user_1.username,
                        "display_name": profile_1.display_name,
                        "title": profile_1.title,
                        "avatar": None
                    },
                    {
                        "username": user_2.username,
                        "display_name": profile_2.display_name,
                        "title": profile_2.title,
                        "avatar": None
                    }
                ]
            }
        )
