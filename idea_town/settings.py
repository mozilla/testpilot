"""
Django settings for idea_town project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

import os

import dj_database_url
from decouple import Csv, config

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

ROOT_URLCONF = 'idea_town.urls'

WSGI_APPLICATION = 'idea_town.wsgi.application'

SITE_ID = 1

ADDON_URL = config(
    'ADDON_URL',
    default='https://example.com/configure-your-addon-url')

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', cast=bool)

ALLOWED_HOSTS = config('ALLOWED_HOSTS', cast=Csv())

# Credentials used to create the initial superuser account
INITIAL_ADMIN_USERNAME = config('INITIAL_ADMIN_USERNAME', default=None)
INITIAL_ADMIN_PASSWORD = config('INITIAL_ADMIN_PASSWORD', default=None)
INITIAL_ADMIN_EMAIL = config('INITIAL_ADMIN_EMAIL', default=None)

# Application definition

INSTALLED_APPS = [
    # Project specific apps
    'idea_town.base',
    'idea_town.frontend',
    'idea_town.users',
    'idea_town.experiments',

    # Third party apps
    'django_jinja',
    'django_cleanup',

    'rest_framework',
    'storages',
    'markupfield',

    # FxA auth handling
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'idea_town.users.providers.fxa',

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

STATIC_ROOT = config('STATIC_ROOT', default=os.path.join(BASE_DIR, 'static'))
STATIC_URL = config('STATIC_URL', '/static/')
STATICFILES_DIRS = [
]
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
            'match_regex': r'^(?!(admin|rest_framework)/.*)',
            'match_extension': '.html',
            'newstyle_gettext': True,
            'context_processors': [
                'idea_town.base.context_processors.settings',
                'idea_town.base.context_processors.i18n',
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
    },
    'handlers': {
        'null': {
            'class': 'logging.NullHandler',
        },
        'console': {
            'level': 'DEBUG',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'verbose'
        },
        'mail_admins': {
            'level': 'ERROR',
            'filters': ['require_debug_false'],
            'class': 'django.utils.log.AdminEmailHandler'
        },
        'logfile': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'DEBUG',
            'maxBytes': config('DJANGO_LOG_MAXBYTES', default=16 * 1024 * 1024, cast=int),
            'backupCount': config('DJANGO_LOG_BACKUP_COUNT', default=2, cast=int),
            'filename': config('DJANGO_LOG_FILENAME', default='./django.log'),
            'formatter': config('DJANGO_LOG_FORMATTER', default='verbose')
        },
    },
    'loggers': {
        'idea_town': {
            'handlers': ['console', 'logfile'],
            'level': config('DJANGO_LOG_LEVEL', default='INFO'),
            'propagate': True,
        },
        'django': {
            'handlers': ['console', 'logfile'],
        },
        'django.request': {
            'handlers': ['mail_admins', 'console', 'logfile'],
            'level': 'ERROR',
            'propagate': False,
        },
        'django.security': {
            'handlers': ['mail_admins', 'console', 'logfile'],
            'level': 'ERROR',
            'propagate': False,
        },
        'py.warnings': {
            'handlers': ['console', 'logfile'],
        },
    }
}
