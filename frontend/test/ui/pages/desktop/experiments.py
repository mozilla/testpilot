from pypom import Region
from selenium.webdriver.common.by import By

from pages.desktop.base import Base


class Experiments(Base):
    """Represents the experiments page"""
    URL_TEMPLATE = '/experiments/'

    _experiment_locator = (By.CLASS_NAME, 'experiment-summary')

    def wait_for_page_to_load(self):
        self.wait.until(lambda _: self.list is not None)
        return self

    @property
    def list(self):
        """Return list of experiments on experiments page."""
        experiments = self.find_elements(*self._experiment_locator)
        return [self.ExperimentsPreview(self, el) for el in experiments]

    def find_experiment(self, experiment=None):
        """Locate experiment given.

        Args:
            str: Experiment name.

        Returns:
            obj: Experiment Detail object.

        """
        for item in self.list:
            if experiment in item.name:
                item.click()
                from pages.desktop.detail import Detail
                return Detail(self.selenium, self.base_url)
            else:
                continue
        raise AttributeError('Experiment: {0}, not found.'.format(experiment))

        @property
        def title(self):
            """Return title text of popup."""
            return self.find_element(*self._popup_locator_title).text

    class ExperimentsPreview(Region):
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
