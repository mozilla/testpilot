from pypom import Page

from selenium.webdriver.common.by import By


class Base(Page):

    _copter_locator = (By.CLASS_NAME, 'copter')

    def __init__(self, selenium, base_url, **kwargs):
        super(Base, self).__init__(
            selenium, base_url, timeout=30, **kwargs)

    def wait_for_page_to_load(self):
        self.wait.until(lambda _: self.find_element(
            *self._copter_locator).is_displayed())
        return self
