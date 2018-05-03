from pypom import Region
from selenium.webdriver.common.by import By

from pages.desktop.base import Base


class Detail(Base):
    """Represents the individual details page of an experiment"""
    _root_locator = (By.CLASS_NAME, 'default-background')
    _name_locator = (By.CSS_SELECTOR, '.details-header > header > h1')
    _enable_locator = (By.ID, 'install-button')
    _install_and_enable_locator = (By.ID, 'one-click-button')
    _uninstall_button_locator = (By.ID, 'uninstall-button')

    def wait_for_page_to_load(self):
        self.wait.until(
            lambda _: self.find_element(*self._name_locator).is_displayed())

    @property
    def enabled_popup(self):
        return self.EnabledPopup(self)

    @property
    def email_popup(self):
        return self.EmailPopup(self)

    @property
    def name(self):
        """Returns the experiments name from the details page"""
        self.wait.until(lambda _: self.find_element(*self._name_locator))
        return self.find_element(*self._name_locator).text

    def enable(self):
        self.wait_for_page_to_load()
        self.wait.until(lambda _: self.enable_button.is_displayed())
        self.enable_button.click()

    @property
    def enable_button(self):
        return self.find_element(*self._enable_locator)

    def install_and_enable(self):
        self.wait_for_page_to_load()
        self.wait.until(lambda _: self.find_element(
            *self._install_and_enable_locator).is_displayed())
        self.find_element(*self._install_and_enable_locator).click()

    def disable(self):
        self.find_element(*self._uninstall_button_locator).click()

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

    class EmailPopup(Region):
        _root_locator = (By.CSS_SELECTOR, '.feedback-modal')
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

    class Footer(Region):
        _root_locator = (By.CSS_SELECTOR, '#main-footer')

        def wait_for_region_to_load(self):
            self.wait.until(
                lambda _: self.root.is_displayed())

        def is_displayed(self):
            return self.root.is_displayed()

    @property
    def footer(self):
        return self.Footer(self)

    class Stick(Region):
        _root_locator = (By.CSS_SELECTOR, '.stick')

        def wait_for_region_to_load(self):
            self.wait.until(
                lambda _: self.root.is_displayed())

        def is_displayed(self):
            return self.root.is_displayed()

    @property
    def stick(self):
        return self.Stick(self)
