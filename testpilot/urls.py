from django.conf.urls import patterns, include, url
from django.contrib import admin

from rest_framework import routers

from .experiments import views as experiment_views
from .users import views as users_views
from .metrics import views as metrics_view

# Allow apps to contribute API parts
router = routers.DefaultRouter(trailing_slash=False)
experiment_views.register_views(router)
users_views.register_views(router)

urlpatterns = patterns(
    '',
    # users app is special, because it handles /accounts and /users
    url(r'', include('testpilot.base.urls')),
    url(r'', include('testpilot.users.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
    url(r'^api/metrics/', metrics_view.MetricsView.as_view(), name='metrics'),
    url(r'^api/experiments/', include('testpilot.experiments.urls')),
    url(r'^api/', include(router.urls)),
    # Catch-all fallback to frontend client view
    url(r'', include('testpilot.frontend.urls')),
)
