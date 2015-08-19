from django.conf.urls import url, patterns

from allauth.account import views as account_views
from allauth.socialaccount import views as socialaccount_views
from .providers.fxa import views as fxa_views
from . import views

urlpatterns = patterns(
    '',
    url(r"^profile/$", views.profile, name="account_profile"),
    url(r"^logout/$", account_views.logout, name="account_logout"),
    url(r"^login/$", fxa_views.oauth2_login, name="account_login"),
    url(r"^login/callback/$", fxa_views.oauth2_callback, name="fxa_callback"),
    url(r"^signup/$", socialaccount_views.signup, name='socialaccount_signup'),
)
