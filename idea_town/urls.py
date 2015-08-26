from django.conf.urls import patterns, include, url
from django.contrib import admin

from rest_framework import routers

from .experiments import views as experiment_views


router = routers.DefaultRouter()
experiment_views.register_views(router)

urlpatterns = patterns(
    '',
    url(r'^$', 'idea_town.base.views.home', name='home'),
    url(r'^accounts/', include('idea_town.accounts.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/', include(router.urls)),
)
