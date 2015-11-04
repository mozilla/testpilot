"""
Customizations to the signup & login process for Idea Town.

See also: http://django-allauth.readthedocs.org/en/latest/signals.html
"""
from django.conf import settings

from django.dispatch import receiver
from allauth.account.signals import user_signed_up
from allauth.socialaccount.signals import pre_social_login

from .models import UserProfile

import logging
logger = logging.getLogger(__name__)


def is_qualified_for_autoactivation(user):

    if user.email.endswith('@mozilla.com'):
        return True

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

        if settings.ACCOUNT_INVITE_ONLY_MODE:
            # If we're in invitation-only mode, and this user is inactive & has
            # requested an invitation, check to see if they've qualified for an
            # auto-activation since they signed up.
            is_qualified = is_qualified_for_autoactivation(user)
            pass

        else:
            # If this user had previously requested an invitation, but we're out of
            # invite-only mode, clear the invitation request & set as active.
            user.is_active = True
            user.save()
            profile.invite_pending = False
            profile.save()
