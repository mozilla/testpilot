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
    url(r'^accounts/', include('idea_town.accounts.urls')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework')),
    url(r'^api/', include(router.urls)),
    url(r'^api/metrics/', metrics_view.MetricsView.as_view(), name='metrics'),
    # Catch-all fallback to frontend client view
    url(r'', include('idea_town.frontend.urls')),
)
