from unittest.mock import patch, Mock

import requests
import json

from django.conf import settings
from django.core.urlresolvers import reverse
from django.test import TestCase, Client
from django.test.utils import override_settings
from django.contrib.auth.models import User

from rest_framework import fields

from allauth.account.signals import user_signed_up
from allauth.socialaccount.signals import pre_social_login
from allauth.socialaccount.models import SocialLogin

from ..utils import gravatar_url
from ..experiments.models import (Experiment, UserInstallation)

from .models import UserProfile
from .signals import is_vouched_on_mozillians_org

import logging
logger = logging.getLogger(__name__)


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
                'installed': []
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
            result_data['installed'][0],
            {
                'experiment': 'http://testserver/api/experiments/%s' % experiment.pk,
                'addon_id': 'addon-1@example.com',
                'client_id': client_id,
                'features': {},
                'url':
                    'http://testserver/api/experiments/%s/installations/%s' %
                    (experiment.pk, client_id),
                'created': date_field.to_representation(installation.created),
                'modified': date_field.to_representation(installation.modified),
            }
        )


class InviteOnlyModeTests(TestCase):

    def setUp(self):
        self.username = 'newuserdoe2'
        self.password = 'trustno1'
        self.email = '%s@example.com' % self.username

        self.user = User.objects.create_user(
            username=self.username,
            email=self.email,
            password=self.password)

        UserProfile.objects.filter(user=self.user).delete()

    @patch('testpilot.users.signals.is_vouched_on_mozillians_org')
    @override_settings(ACCOUNT_INVITE_ONLY_MODE=True)
    def test_invite_only_signup(self, mock_vouched):
        """User.is_active should be False on signup with invite mode"""
        mock_vouched.return_value = False
        self.user.is_active = True
        user_signed_up.send(sender=self.user.__class__,
                            request=None,
                            user=self.user)

        self.assertEqual(False, self.user.is_active)

        profile = UserProfile.objects.get_profile(self.user)
        self.assertEqual(True, profile.invite_pending)

    @patch('testpilot.users.signals.is_vouched_on_mozillians_org')
    @override_settings(ACCOUNT_INVITE_ONLY_MODE=True,
                       ACCOUNT_AUTOACTIVATION_DOMAINS=('mozilla.com', 'hy.fr'))
    def test_invite_only_account_autoactivation_domains(self, mock_vouched):
        """Users with valid email address domains should be auto-activated"""
        mock_vouched.return_value = False
        self.user.is_active = True

        for email in ['someone@mozilla.com', 'someone@hy.fr']:

            self.user.email = email

            user_signed_up.send(sender=self.user.__class__,
                                request=None,
                                user=self.user)

            self.assertEqual(True, self.user.is_active)

            profile = UserProfile.objects.get_profile(self.user)
            self.assertEqual(False, profile.invite_pending,
                             'Invite not expected for {0}'.format(email))

            mock_vouched.assert_not_called()
            mock_vouched.reset_mock()

        for email in ['someone@aol.com', 'someone@mozilla.com@aol.com']:

            self.user.email = email

            user_signed_up.send(sender=self.user.__class__,
                                request=None,
                                user=self.user)

            self.assertEqual(False, self.user.is_active)

            profile = UserProfile.objects.get_profile(self.user)
            self.assertEqual(True, profile.invite_pending,
                             'Invite expected for {0}'.format(email))

            mock_vouched.assert_called_once_with(self.user)
            mock_vouched.reset_mock()

    @patch('testpilot.users.signals.is_vouched_on_mozillians_org')
    @override_settings(ACCOUNT_INVITE_ONLY_MODE=True)
    def test_invite_only_mozillians_autoactivation(self, mock_vouched):
        """Users vouched on mozillians.org should be auto-activated"""
        mock_vouched.return_value = True
        self.user.is_active = True
        self.user.email = 'job@bluth.com'

        user_signed_up.send(sender=self.user.__class__,
                            request=None,
                            user=self.user)

        self.assertEqual(True, self.user.is_active)

        profile = UserProfile.objects.get_profile(self.user)
        self.assertEqual(False, profile.invite_pending)

    @patch('testpilot.users.signals.is_vouched_on_mozillians_org')
    @override_settings(ACCOUNT_INVITE_ONLY_MODE=False)
    def test_open_signup(self, mock_vouched):
        """User.is_active should be True on signup without invite mode"""
        self.user.is_active = True
        user_signed_up.send(sender=self.user.__class__,
                            request=None,
                            user=self.user)
        self.assertEqual(True, self.user.is_active)

        profile = UserProfile.objects.get_profile(self.user)
        self.assertEqual(False, profile.invite_pending)

        mock_vouched.assert_not_called()

    @patch('requests.get')
    @override_settings(MOZILLIANS_API_KEY='8675309',
                       MOZILLIANS_API_BASE_URL='https://example.com')
    def test_is_vouched_on_mozillians_org_exception(self, mock_requests_get):
        """Check for vouched Mozillian membership should yield False on HTTP error"""
        email = 'bob@loblaw.com'
        mock_requests_get.side_effect = requests.exceptions.RequestException()
        result_vouched = is_vouched_on_mozillians_org(User(email=email))
        self.assertEqual(False, result_vouched)

    def test_is_vouched_on_mozillians_org(self):
        """Check for vouched Mozillian membership should use the API"""
        for (email, expected_vouched) in (('user1@exmaple.com', False),
                                          ('user2@example.com', True)):
            self._assert_is_vouched_on_mozillians(
                expected_vouched,
                email,
                {
                    'count': 1,
                    'next': None,
                    'previous': None,
                    'results': [
                        {
                            '_url': 'https://mozillians.org/api/v2/users/12345/',
                            'is_vouched': expected_vouched,
                            'username': 'user'
                        }
                    ]
                }
            )

    def test_is_vouched_on_mozillians_org_unknown_user(self):
        """Check for vouched Mozillian membership should properly handle unknown user"""
        self._assert_is_vouched_on_mozillians(
            False,
            'user3@example.com',
            {'count': 0, 'next': None, 'previous': None, 'results': []}
        )

    @patch('requests.get')
    @override_settings(MOZILLIANS_API_KEY='8675309',
                       MOZILLIANS_API_BASE_URL='https://example.com')
    def _assert_is_vouched_on_mozillians(self, expected_vouched, email,
                                         mock_api_data, mock_requests_get):

        expected_api_url = '%(base_url)s/users/?api-key=%(api_key)s&email=%(email)s' % dict(
            base_url='https://example.com',
            api_key='8675309',
            email=email
        )

        mock_json = Mock(return_value={
            'count': 1,
            'next': None,
            'previous': None,
            'results': [
                {
                    '_url': 'https://mozillians.org/api/v2/users/12345/',
                    'is_vouched': expected_vouched,
                    'username': 'user'
                }
            ]
        })

        mock_response = Mock()
        mock_response.json = mock_json

        mock_requests_get.return_value = mock_response

        result_vouched = is_vouched_on_mozillians_org(User(email=email))
        self.assertEqual(expected_vouched, result_vouched)

        mock_json.assert_called_with()
        mock_requests_get.assert_called_with(expected_api_url)

    @patch('testpilot.users.signals.is_vouched_on_mozillians_org')
    @override_settings(ACCOUNT_INVITE_ONLY_MODE=True)
    def test_auto_activiate_if_qualified_after_signup(self, mock_vouched):
        """Users qualified after sign-up should be auto-activated on sign-in"""
        mock_vouched.return_value = False

        sociallogin = SocialLogin(user=self.user)

        self.user.is_active = True
        user_signed_up.send(sender=self.user.__class__,
                            request=None,
                            user=self.user)

        self.assertEqual(False, self.user.is_active)

        pre_social_login.send(sender=SocialLogin,
                              request=None,
                              sociallogin=sociallogin)

        self.assertEqual(False, self.user.is_active)

        profile = UserProfile.objects.get_profile(self.user)
        self.assertEqual(True, profile.invite_pending)

        mock_vouched.return_value = True

        pre_social_login.send(sender=SocialLogin,
                              request=None,
                              sociallogin=sociallogin)

        self.assertEqual(True, self.user.is_active)

        profile = UserProfile.objects.get_profile(self.user)
        self.assertEqual(False, profile.invite_pending)

    @patch('testpilot.users.signals.is_vouched_on_mozillians_org')
    def test_auto_activate_after_settings_change(self, mock_vouched):
        """Pending invitations should be auto-activated on sign-in after invite mode turned off"""
        mock_vouched.return_value = False
        sociallogin = SocialLogin(user=self.user)

        with self.settings(ACCOUNT_INVITE_ONLY_MODE=True):

            self.user.is_active = True
            user_signed_up.send(sender=self.user.__class__,
                                request=None,
                                user=self.user)

            self.assertEqual(False, self.user.is_active)

            profile = UserProfile.objects.get_profile(self.user)
            self.assertEqual(True, profile.invite_pending)

            pre_social_login.send(sender=SocialLogin,
                                  request=None,
                                  sociallogin=sociallogin)

            self.assertEqual(False, self.user.is_active)

            profile = UserProfile.objects.get_profile(self.user)
            self.assertEqual(True, profile.invite_pending)

        with self.settings(ACCOUNT_INVITE_ONLY_MODE=False):

            pre_social_login.send(sender=SocialLogin,
                                  request=None,
                                  sociallogin=sociallogin)

            self.assertEqual(True, self.user.is_active)

            profile = UserProfile.objects.get_profile(self.user)
            self.assertEqual(False, profile.invite_pending)
