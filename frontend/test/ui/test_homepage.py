from datetime import datetime

import pytest
import requests

from pages.desktop.home import Home


@pytest.mark.nondestructive
def test_copter_loads(base_url, selenium):
    """Test Firefox 'copter' loads on home page"""
    page = Home(selenium, base_url).open()
    assert page.header.is_copter_displayed


@pytest.mark.nondestructive
def test_install_button_loads(base_url, selenium):
    """Test install button for test pilot addon loads"""
    page = Home(selenium, base_url).open()
    assert page.header.is_install_button_displayed


@pytest.mark.nondestructive
def test_number_of_experiments(base_url, selenium):
    """Test current number experiments"""
    page = Home(selenium, base_url).open()
    url = '{0}/{1}'.format(base_url, 'api/experiments.json')
    # Ping api to get current number of completed experiments
    data = requests.get(url, verify=False).json()
    completed_experiments = len(
        [value for value in data['results'] if 'completed' in value and
            value['completed'] < str(datetime.utcnow())])
    # Subtract 1 from the experiments found through the api due to locale
    assert len(page.body.experiments) == int(
        len(data['results']) - completed_experiments) - 1


@pytest.mark.nondestructive
def test_experiments_load_correct_pages(base_url, selenium):
    """Test clicking an experiment loads the correct page"""
    page = Home(selenium, base_url).open()
    name = page.body.experiments[0].name
    experiment = page.body.experiments[0].click()
    assert experiment.name in name
