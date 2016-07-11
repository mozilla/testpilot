from django.conf.urls import url, patterns

from . import views

urlpatterns = patterns(
    '',
    url(r'^(?P<experiment_pk>[\w-]+)/installations/(?P<client_id>[\w-]+)',
        views.installation_detail, name='experiment-installation-detail'),
    url(r'^(?P<experiment_pk>[\w-]+)/installations/',
        views.installation_list, name='experiment-installation-list'),
)
