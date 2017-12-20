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
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallComplete
    ).close()
    assert experiments.welcome_popup.is_title_displayed()


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

    experiment = None
    for e in page.body.experiments:
        if 'Dev Example' in e.name:
            e.click()
            experiment = Detail(selenium, page.base_url)

    experiment.enable()
    # First we wait for notification that the test pilot add-on was installed
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallComplete).close()
    # Then we wait to be asked to install the experiment
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallConfirmation).install()
    # Then we wait for the experiment to be installed
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallComplete).close()
    assert Detail(selenium, base_url).enabled_popup.is_popup_displayed()
