from django.conf.urls import url, patterns

from . import views

urlpatterns = patterns(
    '',
    url(r'(?P<url>.*)', views.index, name="frontend_index")
)
