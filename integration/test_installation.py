import time
import os
import unittest

from mozlog import get_default_logger

from marionette import Marionette
from marionette_driver import Actions, Wait
from marionette_driver.by import By
from marionette_driver.addons import Addons
from marionette_driver.errors import NoSuchElementException

from firefox_puppeteer.api.prefs import Preferences
from firefox_puppeteer.api.software_update import SoftwareUpdate
from firefox_puppeteer.ui.update_wizard import UpdateWizardDialog
from firefox_puppeteer.ui.browser.notifications import (
    AddOnInstallBlockedNotification,
    AddOnInstallFailedNotification,
    AddOnInstallConfirmationNotification,
    AddOnInstallCompleteNotification,
)

from __init__ import FirefoxTestCase


SITE_URL = 'http://testpilot.dev:8000/'
TOOLBAR_BUTTON_ID = 'toggle-button--testpilot-addon-testpilot-link'


class TestAddonInstallation(FirefoxTestCase):

    def setUp(self):
        FirefoxTestCase.setUp(self)

    def test_initial_installation(self):
        m = self.marionette
        b = self.browser

        # Navigate to the site and click the install button
        with m.using_context(m.CONTEXT_CONTENT):
            m.navigate(SITE_URL)
            m.find_element(By.CSS_SELECTOR,
                           'button[data-hook=install]').click()
            w = Wait(m, ignored_exceptions=NoSuchElementException)
            w.until(lambda m: m.find_element(By.CSS_SELECTOR,
                                             'button[data-hook=install].state-change'))

        # Click through the blocked notification
        b.wait_for_notification(AddOnInstallBlockedNotification)
        # HACK: Things seem to fail intermittently here if we don't wait a tick
        time.sleep(0.5)
        b.notification.allow_button.click()

        # Click through the installation notification
        b.wait_for_notification(AddOnInstallConfirmationNotification)
        b.notification.install_button().click()

        # Wait for and close the completion notification
        b.wait_for_notification(AddOnInstallCompleteNotification, timeout=60)
        b.notification.close()

        # The toolbar button should show up soon after installation
        with m.using_context(m.CONTEXT_CHROME):
            w = Wait(m, ignored_exceptions=NoSuchElementException)
            w.until(lambda m: m.find_element('id', target=TOOLBAR_BUTTON_ID))

        # And the add-on should open up an onboarding tab...
        Wait(m).until(lambda m: len(b.tabbar.tabs) > 1)
        self.assertTrue(b.tabbar.tabs[1].location.endswith('/onboarding'))
        b.tabbar.close_tab(b.tabbar.tabs[1])

        # The frontend should redirect to /experiments after it contacts the add-on
        Wait(m).until(lambda m: b.tabbar.tabs[0].location.endswith('/experiments'))

        # Clean up by uninstalling the add-on
        Addons(m).uninstall('@testpilot-addon')

    def tearDown(self):
        FirefoxTestCase.tearDown(self)
