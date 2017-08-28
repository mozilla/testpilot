import os
import shutil

import pytest
import requests
import ruamel.yaml
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
    firefox_options.set_preference('xpinstall.signatures.required', False)
    firefox_options.set_preference('extensions.webapi.testing', True)
    firefox_options.set_preference('testpilot.env', 'local')
    firefox_options.add_argument('-foreground')
    firefox_options.log.level = 'trace'
    return firefox_options


@pytest.yield_fixture(scope='session', autouse=True)
def enable_dev_experiment():
    # Copy dev example
    shutil.copyfile(
        'content-src/experiments/dev-example.yaml',
        'content-src/experiments/dev-example-copy.txt')
    # Edit file to enable dev experiment
    with open('content-src/experiments/dev-example.yaml', 'r') as f:
        dev = ruamel.yaml.round_trip_load(f, preserve_quotes=False)
        dev['completed'] = ''
        dev['uninstalled'] = ''
    # Save edits
    with open('content-src/experiments/dev-example.yaml', 'w') as f:
        ruamel.yaml.round_trip_dump(dev, f, width=1000, explicit_start=True)
    yield
    # Copy back original file to disable dev experiment
    shutil.copyfile(
        'content-src/experiments/dev-example-copy.txt',
        'content-src/experiments/dev-example.yaml')
    # Remove copied file
    os.remove('content-src/experiments/dev-example-copy.txt')


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
