from django.test import TestCase
from django.contrib.auth.models import User

from .models import UserProfile

from testpilot.utils import cleanup_nonstaff_users
from testpilot.experiments.models import Experiment

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


class UserDataCleanupMigrationTests(TestCase):

    def setUp(self):
        User.objects.all().delete()

        self.super_user = User.objects.create_user(username="admin")
        self.super_user.is_superuser = True
        self.super_user.save()

        self.staff_user = User.objects.create_user(username="staffuser")
        self.staff_user.is_staff = True
        self.staff_user.save()

        self.contributor_user = User.objects.create_user(username="contributor")
        self.random_user = User.objects.create_user(username="random1")

        (self.experiment, created) = (Experiment.objects.language().fallbacks('en')
                                      .get_or_create(slug='foo', title='foo'))
        self.experiment.contributors.add(self.contributor_user)

    def test_nonstaff_user_cleanup(self):
        cleanup_nonstaff_users(User, Experiment.objects.language().fallbacks('en').all())
        self.assertEqual(0, User.objects.filter(is_staff=False,
                                                is_superuser=False).count())
        self.assertEqual(1, User.objects.filter(pk=self.super_user.pk).count())
        self.assertEqual(1, User.objects.filter(pk=self.staff_user.pk).count())
        self.assertEqual(1, User.objects.filter(pk=self.contributor_user.pk).count())
        self.assertEqual(0, User.objects.filter(pk=self.random_user.pk).count())
