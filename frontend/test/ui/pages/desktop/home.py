from pypom import Region
from selenium.webdriver.common.by import By

from base import Base


class Home(Base):
    """Represents the main home page"""
    @property
    def header(self):
        return self.Header(self)

    @property
    def body(self):
        return self.Body(self)

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
                             header > h3')

            @property
            def name(self):
                """Returns the experiments name"""
                return self.find_element(*self._name_locator).text

            def click(self):
                """Clicks on the experiment"""
                self.root.click()
                from pages.desktop.detail import Detail
                return Detail(self.selenium, self.page.base_url)
