from django.db import models
from django.contrib.auth.models import User

from ..utils import HashedUploadTo


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

    natural_key.dependencies = ['auth.user']
