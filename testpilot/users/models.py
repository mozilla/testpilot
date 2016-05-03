from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

from ..utils import HashedUploadTo

import requests

avatar_upload_to = HashedUploadTo('avatar')


class UserProfileManager(models.Manager):

    def get_profile(self, user):
        """Get a profile for a user, creating a blank one if necessary"""
        (profile, created) = self.get_or_create(user=user)
        return profile

    def get_by_natural_key(self, username):
        user = User.objects.get_by_natural_key(username)
        return self.get_profile(user)


class UserProfile(models.Model):
    """Profile model for additional user details"""
    objects = UserProfileManager()

    user = models.OneToOneField(User, related_name='profile')
    display_name = models.CharField(max_length=256, blank=True)
    title = models.CharField(max_length=256, blank=True)
    avatar = models.ImageField(upload_to=avatar_upload_to, blank=True)

    invite_pending = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def natural_key(self):
        return self.user.natural_key()

    def unsubscribe(self):
        """Unsubscribe this email from basket. Lookup-user call for token, then the unsubscribe"""
        try:
            if settings.BASKET_API_KEY is None:
                return 'API Key not found'
            email = self.user.email
            url = settings.BASKET_LOOKUP_USER_URL

            params = {'api_key': settings.BASKET_API_KEY, 'email': email}
            r = requests.get(url, params=params)
            resp = r.json()

            if 'token' not in resp:
                return'email not found in basket'
            user_token = resp['token']

            url = settings.BASKET_UNSUBSCRIBE_URL + user_token + '/'
            payload = {'newsletters': 'test-pilot', 'email': email}
            r = requests.post(url, data=payload)
            resp = r.json()

            return resp
        except Exception as e:
            return e

    natural_key.dependencies = ['auth.user']
