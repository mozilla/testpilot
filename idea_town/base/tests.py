from django.core.urlresolvers import reverse
from django.test import TestCase


class HomeTests(TestCase):

    def test_base(self):
        self.client.get(reverse('home'))
