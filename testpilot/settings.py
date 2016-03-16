"""
Django settings for testpilot project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

import os

import dj_database_url
from decouple import Csv, config
from os.path import abspath
from django.utils.functional import lazy
from pathlib import Path

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

# ROOT path of the project. A pathlib.Path object.
ROOT_PATH = Path(__file__).resolve().parents[1]
ROOT = str(ROOT_PATH)


def path(*args):
    return abspath(str(ROOT_PATH.joinpath(*args)))


ROOT_URLCONF = 'testpilot.urls'

WSGI_APPLICATION = 'testpilot.wsgi.application'

SITE_ID = 1

ADDON_URL = config(
    'ADDON_URL',
    default='/static/addon/addon.xpi')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', cast=bool)
DEV = config('DEV', cast=bool, default=DEBUG)
PROD = config('PROD', cast=bool, default=not DEBUG)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())

if DEBUG:
    import mimetypes
    mimetypes.add_type("application/x-xpinstall", ".xpi", True)
    mimetypes.add_type("text/rdf", ".rdf", True)

# Credentials used to create the initial superuser account
INITIAL_ADMIN_USERNAME = config('INITIAL_ADMIN_USERNAME', default=None)
INITIAL_ADMIN_PASSWORD = config('INITIAL_ADMIN_PASSWORD', default=None)
INITIAL_ADMIN_EMAIL = config('INITIAL_ADMIN_EMAIL', default=None)

# Application definition

INSTALLED_APPS = [
    # Project specific apps
    'testpilot.base',
    'testpilot.frontend',
    'testpilot.users',
    'testpilot.experiments',

    # Third party apps
    'django_jinja',
    'django_cleanup',

    'colorfield',
    'rest_framework',
    'storages',
    'markupfield',
    'product_details',
    'hvad',

    # FxA auth handling
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'testpilot.users.providers.fxa',

    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.staticfiles',
]

for app in config('EXTRA_APPS', default='', cast=Csv()):
    INSTALLED_APPS.append(app)


MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)


AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by e-mail
    'allauth.account.auth_backends.AuthenticationBackend',
)

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ],
    'PAGE_SIZE': 10
}

SOCIALACCOUNT_PROVIDERS = {
    'fxa': dict(
        ACCESS_TOKEN_URL=config(
            'FXA_ACCESS_TOKEN_URL',
            default='https://oauth.accounts.firefox.com/v1/token'),
        AUTHORIZE_URL=config(
            'FXA_AUTHORIZE_URL',
            default='https://oauth.accounts.firefox.com/v1/authorization'),
        PROFILE_URL=config(
            'FXA_PROFILE_URL',
            default='https://profile.accounts.firefox.com/v1/profile'),
        SCOPE=["profile"]
    )
}

FXA_CLIENT_ID = config('FXA_CLIENT_ID', default=None)

FXA_SECRET_KEY = config('FXA_SECRET_KEY', default=None)

SOCIALACCOUNT_AUTO_SIGNUP = True

SOCIALACCOUNT_EMAIL_VERIFICATION = False

ACCOUNT_EMAIL_VERIFICATION = False

ACCOUNT_INVITE_ONLY_MODE = config('ACCOUNT_INVITE_ONLY_MODE', default=True, cast=bool)

ACCOUNT_AUTOACTIVATION_DOMAINS = config(
    'ACCOUNT_AUTOACTIVATION_DOMAINS', default='mozilla.com',
    cast=lambda domains: tuple('@{0}'.format(s.strip()) for s in domains.split(',')))


MOZILLIANS_API_KEY = config('MOZILLIANS_API_KEY', default=None)

MOZILLIANS_API_BASE_URL = config('MOZILLIANS_API_BASE_URL',
                                 default='https://mozillians.org/api/v2')

DATADOG_KEYS = {
    'api_key': config('DATADOG_API_KEY', default=None),
    'app_key': config('DATADOG_APP_KEY', default=None)
}

# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases
RDS_DATABASE_TYPE = config('RDS_DATABASE_TYPE', default=None)
if RDS_DATABASE_TYPE is None:
    DATABASES = {
        'default': config('DATABASE_URL', cast=dj_database_url.parse)
    }
else:
    db_types = dict(
        postgres='django.db.backends.postgresql_psycopg2',
        mysql='django.db.backends.mysql'
    )
    db_types_default = 'postgres'
    DATABASES = {
        'default': {
            'ENGINE': db_types.get(RDS_DATABASE_TYPE,
                                   db_types[db_types_default]),
            # Note: These env vars are automatically supplied by AWS/EB
            'NAME': config('RDS_DB_NAME'),
            'USER': config('RDS_USERNAME'),
            'PASSWORD': config('RDS_PASSWORD'),
            'HOST': config('RDS_HOSTNAME'),
            'PORT': config('RDS_PORT'),
        }
    }

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = config('LANGUAGE_CODE', default='en-us')

TIME_ZONE = config('TIME_ZONE', default='UTC')

USE_I18N = config('USE_I18N', default=True, cast=bool)

USE_L10N = config('USE_L10N', default=True, cast=bool)

USE_TZ = config('USE_TZ', default=True, cast=bool)

# Tells the product_details module where to find our local JSON files.
# This ultimately controls how LANGUAGES are constructed.
# PROD_DETAILS_CACHE_NAME = 'product-details'
# PROD_DETAILS_CACHE_TIMEOUT = 60 * 15  # 15 min
default_pdstorage = 'PDFileStorage'  # 'PDDatabaseStorage' if PROD else 'PDFileStorage'
PROD_DETAILS_STORAGE = config('PROD_DETAILS_STORAGE',
                              default='product_details.storage.' + default_pdstorage)

# Accepted locales
PROD_LANGUAGES = ('ach', 'af', 'an', 'ar', 'as', 'ast', 'az', 'be', 'bg',
                  'bn-BD', 'bn-IN', 'br', 'brx', 'bs', 'ca', 'cak', 'cs',
                  'cy', 'da', 'de', 'dsb', 'ee', 'el', 'en-GB', 'en-US',
                  'en-ZA', 'eo', 'es-AR', 'es-CL', 'es-ES', 'es-MX', 'et',
                  'eu', 'fa', 'ff', 'fi', 'fr', 'fy-NL', 'ga-IE', 'gd',
                  'gl', 'gu-IN', 'ha', 'he', 'hi-IN', 'hr', 'hsb', 'hu',
                  'hy-AM', 'id', 'ig', 'is', 'it', 'ja', 'ja-JP-mac',
                  'ka', 'kk', 'km', 'kn', 'ko', 'lij', 'ln', 'lt', 'lv',
                  'mai', 'mk', 'ml', 'mr', 'ms', 'my', 'nb-NO', 'nl',
                  'nn-NO', 'oc', 'or', 'pa-IN', 'pl', 'pt-BR', 'pt-PT',
                  'rm', 'ro', 'ru', 'sat', 'si', 'sk', 'sl', 'son', 'sq',
                  'sr', 'sv-SE', 'sw', 'ta', 'te', 'th', 'tr', 'uk', 'ur',
                  'uz', 'vi', 'wo', 'xh', 'yo', 'zh-CN', 'zh-TW', 'zu')

LOCALES_PATH = ROOT_PATH / 'locales'

LOCALE_PATHS = (
    str(LOCALES_PATH),
)


def get_dev_languages():
    try:
        return [lang.name for lang in LOCALES_PATH.iterdir()
                if lang.is_dir() and lang.name != 'templates']
    except OSError:
        # no locale dir
        return list(PROD_LANGUAGES)


DEV_LANGUAGES = get_dev_languages()
if 'en-US' not in DEV_LANGUAGES:
    DEV_LANGUAGES.append('en-US')

# Map short locale names to long, preferred locale names. This
# will be used in urlresolvers to determine the
# best-matching locale from the user's Accept-Language header.
CANONICAL_LOCALES = {
    'en': 'en-US',
    'es': 'es-ES',
    'ja-jp-mac': 'ja',
    'no': 'nb-NO',
    'pt': 'pt-BR',
    'sv': 'sv-SE',
}

# Unlocalized pages are usually redirected to the English (en-US) equivalent,
# but sometimes it would be better to offer another locale as fallback. This map
# specifies such cases.
FALLBACK_LOCALES = {
    'es-AR': 'es-ES',
    'es-CL': 'es-ES',
    'es-MX': 'es-ES',
}


def lazy_lang_url_map():
    from django.conf import settings

    langs = settings.DEV_LANGUAGES if settings.DEV else settings.PROD_LANGUAGES
    return {i.lower(): i for i in langs}


# Override Django's built-in with our native names
def lazy_langs():
    from django.conf import settings
    from product_details import product_details

    langs = DEV_LANGUAGES if settings.DEV else settings.PROD_LANGUAGES
    return [(lang.lower(), product_details.languages[lang]['native'])
            for lang in langs if lang in product_details.languages]


LANGUAGE_URL_MAP = lazy(lazy_lang_url_map, dict)()
LANGUAGES = lazy(lazy_langs, list)()

STATIC_ROOT = config('STATIC_ROOT', default=os.path.join(BASE_DIR, 'static'))
STATIC_URL = config('STATIC_URL', '/static/')
STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

DEFAULT_FILE_STORAGE = config(
    'DEFAULT_FILE_STORAGE',
    default='django.core.files.storage.FileSystemStorage')

if DEFAULT_FILE_STORAGE == 'storages.backends.s3boto.S3BotoStorage':
    AWS_ACCESS_KEY_ID = config('AWS_ACCESS_KEY_ID', default=None)
    AWS_SECRET_ACCESS_KEY = config('AWS_SECRET_ACCESS_KEY', default=None)
    AWS_STORAGE_BUCKET_NAME = config('AWS_STORAGE_BUCKET_NAME')
    MEDIA_URL = config('MEDIA_URL')
else:
    MEDIA_ROOT = config('MEDIA_ROOT', default=os.path.join(BASE_DIR, 'media'))
    MEDIA_URL = config('MEDIA_URL', '/media/')

SESSION_COOKIE_SECURE = config('SESSION_COOKIE_SECURE', default=not DEBUG, cast=bool)

FIVE_YEARS_IN_SECONDS = 60 * 60 * 24 * 365 * 5
SESSION_COOKIE_AGE = FIVE_YEARS_IN_SECONDS

TEMPLATES = [
    {
        'BACKEND': 'django_jinja.backend.Jinja2',
        'APP_DIRS': True,
        'OPTIONS': {
            'match_regex': r'^(?!(admin|registration|rest_framework)/.*)',
            'match_extension': '.html',
            'newstyle_gettext': True,
            'context_processors': [
                'testpilot.base.context_processors.settings',
                'testpilot.base.context_processors.i18n',
                'django.template.context_processors.media',
            ],
        }
    },
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.template.context_processors.request',
                'django.contrib.messages.context_processors.messages',

                # `allauth` needs this from django
                'django.template.context_processors.request',

            ],
        }
    },
]

# Django-CSP
CSP_DEFAULT_SRC = (
    "'self'",
)
CSP_FONT_SRC = (
    "'self'",
    'http://*.mozilla.net',
    'https://*.mozilla.net',
    'http://*.mozilla.org',
    'https://*.mozilla.org',
)
CSP_IMG_SRC = (
    "'self'",
    'http://*.mozilla.net',
    'https://*.mozilla.net',
    'http://*.mozilla.org',
    'https://*.mozilla.org',
)
CSP_SCRIPT_SRC = (
    "'self'",
    'http://*.mozilla.org',
    'https://*.mozilla.org',
    'http://*.mozilla.net',
    'https://*.mozilla.net',
)
CSP_STYLE_SRC = (
    "'self'",
    "'unsafe-inline'",
    'http://*.mozilla.org',
    'https://*.mozilla.org',
    'http://*.mozilla.net',
    'https://*.mozilla.net',
)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse',
        },
        'require_debug_true': {
            '()': 'django.utils.log.RequireDebugTrue',
        },
    },
    'formatters': {
        'simple': {
            'format': '[%(asctime)s] %(levelname)s %(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
        'verbose': {
            'format': '[%(asctime)s] %(levelname)s [%(name)s.%(funcName)s:%(lineno)d] %(message)s',
            'datefmt': '%Y-%m-%d %H:%M:%S'
        },
        'json': {
            '()': 'testpilot.base.logging.JsonLogFormatter',
            'logger_name': 'TestPilot'
        }
    },
    'handlers': {
        'null': {
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': config('DJANGO_LOG_FORMAT', default='json')
        },
    },
    'loggers': {
        'testpilot': {
            'handlers': ['console'],
            'level': config('DJANGO_LOG_LEVEL', default='INFO'),
            'propagate': True,
        },
        'django': {
            'handlers': ['console'],
        },
        'django.request': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'django.security': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'py.warnings': {
            'handlers': ['console'],
        },
    }
}
