from django.core.urlresolvers import reverse
from django.test import TestCase
from django.test import Client

from .models import (Experiment)  # , ExperimentDetail, UserInstallation)

import logging
logger = logging.getLogger(__name__)


class ExperimentViewTests(TestCase):

    @classmethod
    def setUpTestData(cls):

        cls.experiments = dict((obj.slug, obj) for obj in (
            Experiment.objects.create(**kwargs) for kwargs in (
                dict(title="Test 1", slug="test-1", description="This is a test"),
                dict(title="Test 2", slug="test-2", description="This is a test"),
                dict(title="Test 3", slug="test-3", description="This is a test"),
            )))

    def setUp(self):
        self.client = Client()

    def test_index(self):
        url = reverse('experiment-list')
        resp = self.client.get(url)
        logger.debug(resp.content)
