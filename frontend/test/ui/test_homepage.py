import pytest

from pages.desktop.home import Home


@pytest.mark.nondestructive
def test_copter_loads(base_url, selenium):
    """Test Firefox 'copter' loads on home page"""
    page = Home(selenium, base_url).open()
    assert page.header.is_copter_displayed
