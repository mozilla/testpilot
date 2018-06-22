import os

import pytest
import requests
from requests.packages.urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter


@pytest.fixture
def capabilities(capabilities):
    capabilities['marionette'] = True
    capabilities['acceptInsecureCerts'] = True
    return capabilities


@pytest.fixture
def firefox_options(firefox_options):
    firefox_options.set_preference(
        'extensions.install.requireBuiltInCerts', False)
    firefox_options.set_preference('ui.popup.disable_autohide', True)
    firefox_options.set_preference('xpinstall.signatures.required', False)
    firefox_options.set_preference('extensions.webapi.testing', True)
    firefox_options.set_preference('extensions.legacy.enabled', True)
    firefox_options.add_argument('-foreground')
    firefox_options.log.level = 'trace'
    return firefox_options


@pytest.fixture
def install_testpilot(selenium):
    addon = os.path.abspath('addon/addon.xpi')
    selenium.install_addon(addon, temporary=True)


@pytest.fixture(scope='session', autouse=True)
def _verify_url(request, base_url):
    """Verifies the base URL"""
    verify = request.config.option.verify_base_url
    if base_url and verify:
        session = requests.Session()
        retries = Retry(backoff_factor=0.1,
                        status_forcelist=[500, 502, 503, 504])
        session.mount(base_url, HTTPAdapter(max_retries=retries))
        session.get(base_url, verify=False)
