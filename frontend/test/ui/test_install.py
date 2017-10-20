import os
import datetime

import pytest
from pages.desktop.home import Home
from pages.desktop.detail import Detail


@pytest.mark.nondestructive
@pytest.mark.skipif(os.environ.get('SKIP_INSTALL_TEST') is not None,
                    reason='Skip install on Release and Beta Firefox.')
def test_install_of_test_pilot_addon(
        base_url, selenium, firefox, notifications):
    """Check that the testpilot addon is installable and installs."""
    page = Home(selenium, base_url).open()
    experiments = page.header.click_install_button()
    firefox.browser.wait_for_notification(notifications.AddOnInstallComplete)
    assert 'Welcome to Test Pilot!' in experiments.welcome_popup.title


@pytest.mark.nondestructive
@pytest.mark.skipif(os.environ.get('SKIP_INSTALL_TEST') is not None,
                    reason='Skip install on Release and Beta Firefox.')
def test_enable_experiment(base_url, selenium, firefox, notifications):
    """Test enabling of an experiment."""
    page = Home(selenium, base_url).open()
    selenium.add_cookie({'name': 'updates-last-viewed-date',
                         'value': datetime.datetime.now().isoformat(),
                         'max_age': 120,
                         'domain': 'example.com'})
    experiments = page.header.click_install_button()
    experiments.welcome_popup.close()
    experiment = experiments.find_experiment(experiment='Dev Example')
    experiment.enable()
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallComplete).close()
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallConfirmation).install()
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallComplete).close()
    assert Detail(selenium, base_url).enabled_popup.is_popup_displayed()
