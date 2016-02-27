from django.conf.urls import patterns, url

from . import views


urlpatterns = patterns(
    '',
    url(r'^__version__', views.ops_version, name='ops-version'),
    url(r'^__heartbeat__', views.ops_heartbeat, name='ops-heartbeat'),
    url(r'^__lbheartbeat__', views.ops_lbheartbeat, name='ops-lbheartbeat'),
    url(r'^contribute\.json$', views.contribute_json, name='contribute-json'),
)
