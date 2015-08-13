from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns(
    '',
    url(r'^$', 'idea_town.base.views.home', name='home'),
    url(r'^admin/', include(admin.site.urls)),
)
