"""
Customizations to the signup & login process for Idea Town.

See also: http://django-allauth.readthedocs.org/en/latest/signals.html
"""
from django.conf import settings
from django.dispatch import receiver

from allauth.account.signals import user_signed_up
from allauth.socialaccount.signals import pre_social_login

import requests

from .models import UserProfile

import logging
logger = logging.getLogger(__name__)


def is_qualified_for_autoactivation(user):
    """Check if this user is qualified to be auto-activated"""
    if user.email.endswith('@mozilla.com'):
        return True
    if is_vouched_on_mozillians_org(user):
        return True
    return False


def is_vouched_on_mozillians_org(user):
    """Check if this user is a vouched member of mozillians.org"""
    try:
        # See: http://mozillians.readthedocs.org/en/latest/api/apiv2/api-users.html
        api_url = '%(base_url)s/users/?api-key=%(api_key)s&email=%(email)s' % dict(
            base_url=settings.MOZILLIANS_API_BASE_URL,
            api_key=settings.MOZILLIANS_API_KEY,
            email=user.email
        )
        data = requests.get(api_url).json()

        count = data.get('count', 0)
        if count == 0:
            return False

        result = data['results'][0]
        if not result['is_vouched']:
            return False

        return True

    except requests.exceptions.RequestException:
        # Punt on all request errors and just claim not vouched
        return False


@receiver(user_signed_up)
def invite_only_signup_handler(sender, **kwargs):
    """
    Sent when a user signs up for an account.
    """
    if not settings.ACCOUNT_INVITE_ONLY_MODE:
        # Bail, if we're in open signup mode
        return

    user = kwargs['user']

    if not is_qualified_for_autoactivation(user):

        # User is not qualified for auto-activation, so set inactive on signup
        user.is_active = False
        user.save()

        # Set a flag indicating that this user has requested an invitation
        profile = UserProfile.objects.get_profile(user)
        profile.invite_pending = True
        profile.save()


@receiver(pre_social_login)
def invite_only_pre_social_login_handler(sender, **kwargs):
    """
    Sent after a user successfully authenticates via a social provider, but
    before the login is fully processed.
    """
    sociallogin = kwargs['sociallogin']
    user = sociallogin.user

    if not user.pk:
        # Bail, if this user is new - we're still in the middle of sign up.
        return

    # Does this user have a pending invitation?
    profile = UserProfile.objects.get_profile(user)
    if profile.invite_pending:

        if (settings.ACCOUNT_INVITE_ONLY_MODE and
                not is_qualified_for_autoactivation(user)):
            # Site is invite-only and user is not qualified for
            # auto-activation, so bail.
            return

        # At this point, either the site is no longer invite-only or this user
        # has become qualified for auto-activation. So, activate & remove
        # pending invitation status.
        user.is_active = True
        user.save()
        profile.invite_pending = False
        profile.save()
