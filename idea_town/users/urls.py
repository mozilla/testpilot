from django.conf.urls import patterns, include, url

from allauth.account import views as account_views
from allauth.socialaccount import views as socialaccount_views
from .providers.fxa import views as fxa_views

accounts_urlpatterns = patterns(
    '',
    url(r"^logout/$", account_views.logout, name="account_logout"),
    url(r"^login/$", fxa_views.oauth2_login, name="account_login"),
    url(r"^login/callback/$", fxa_views.oauth2_callback, name="fxa_callback"),
    url(r"^signup/$", socialaccount_views.signup, name='socialaccount_signup'),
)

urlpatterns = patterns(
    url(r'^accounts/', include(accounts_urlpatterns)),
)
