import os
import pytest

from pages.desktop.experiments import Experiments


@pytest.mark.nondestructive
@pytest.mark.skipif(
    os.environ.get('SKIP_INSTALL_TEST') is not None,
    reason='Skip install on Release and Beta Firefox.')
def test_experiment_page_sticky_header(
        base_url, selenium, firefox, notifications):
    """Test that scrolling down on an experiment page with the
    add-on installed properly makes the header sticky
    """
    experiments = Experiments(selenium, base_url).open()
    selenium.execute_script(
        "document.querySelector('.landing-experiments').scrollIntoView();"
    )
    experiment = experiments.list[0].click()
    experiment.install_and_enable()
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallConfirmation).install()
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallComplete).close()
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallConfirmation).install()
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallComplete).close()
    selenium.execute_script(
        "document.querySelector('#main-footer').scrollIntoView();"
    )
    assert experiment.footer.is_displayed()
    assert experiment.stick.is_displayed()
