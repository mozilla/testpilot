from django.apps import AppConfig


class TestPilotUsersAppConfig(AppConfig):
    name = 'testpilot.users'
    verbose_name = 'Test Pilot Users'

    def ready(self):
        import testpilot.users.signals  # noqa
