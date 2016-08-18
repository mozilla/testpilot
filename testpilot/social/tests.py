from unittest.mock import patch

from django.test import RequestFactory

from ..experiments.tests import BaseTestCase
from ..frontend.views import index
from .models import SocialMetadata


class SocialTestCase(BaseTestCase):

    def _request(self, path, **data):
        return RequestFactory().get(path, data=data)

    def _for_request(self, path):
        req = self._request(path)
        return SocialMetadata.objects.for_request(req)

    def test_no_trailing_slashes(self):
        """
        NB: They are created with a url that ends in a slash. This tests that
        that slash is removed.
        """
        for md in self.metadata:
            self.assertFalse(md.endswith('/'))

    def test_for_requests(self):
        for md in self.metadata:
            self.assertEqual(self._for_request(md).url, md)

    def test_for_requests_with_slash(self):
        for md in self.metadata:
            self.assertEqual(self._for_request("%s/" % md).url, md)

    def test_for_requests_none(self):
        self.assertEqual(self._for_request("/fake"), None)

    @patch('testpilot.frontend.views.render')
    def test_index(self, mock_render):
        for md in self.metadata:
            req = self._request(md)
            index(req)
            self.assertEqual(mock_render.call_args[0][2]['social'],
                             SocialMetadata.objects.get(url=md))

    @patch('testpilot.frontend.views.render')
    def test_index_no_social(self, mock_render):
        req = self._request('/foobar')
        index(req)
        self.assertEqual(mock_render.call_args[0][2]['social'], None)
