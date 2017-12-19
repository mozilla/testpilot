import os
import pytest

from pages.desktop.home import Home


@pytest.mark.nondestructive
@pytest.mark.skipif(
    os.environ.get('SKIP_INSTALL_TEST') is not None,
    reason='Skip install on Release and Beta Firefox.')
def test_experiment_page_sticky_header(
        base_url, selenium, firefox, notifications):
    """Test that scrolling down on an experiment page with the
    add-on installed properly makes the header sticky
    """
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
    ## First we wait for notification that the test pilot add-on was installed
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallComplete).close()
    ## Then we wait to be asked to install the experiment
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallConfirmation).install()
    ## Then we wait for the experiment to be installed
    firefox.browser.wait_for_notification(
        notifications.AddOnInstallComplete).close()
    assert Detail(selenium, base_url).enabled_popup.is_popup_displayed()

    selenium.execute_script(
        "document.querySelector('#main-footer').scrollIntoView();"
    )
    assert experiment.footer.is_displayed()
    assert experiment.stick.is_displayed()
