from pypom import Region
from selenium.webdriver.common.by import By

from base import Base


class Home(Base):

    @property
    def header(self):
        return self.Header(self)

    class Header(Region):

        _root_locator = (By.CLASS_NAME, 'banner')
        _copter_locator = (By.CLASS_NAME, 'copter')

        @property
        def is_copter_displayed(self):
            return self.find_element(*self._copter_locator).is_displayed()
