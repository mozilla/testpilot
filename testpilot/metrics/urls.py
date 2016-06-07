from django.conf.urls import url, patterns

from . import views

urlpatterns = patterns(
    '',
    url(r'^ping/(?P<logger_name>.+)', views.log_ping, name='log-ping'),
)
