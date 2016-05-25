"""
Customizations to the signup & login process for Test Pilot.

See also: http://django-allauth.readthedocs.org/en/latest/signals.html
"""
from django.dispatch import receiver

from allauth.account.signals import user_signed_up

import logging


@receiver(user_signed_up)
def invite_only_signup_handler(sender, **kwargs):
    """
    Sent when a user signs up for an account.
    """
    user = kwargs['user']
    logger = logging.getLogger('testpilot.newuser')
    logger.info('', extra={'uid': user.id})
