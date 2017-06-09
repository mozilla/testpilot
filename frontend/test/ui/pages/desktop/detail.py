from selenium.webdriver.common.by import By

from base import Base


class Detail(Base):
    """Represents the individual details page of an experiment"""
    _root_locator = (By.CLASS_NAME, 'default-background')
    _name_locator = (By.CSS_SELECTOR, '.details-header > header > h1')

    @property
    def name(self):
        """Returns the experiments name from the details page"""
        self.wait.until(lambda _: self.find_element(*self._name_locator))
        return self.find_element(*self._name_locator).text
