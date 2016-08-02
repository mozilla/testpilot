from django.conf.urls import patterns, include, url
from django.contrib import admin

from rest_framework import routers

from .experiments import views as experiment_views

# Allow apps to contribute API parts
router = routers.DefaultRouter(trailing_slash=False)
experiment_views.register_views(router)

urlpatterns = patterns(
    '',
    url(r'', include('testpilot.base.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/experiments/', include('testpilot.experiments.urls')),
    url(r'^api/', include(router.urls)),
    # Catch-all fallback to frontend client view
    url(r'^', include('waffle.urls')),
    url(r'', include('testpilot.frontend.urls')),
    # /files/ is proxied on the server side to our CDN. See bug 1291357
)
