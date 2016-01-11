import json

from django.core.urlresolvers import reverse
from django.contrib.auth.models import User

from rest_framework import fields

from ..utils import gravatar_url, TestCase
from ..users.models import UserProfile
from .models import (Experiment, UserFeedback, UserInstallation)

import logging
logger = logging.getLogger(__name__)


class BaseTestCase(TestCase):

    maxDiff = None

    def setUp(self):
        super(BaseTestCase, self).setUp()

        self.username = 'johndoe2'
        self.password = 'trustno1'
        self.email = '%s@example.com' % self.username

        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password)

        self.users = dict((obj.username, obj) for obj in (
            User.objects.create_user(
                username='experimenttest-%s' % idx,
                email='experimenttest-%s@example.com' % idx,
                password='trustno%s' % idx
            ) for idx in range(0, 5)))

        self.experiments = dict((obj.slug, obj) for (obj, created) in (
            Experiment.objects.get_or_create(
                slug="test-%s" % idx, defaults=dict(
                    title="Test %s" % idx,
                    description="This is a test",
                    addon_id="addon-%s@example.com" % idx
                )) for idx in range(1, 4)))


class ExperimentViewTests(BaseTestCase):

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
                        "order": experiment.order,
                        "slug": experiment.slug,
                        "thumbnail": None,
                        "description": experiment.description,
                        "measurements": experiment.measurements.rendered,
                        "version": experiment.version,
                        "changelog_url": experiment.changelog_url,
                        "contribute_url": experiment.contribute_url,
                        "privacy_notice_url": experiment.privacy_notice_url,
                        "addon_id": experiment.addon_id,

                        "created": date_field.to_representation(
                            experiment.created),
                        "modified": date_field.to_representation(
                            experiment.modified),
                        "xpi_url": "",
                        "details": [],
                        "contributors": [],
                        "installation_count": UserInstallation.objects
                        .distinct('user').filter(experiment=experiment)
                        .count(),
                        "installations_url":
                            "http://testserver/api/experiments/%s/installations/" %
                            experiment.pk,
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

            self.assertEqual(contributor['avatar'], gravatar_url(user.email))

    def test_installations(self):
        """Experiments should support an /installations/ psuedo-collection"""
        user = self.user
        experiment = self.experiments['test-1']
        client_id = '8675309'

        # Ensure list GET without authentication is a 403
        url = reverse('experiment-installation-list',
                      args=(experiment.pk,))
        resp = self.client.get(url)
        self.assertEqual(403, resp.status_code)

        self.client.login(username=self.username,
                          password=self.password)

        # Ensure the installation to be created is initially 404
        url = reverse('experiment-installation-detail',
                      args=(experiment.pk, client_id))
        resp = self.client.get(url)
        self.assertEqual(404, resp.status_code)

        # Create the first installation of interest
        UserInstallation.objects.create(
            experiment=experiment, user=user, client_id=client_id)

        # Also create a few installations that shouldn't appear in results
        UserInstallation.objects.create(
            experiment=self.experiments['test-2'], user=user,
            client_id=client_id)

        UserInstallation.objects.create(
            experiment=experiment, user=self.users['experimenttest-1'],
            client_id='someotherclient')

        # Ensure that the desired installation appears in the API list result
        data = self.jsonGet('experiment-installation-list',
                            experiment_pk=experiment.pk)
        self.assertEqual(1, len(data))
        self.assertEqual(client_id, data[0]['client_id'])

        # Ensure that the desired installation is found at its URL
        url = reverse('experiment-installation-detail',
                      args=(experiment.pk, client_id))
        resp = self.client.get(url)
        self.assertEqual(200, resp.status_code)

        # Create another client installation via PUT
        client_id_2 = '123456789'
        url = reverse('experiment-installation-detail',
                      args=(experiment.pk, client_id_2))
        resp = self.client.put(url, {})
        self.assertEqual(200, resp.status_code)

        # Ensure that the API list result reflects the addition
        data = self.jsonGet('experiment-installation-list',
                            experiment_pk=experiment.pk)
        self.assertEqual(2, len(data))

        # Delete the new client installation with DELETE
        client_id_2 = '123456789'
        url = reverse('experiment-installation-detail',
                      args=(experiment.pk, client_id_2))
        resp = self.client.delete(url)
        self.assertEqual(410, resp.status_code)

        # Ensure that the API list result reflects the deletion
        data = self.jsonGet('experiment-installation-list',
                            experiment_pk=experiment.pk)
        self.assertEqual(1, len(data))


class UserFeedbackTests(BaseTestCase):

    # TODO: user should only be able to see own feedback items
    def setUp(self):
        super(UserFeedbackTests, self).setUp()

        self.experiment = self.experiments['test-1']

        self.expected = dict(
            user=self.user,
            experiment=self.experiment,
            question='Test Question',
            answer='Test Answer',
            extra='Test Extra'
        )

    def test_require_authentication(self):
        """User feedback API should require authentication"""
        url = reverse('userfeedback-list')
        resp = self.client.get(url)
        self.assertEqual(403, resp.status_code)

    def test_list_and_get(self):
        """User feedback API should list feedback records"""
        self.client.login(username=self.username,
                          password=self.password)

        # First, ensure there's no feedback record yet
        data = self.jsonGet('userfeedback-list')
        self.assertEqual(0, len(data['results']))

        # Create a feedback record and ensure it exists now
        feedback = UserFeedback(**self.expected)
        feedback.save()

        data = self.jsonGet('userfeedback-list')
        self.assertEqual(1, len(data['results']))

        # Ensure the API list result matches expected feedback data
        result = data['results'][0]
        self.assertTrue('user' not in result)
        self.assertEqual('http://testserver/api/experiments/%s' %
                         self.experiments['test-1'].pk,
                         result['experiment'])
        for k in ('question', 'answer', 'extra'):
            self.assertEqual(self.expected[k], result[k])

        # Try fetching an individual detail URL and checking expected data
        result = self.jsonGet('userfeedback-detail', pk=feedback.pk)
        for k in ('question', 'answer', 'extra'):
            self.assertEqual(self.expected[k], result[k])

    def test_create(self):
        """User feedback API should accept POSTed feedback"""

        self.client.login(username=self.username,
                          password=self.password)

        # First, POST the feedback data
        url = reverse('userfeedback-list')
        resp = self.client.post(url, dict(
            experiment='http://testserver/api/experiments/%s' %
                       self.experiment.pk,
            question=self.expected['question'],
            answer=self.expected['answer'],
            extra=self.expected['extra']
        ), format='json')

        # Ensure the response to the POST details the new feedback record
        data = json.loads(str(resp.content, encoding='utf8'))
        self.assertEqual('http://testserver/api/experiments/%s' %
                         self.experiment.pk,
                         data['experiment'])
        for k in ('question', 'answer', 'extra'):
            self.assertEqual(self.expected[k], data[k])

        # The response to the POST should contain a URL that identifies an
        # existing UserFeedback model with expected attributes.
        feedback = UserFeedback.objects.get(pk=data['url'].split('/').pop())
        self.assertEqual(self.user.pk,
                         feedback.user.pk)
        self.assertEqual(self.experiment.pk,
                         feedback.experiment.pk)
        for k in ('question', 'answer', 'extra'):
            self.assertEqual(self.expected[k], getattr(feedback, k))

        # The new feedback record should appear in the list.
        data = self.jsonGet('userfeedback-list')
        self.assertEqual(1, len(data['results']))
        result = data['results'][0]
        self.assertTrue('user' not in result)
        self.assertEqual('http://testserver/api/experiments/%s' %
                         self.experiment.pk,
                         result['experiment'])
        for k in ('question', 'answer', 'extra'):
            self.assertEqual(self.expected[k], result[k])

    def test_feedback_privacy(self):
        """User feedback API should disallow users from seeing each other's submissions"""
        self.client.login(username=self.username,
                          password=self.password)

        url = reverse('userfeedback-list')
        resp = self.client.post(url, dict(
            experiment='http://testserver/api/experiments/%s' %
                       self.experiment.pk,
            question=self.expected['question'],
            answer=self.expected['answer'],
            extra=self.expected['extra']
        ), format='json')
        data = json.loads(str(resp.content, encoding='utf8'))

        feedback_url = data['url']

        self.client.login(username=self.username,
                          password=self.password)
        resp = self.client.get(feedback_url)
        self.assertEqual(200, resp.status_code)

        self.client.login(username=self.users['experimenttest-2'],
                          password='trustno2')
        resp = self.client.get(feedback_url)
        self.assertEqual(404, resp.status_code)
