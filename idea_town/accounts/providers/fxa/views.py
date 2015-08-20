import requests

from allauth.socialaccount.providers.oauth2.views import (OAuth2Adapter,
                                                          OAuth2LoginView,
                                                          OAuth2CallbackView)
from .provider import FirefoxAccountsProvider

import logging
logger = logging.getLogger(__name__)


class FirefoxAccountsOAuth2Adapter(OAuth2Adapter):
    provider_id = FirefoxAccountsProvider.id

    def __init__(self):
        provider = self.get_provider()
        provider_settings = provider.get_settings()

        self.access_token_url = provider_settings.get(
            'ACCESS_TOKEN_URL', 'https://oauth.accounts.firefox.com/v1/token')
        self.authorize_url = provider_settings.get(
            'AUTHORIZE_URL', 'https://oauth.accounts.firefox.com/v1/authorization')
        self.profile_url = provider_settings.get(
            'PROFILE_URL', 'https://profile.accounts.firefox.com/v1/profile')

    def complete_login(self, request, app, token, **kwargs):
        headers = {'Authorization': 'Bearer {0}'.format(token.token)}
        resp = requests.get(self.profile_url, headers=headers)
        extra_data = resp.json()
        return self.get_provider().sociallogin_from_response(request,
                                                             extra_data)


oauth2_login = OAuth2LoginView.adapter_view(FirefoxAccountsOAuth2Adapter)
oauth2_callback = OAuth2CallbackView.adapter_view(FirefoxAccountsOAuth2Adapter)
