from pypom import Region
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By

from pages.desktop.base import Base


class Home(Base):
    """Represents the main home page"""
    @property
    def header(self):
        return self.Header(self)

    @property
    def body(self):
        return self.Body(self)

    @property
    def enabled_popup(self):
        return self.EnabledPopup(self)

    @property
    def featured(self):
        return self.Featured(self)

    @property
    def signup_footer(self):
        return self.SignUpFooter(self)

    def bottom_install_button(self):
        els = self.find_elements(By.CLASS_NAME, 'main-install__button')
        els[-1].click()
        from .experiments import Experiments
        return Experiments(self.selenium, self.base_url)

    class Header(Region):
        """Represents the Header portion of the page"""
        _root_locator = (By.CLASS_NAME, 'banner')
        _copter_locator = (By.CLASS_NAME, 'copter')
        _install_locator = (By.CLASS_NAME, 'main-install__button')

        @property
        def is_copter_displayed(self):
            """Return if firefox copter is displayed."""
            return self.find_element(*self._copter_locator).is_displayed()

        @property
        def is_install_button_displayed(self):
            """Return if the testplot addon install button is displayed."""
            try:
                self.find_element(*self._install_locator).is_displayed()
            except Exception:
                return False
            return True

        def click_install_button(self):
            """Clicks the button to install the testpilot addon.

            Returns:
                obj: Experiments object.

            """
            self.find_element(*self._install_locator).click()
            from .experiments import Experiments
            return Experiments(self.selenium, self.page.base_url)

    class EnabledPopup(Region):
        _root_locator = (By.CSS_SELECTOR, '.tour-modal')
        _popup_header_locator = (By.CSS_SELECTOR, '.modal-header-wrapper')
        _close_button_locator = (By.CLASS_NAME, 'modal-cancel')

        def wait_for_region_to_load(self):
            self.wait.until(
                lambda _: self.root.is_displayed())

        def is_popup_displayed(self):
            el = self.find_element(*self._popup_header_locator).is_displayed()
            return el

        def close(self):
            self.find_element(*self._close_button_locator).click()

    class Featured(Region):
        """Represents the Header portion of the page"""
        _root_locator = (By.CLASS_NAME, 'featured-experiment')
        _video_locator = (By.CLASS_NAME, 'featured-experiment__video')
        _action_locator = (By.CLASS_NAME, 'featured-experiment__actions')
        _install_locator = (By.CLASS_NAME, 'main-install__button')
        _header_locator = (By.CLASS_NAME, 'featured-experiment__header')

        @property
        def is_displayed(self):
            """Return if featured is displayed."""
            try:
                return self.find_element(*self._header_locator).is_displayed()
            except NoSuchElementException:
                return False

        @property
        def is_video_displayed(self):
            """Return if featured video is displayed."""
            return self.find_element(*self._video_locator).is_displayed()

        @property
        def are_actions_displayed(self):
            """Return if the featured action buttons are displayed."""
            return self.find_element(*self._action_locator).is_displayed()

        def click_install_button(self):
            """Clicks the button to install the testpilot addon.

            Returns:
                obj: Experiments object.

            """
            self.find_element(*self._install_locator).click()
            from .experiments import Experiments
            return Experiments(self.selenium, self.page.base_url)

    class Body(Region):
        """Represents the main body of the page"""
        _root_locator = (By.CLASS_NAME, 'layout-wrapper--card-list')
        _experiment_locator = (By.CLASS_NAME, 'experiment-summary')

        @property
        def experiments(self):
            """Return list of experiments on home page."""
            experiments = self.find_elements(*self._experiment_locator)
            return [self.Experiments(self.page, el) for el in experiments]

        class Experiments(Region):
            """Represents the experiments region."""
            _name_locator = (By.CSS_SELECTOR, '.experiment-information > \
                             header > div > h3')

            @property
            def name(self):
                """Returns the experiments name."""
                return self.find_element(*self._name_locator).text

            def click(self):
                """Clicks on the experiment."""
                self.root.click()
                from pages.desktop.detail import Detail
                return Detail(self.selenium, self.page.base_url)

    class SignUpFooter(Region):
        """Represents the footer."""
        _root_locator = (By.CLASS_NAME, 'newsletter-footer')
        _privacy_checkbox_locator = (By.CSS_SELECTOR, 'label[for="privacy"]')
        _sign_up_locator = (By.CSS_SELECTOR, 'input')
        _sign_up_now_locator = (By.CLASS_NAME, 'button')
        _stay_informed_locator = (By.CSS_SELECTOR, 'h2')

        def sign_up(self, email):
            """Signs up with an email provided."""
            email_input = self.find_element(*self._sign_up_locator)
            email_input.send_keys(email)
            self.find_element(*self._privacy_checkbox_locator).click()
            self.find_element(*self._sign_up_now_locator).click()

        @property
        def is_stay_informed_displayed(self):
            """Return if stay informed is displayed."""
            return self.find_element(
                *self._stay_informed_locator).is_displayed()
