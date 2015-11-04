from django.apps import AppConfig


class IdeaTownUsersAppConfig(AppConfig):
    name = 'idea_town.users'
    verbose_name = 'Idea Town Users'

    def ready(self):
        import idea_town.users.signals  # noqa
