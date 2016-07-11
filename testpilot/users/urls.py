from django.conf.urls import patterns, include, url

from allauth.account import views as account_views
from allauth.socialaccount import views as socialaccount_views
from .providers.fxa import views as fxa_views
from ..frontend import views as frontend_views

urlpatterns = patterns(
    '',
    url(r'^accounts/', include([
        url(r"^logout/$", account_views.logout, name="account_logout"),
        url(r"^login/$", fxa_views.oauth2_login, name="account_login"),
        url(r"^login/callback/$", fxa_views.oauth2_callback, name="fxa_callback"),
        url(r"^signup/$", socialaccount_views.signup, name='socialaccount_signup'),
        # Let the frontend handle the inactive account page.
        url(r"^inactive/$", frontend_views.index, name="account_inactive"),
    ])),
)
