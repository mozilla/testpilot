from allauth.socialaccount import providers
from allauth.socialaccount.providers.base import ProviderAccount
from allauth.socialaccount.providers.oauth2.provider import OAuth2Provider


import logging
logger = logging.getLogger(__name__)


class FirefoxAccountsAccount(ProviderAccount):

    def to_str(self):
        return self.account.uid


class FirefoxAccountsProvider(OAuth2Provider):
    id = 'fxa'
    name = 'Firefox Accounts (for Idea Town)'
    package = 'idea_town.users.providers.fxa'
    account_class = FirefoxAccountsAccount

    def get_default_scope(self):
        return ['profile']

    def extract_uid(self, data):
        return str(data['uid'])

    def extract_common_fields(self, data):
        return dict(email=data.get('email'))


providers.registry.register(FirefoxAccountsProvider)
