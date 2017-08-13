import subprocess

import pytest

from pages.desktop.home import Home
from pages.desktop.detail import Detail


@pytest.mark.nondestructive
@pytest.mark.skipif('57' not in subprocess.Popen("firefox --verison",
                    shell=True, stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT).stdout.readlines(),
                    reason="57 needed to install unsigned addon")
def test_install_of_test_pilot_addon(
        base_url, selenium, firefox, notifications):
    """Check that the testpilot addon is installable and installs."""
    page = Home(selenium, base_url).open()
    experiments = page.header.click_install_button()
    firefox.browser.wait_for_notification(notifications.AddOnInstallComplete)
    assert 'Welcome to Test Pilot!' in experiments.welcome_popup.title


@pytest.mark.nondestructive
@pytest.mark.skipif('57' not in subprocess.Popen("firefox --verison",
                    shell=True, stdout=subprocess.PIPE,
                    stderr=subprocess.STDOUT).stdout.readlines(),
                    reason="57 needed to install unsigned addon")
def test_enable_experiment(base_url, selenium, firefox, notifications):
    """Test enabling of an experiment."""
    page = Home(selenium, base_url).open()
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
