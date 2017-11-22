import os
import pytest

from pages.desktop.home import Home


@pytest.mark.nondestructive
@pytest.mark.skipif(
    os.environ.get('SKIP_INSTALL_TEST') is not None,
    reason='Skip install on Release and Beta Firefox.')
def test_experiment_page_sticky_header(base_url, selenium):
    """Test that scrolling down on an experiment page with the
    add-on installed properly makes the header sticky
    """
    page = Home(selenium, base_url).open()
    experiments = page.header.click_install_button()
    experiments.welcome_popup.close()
    experiment = experiments.find_experiment(
        experiment='Dev Example')
    selenium.execute_script(
        "document.querySelector('#main-footer').scrollIntoView();"
    )
    assert experiment.footer.is_displayed()
    assert experiment.stick.is_displayed()
