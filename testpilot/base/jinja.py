import base64
import hashlib
import json

from django.conf import settings
from django.core.cache import cache
from django.contrib.staticfiles.storage import staticfiles_storage
from django.contrib.staticfiles import finders

from waffle.views import wafflejs
from constance import config as constance_config

import jinja2
from jinja2.ext import Extension


DEFAULT_CHUNK_SIZE = 64 * 2 ** 10


def _hash_content(content):
    """Build a sha384 hash for subresource integrity use"""
    hash = hashlib.sha384()
    hash.update(content)
    hash_base64 = base64.b64encode(hash.digest()).decode()
    return 'sha384-{}'.format(hash_base64)


@jinja2.contextfunction
def staticintegrity(context, name):
    """Hash a local static file for subresource integrity"""
    if settings.DEBUG:
        # In DEBUG, static files are scattered around and need to be found.
        path = finders.find(name)
    else:
        # Otherwise, we can just look in the static root
        path = staticfiles_storage.path(name)

    key = 'staticintegrity-%s' % path
    out = cache.get(key)

    if out is None:
        with open(path, 'rb') as content_file:
            out = _hash_content(content_file.read())
        cache.set(key, out)

    return out


@jinja2.contextfunction
def urlintegrity(context, url):
    """Grab a pre-defined subresource hash for a URL from settings"""
    url_hashes = settings.URL_INTEGRITY_HASHES
    try:
        url_hashes_overrides = json.loads(getattr(
            constance_config, 'URL_INTEGRITY_HASHES_OVERRIDES', '{}'))
    except:
        url_hashes_overrides = {}

    # Try the overrides first, then fall back to straight settings
    return url_hashes_overrides.get(url, url_hashes.get(url, ''))


# TODO: Would be nice to replace this waffle-specific helper with something
# that could produce a hash with a sub-request to any view.
@jinja2.contextfunction
def waffleintegrity(context, request):
    """Hash the content of /wafflejs for subresource integrity"""
    return _hash_content(wafflejs(request).content)


class TestPilotExtension(Extension):
    def __init__(self, environment):
        environment.globals['staticintegrity'] = staticintegrity
        environment.globals['urlintegrity'] = urlintegrity
        environment.globals['waffleintegrity'] = waffleintegrity
