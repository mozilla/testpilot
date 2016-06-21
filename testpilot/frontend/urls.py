from django.conf.urls import patterns, url

from . import views


urlpatterns = patterns(
    '',
    url(r'postmessage-proxy', views.postmessage_proxy, name='postmessage_proxy'),
    url(r'(?P<url>.*)', views.index, name='frontend_index'),
)
