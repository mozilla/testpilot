from unittest.mock import patch, Mock

from requests.exceptions import Timeout
import json

from django.conf import settings
from django.core.urlresolvers import reverse
from django.test import TestCase, Client
from django.test.utils import override_settings
from django.contrib.auth.models import User

from rest_framework import fields

from testfixtures import LogCapture

from allauth.account.signals import user_signed_up

from mozilla_cloud_services_logger.formatters import JsonLogFormatter

from ..utils import gravatar_url
from ..experiments.models import (Experiment, UserInstallation)

from .models import UserProfile

import logging
logger = logging.getLogger(__name__)


EXPECTED_BASKET_API_KEY = 'baskethooray',
EXPECTED_BASKET_LOOKUP_USER_URL = 'https://example.com/news/lookup-user/'
EXPECTED_BASKET_UNSUBSCRIBE_URL = 'https://example.com/news/unsubscribe/'
EXPECTED_BASKET_SUBSCRIBE_URL = 'https://example.com/news/subscribe/'


class UserProfileTests(TestCase):

    maxDiff = None

    def setUp(self):
        self.username = 'johndoe2'
        self.password = 'trustno1'
        self.email = '%s@example.com' % self.username

        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password)

        UserProfile.objects.filter(user=self.user).delete()

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

    @override_settings(BASKET_API_KEY=None)
    def test_unsubscribe_missing_api_key(self):
        """Newsletter unsubscribe should fail gracefully on missing API key"""
        profile = UserProfile.objects.get_profile(self.user)
        result = profile.unsubscribe()
        self.assertEqual('API Key not found', result)

    @patch('requests.get')
    @patch('requests.post')
    @override_settings(
        BASKET_API_KEY=EXPECTED_BASKET_API_KEY,
        BASKET_LOOKUP_USER_URL=EXPECTED_BASKET_LOOKUP_USER_URL,
        BASKET_UNSUBSCRIBE_URL=EXPECTED_BASKET_UNSUBSCRIBE_URL,
        BASKET_SUBSCRIBE_URL=EXPECTED_BASKET_SUBSCRIBE_URL)
    def test_unsubscribe(self, mock_requests_post, mock_requests_get):
        """Newsletter unsubscribe should call Basket API as expected"""
        # http://basket.readthedocs.io/newsletter_api.html#news-lookup-user
        expected_get_params = {
            'api_key': EXPECTED_BASKET_API_KEY,
            'email': self.user.email
        }
        expected_user_token = '8675309'
        mock_get_response = Mock()
        mock_get_json = Mock(return_value={
            'token': expected_user_token
        })
        mock_get_response.json = mock_get_json
        mock_requests_get.return_value = mock_get_response

        # http://basket.readthedocs.io/newsletter_api.html#news-unsubscribe
        expected_post_data = {
            'newsletters': 'test-pilot',
            'email': self.user.email
        }
        mock_post_response = Mock()
        mock_post_json = Mock(return_value={'status': 'ok'})
        mock_post_response.json = mock_post_json
        mock_requests_post.return_value = mock_post_response

        profile = UserProfile.objects.get_profile(self.user)
        profile.unsubscribe()

        mock_requests_get.assert_called_with(EXPECTED_BASKET_LOOKUP_USER_URL,
                                             params=expected_get_params)
        mock_get_json.assert_called_with()

        expected_url = '%s%s/' % (EXPECTED_BASKET_UNSUBSCRIBE_URL,
                                  expected_user_token)
        mock_requests_post.assert_called_with(expected_url,
                                              data=expected_post_data)
        mock_post_json.assert_called_with()

    @patch('requests.get')
    @patch('requests.post')
    @override_settings(
        BASKET_API_KEY=EXPECTED_BASKET_API_KEY,
        BASKET_LOOKUP_USER_URL=EXPECTED_BASKET_LOOKUP_USER_URL,
        BASKET_UNSUBSCRIBE_URL=EXPECTED_BASKET_UNSUBSCRIBE_URL,
        BASKET_SUBSCRIBE_URL=EXPECTED_BASKET_SUBSCRIBE_URL)
    def test_unsubscribe_lookup_error(self, mock_requests_post, mock_requests_get):
        """Newsletter unsubscribe should report lookup failure"""
        # http://basket.readthedocs.io/newsletter_api.html#news-lookup-user
        expected_get_params = {
            'api_key': EXPECTED_BASKET_API_KEY,
            'email': self.user.email
        }
        mock_get_response = Mock()
        mock_get_json = Mock(return_value={
            'status': 'error',
            'desc': 'user not found'
        })
        mock_get_response.json = mock_get_json
        mock_requests_get.return_value = mock_get_response

        # http://basket.readthedocs.io/newsletter_api.html#news-unsubscribe
        mock_post_response = Mock()
        mock_post_json = Mock()
        mock_post_response.json = mock_post_json
        mock_requests_post.return_value = mock_post_response

        profile = UserProfile.objects.get_profile(self.user)
        result = profile.unsubscribe()

        self.assertEqual('email not found in basket', result)

        mock_requests_get.assert_called_with(EXPECTED_BASKET_LOOKUP_USER_URL,
                                             params=expected_get_params)
        mock_get_json.assert_called_with()

        self.assertFalse(mock_requests_post.called)
        self.assertFalse(mock_post_json.called)

    @patch('requests.get')
    @patch('requests.post')
    @override_settings(
        BASKET_API_KEY=EXPECTED_BASKET_API_KEY,
        BASKET_LOOKUP_USER_URL=EXPECTED_BASKET_LOOKUP_USER_URL,
        BASKET_UNSUBSCRIBE_URL=EXPECTED_BASKET_UNSUBSCRIBE_URL,
        BASKET_SUBSCRIBE_URL=EXPECTED_BASKET_SUBSCRIBE_URL)
    def test_unsubscribe_request_exception(self, mock_requests_post, mock_requests_get):
        """Newsletter unsubscribe should gracefully handle request exceptions"""
        expected_get_params = {
            'api_key': EXPECTED_BASKET_API_KEY,
            'email': self.user.email
        }
        mock_get_response = Mock()
        mock_get_json = Mock(return_value={})
        mock_get_response.json = mock_get_json

        expected_result = Timeout()

        def raise_request_exception(*args, **kwargs):
            raise expected_result

        mock_requests_get.side_effect = raise_request_exception
        mock_requests_get.return_value = mock_get_response

        mock_post_response = Mock()
        mock_post_json = Mock()
        mock_post_response.json = mock_post_json
        mock_requests_post.return_value = mock_post_response

        profile = UserProfile.objects.get_profile(self.user)
        result = profile.unsubscribe()

        self.assertEqual(expected_result, result)

        mock_requests_get.assert_called_with(EXPECTED_BASKET_LOOKUP_USER_URL,
                                             params=expected_get_params)
        self.assertFalse(mock_get_json.called)
        self.assertFalse(mock_requests_post.called)
        self.assertFalse(mock_post_json.called)


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
                    description="This is a test",
                    addon_id="addon-%s@example.com" % idx
                )) for idx in range(1, 4)))

        cls.addonData = {
            'name': 'Test Pilot',
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
                'installed': {}
            }
        )

        experiment = self.experiments['test-1']
        client_id = '8675309'

        installation = UserInstallation.objects.create(
            experiment=experiment, user=self.user, client_id=client_id)

        # HACK: Use a rest framework field to format dates as expected
        date_field = fields.DateTimeField()

        resp = self.client.get(self.url)
        result_data = json.loads(str(resp.content, 'utf-8'))

        self.assertEqual(len(result_data['installed']), 1)
        self.assertDictEqual(
            result_data['installed'],
            {
                'addon-1@example.com': {
                    'experiment': 'http://testserver/api/experiments/%s' % experiment.pk,
                    'addon_id': 'addon-1@example.com',
                    'client_id': client_id,
                    'url':
                    'http://testserver/api/experiments/%s/installations/%s' %
                    (experiment.pk, client_id),
                    'created': date_field.to_representation(installation.created),
                    'modified': date_field.to_representation(installation.modified),
                }
            }
        )


class UserSignupTests(TestCase):

    def setUp(self):
        self.handler = LogCapture()
        self.formatter = JsonLogFormatter(logger_name='testpilot.newuser')

        self.username = 'newuserdoe2'
        self.password = 'trustno1'
        self.email = '%s@example.com' % self.username

        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password)

        UserProfile.objects.filter(user=self.user).delete()

    def tearDown(self):
        self.handler.uninstall()

    def test_newuser_log_event(self):
        """testpilot.newuser log event should be emitted on signup"""
        self.user.is_active = True
        user_signed_up.send(sender=self.user.__class__,
                            request=None,
                            user=self.user)

        self.assertEquals(len(self.handler.records), 1)
        record = self.handler.records[0]

        details = json.loads(self.formatter.format(record))
        self.assertTrue('Fields' in details)

        fields = details['Fields']
        self.assertEqual(fields['uid'], self.user.id)
