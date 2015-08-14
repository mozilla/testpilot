from django.conf import settings as django_settings
from django.utils import translation


def settings(request):
    """
    Adds static-related context variables to the context.

    """
    return {'settings': django_settings}


def i18n(request):
    return {
        'LANGUAGES': django_settings.LANGUAGES,
        'LANG': translation.get_language(),
        'DIR': 'rtl' if translation.get_language_bidi() else 'ltr',
    }
