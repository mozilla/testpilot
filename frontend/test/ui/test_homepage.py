import os

import pytest

from pages.desktop.home import Home
from pages.desktop.privacy import Privacy
from pages.desktop.terms import Terms
from pages.desktop.about import About


@pytest.mark.nondestructive
def test_copter_loads(base_url, selenium):
    """Test Firefox 'copter' loads on home page"""
    page = Home(selenium, base_url).open()
    assert page.header.is_copter_displayed


@pytest.mark.nondestructive
def test_install_button_loads(base_url, selenium):
    """Test install button for test pilot addon loads"""
    page = Home(selenium, base_url).open()
    if not page.featured.is_displayed:
        assert page.header.is_install_button_displayed
    else:
        assert True


@pytest.mark.nondestructive
def test_featured_experiment_actions(base_url, selenium):
    """Test if featured experiment action buttons exists"""
    page = Home(selenium, base_url).open()
    if page.featured.is_displayed:
        assert page.featured.are_actions_displayed
    else:
        assert True


@pytest.mark.nondestructive
def test_featured_experiment(base_url, selenium):
    """Test if featured experiment video exists"""
    page = Home(selenium, base_url).open()
    if page.featured.is_displayed:
        assert page.featured.is_video_displayed
    else:
        assert True


@pytest.mark.nondestructive
def test_experiments_load_correct_pages(base_url, selenium):
    """Test clicking an experiment loads the correct page"""
    page = Home(selenium, base_url).open()
    name = page.body.experiments[0].name
    experiment = page.body.experiments[0].click()
    assert experiment.name in name


@pytest.mark.parametrize('page, title', [
    [Privacy, 'Test Pilot Privacy Notice'],
    [Terms, 'Test Pilot Terms of Use'],
    [About, 'About Test Pilot']])
@pytest.mark.nondestructive
def test_support_pages(base_url, selenium, page, title):
    """Test the support pages load correctly"""
    page = page(selenium, base_url).open()
    assert title in page.title


@pytest.mark.nondestructive
def test_incomplete_email(base_url, selenium):
    """Test signup with incorrect email"""
    page = Home(selenium, base_url).open()
    assert page.signup_footer.is_stay_informed_displayed
    page.signup_footer.sign_up('test')
    assert page.signup_footer.is_stay_informed_displayed


@pytest.mark.skipif(os.environ.get('SKIP_INSTALL_TEST') is not None,
                    reason='Skip install on Release and Beta Firefox.')
@pytest.mark.nondestructive
def test_install_button_not_shown_when_ext_is_installed(
        base_url, selenium, install_testpilot):
    page = Home(selenium, base_url).open()
    page.wait_for_page_to_load()
    assert page.header.is_install_button_displayed is False
