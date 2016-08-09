from marionette import Marionette, MarionetteTestCase
from firefox_puppeteer.testcases import BaseFirefoxTestCase


class FirefoxTestCase(BaseFirefoxTestCase, MarionetteTestCase):

    # HACK: Replicate setUp from superclass, but just without the navigation to
    # browser.newtab.url
    def setUp(self, *args, **kwargs):
        super(BaseFirefoxTestCase, self).setUp(*args, **kwargs)

        self._start_handle_count = len(self.marionette.window_handles)
        self._init_tab_handles = self.marionette.window_handles
        self.marionette.set_context('chrome')
        self.marionette.set_search_timeout(10000)

        self.browser = self.windows.current
        self.browser.focus()

        # Ensure the Test Pilot environment is set to local before installation
        self.marionette.set_prefs({
          'testpilot.env': 'local',
          'xpinstall.signatures.required': False,
        })
