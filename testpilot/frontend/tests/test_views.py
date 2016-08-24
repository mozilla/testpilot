from unittest.mock import patch

from django.test import RequestFactory

from ...experiments.tests import BaseTestCase
from ..views import index


class IndexTestCase(BaseTestCase):
    def _request(self, path, **data):
        return RequestFactory().get(path, data=data)

    def _context(self, mock_render, path):
        req = self._request(path)
        index(req)
        return mock_render.call_args[0][2]

    @patch('testpilot.frontend.views.render')
    def test_index_homepage(self, mock_render):
        context = self._context(mock_render, '/')
        self.assertEqual(context['experiment'], None)

    @patch('testpilot.frontend.views.render')
    def test_index_experiment_detail_404(self, mock_render):
        context = self._context(mock_render, '/experiments/foobar')
        self.assertEqual(context['experiment'], None)

    @patch('testpilot.frontend.views.render')
    def test_index_experiment_detail(self, mock_render):
        slug = list(self.experiments)[0]
        context = self._context(mock_render, '/experiments/%s' % slug)
        self.assertEqual(context['experiment'], self.experiments[slug])
