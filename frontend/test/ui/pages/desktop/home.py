from pypom import Region
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
    def signup_footer(self):
        return self.SignUpFooter(self)

    class Header(Region):
        """Represents the Header portion of the page"""
        _root_locator = (By.CLASS_NAME, 'banner')
        _copter_locator = (By.CLASS_NAME, 'copter')
        _install_locator = (By.CLASS_NAME, 'install')

        @property
        def is_copter_displayed(self):
            return self.find_element(*self._copter_locator).is_displayed()

        @property
        def is_install_button_displayed(self):
            return self.find_element(*self._install_locator).is_displayed()

    class Body(Region):
        """Represents the main body of the page"""
        _root_locator = (By.CLASS_NAME, 'layout-wrapper--card-list')
        _experiment_locator = (By.CLASS_NAME, 'experiment-summary')

        @property
        def experiments(self):
            experiments = self.find_elements(*self._experiment_locator)
            return [self.Experiments(self.page, el) for el in experiments]

        class Experiments(Region):
            """Represents the experiments region"""
            _name_locator = (By.CSS_SELECTOR, '.experiment-information > \
                             header > div > h3')

            @property
            def name(self):
                """Returns the experiments name"""
                return self.find_element(*self._name_locator).text

            def click(self):
                """Clicks on the experiment"""
                self.root.click()
                from pages.desktop.detail import Detail
                return Detail(self.selenium, self.page.base_url)

    class SignUpFooter(Region):
        """Represents the footer"""
        _root_locator = (By.CLASS_NAME, 'newsletter-footer')
        _error_locator = (By.CLASS_NAME, 'error')
        _privacy_checkbox_locator = (By.CSS_SELECTOR, '.revealed-field input')
        _sign_up_locator = (By.CSS_SELECTOR, 'input')
        _sign_up_now_locator = (By.CLASS_NAME, 'button')
        _stay_informed_locator = (By.CSS_SELECTOR, 'h2')

        def sign_up(self, email):
            """Signs up with an email provided"""
            email_input = self.find_element(*self._sign_up_locator)
            email_input.send_keys(email)
            self.wait.until(
                lambda _: self.find_element(*self._privacy_checkbox_locator))
            self.find_element(*self._privacy_checkbox_locator).click()
            self.find_element(*self._sign_up_now_locator).click()

        @property
        def is_stay_informed_displayed(self):
            return self.find_element(*self._stay_informed_locator).is_displayed

        @property
        def email_error_header(self):
            self.wait.until(
                lambda _: self.find_element(
                          *self._error_locator).is_displayed())
            return self.find_element(*self._error_locator)
