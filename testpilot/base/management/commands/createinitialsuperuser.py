from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import DEFAULT_DB_ALIAS
from django.conf import settings


class Command(BaseCommand):
    help = 'Creates an initial superuser from credentials in settings'

    def __init__(self, *args, **kwargs):
        super(Command, self).__init__(*args, **kwargs)
        self.UserModel = get_user_model()
        self.username_field = self.UserModel._meta.get_field(self.UserModel.USERNAME_FIELD)

    def handle(self, *args, **options):
        database = DEFAULT_DB_ALIAS
        username = settings.INITIAL_ADMIN_USERNAME
        password = settings.INITIAL_ADMIN_PASSWORD
        email = settings.INITIAL_ADMIN_EMAIL

        # Check if INITIAL_ADMIN_* is configured, bail if not.
        if username is None or password is None or email is None:
            self.stdout.write("INITIAL_ADMIN_* settings unavailable; "
                              "skipping superuser creation.")
            return

        # Stole this from createsuperuser.py, probably overly careful
        user_manager = self.UserModel._default_manager.db_manager(database)

        # Check if there's already at least one superuser, bail if so.
        superuser_count = user_manager.filter(is_superuser=True).count()
        if superuser_count > 0:
            self.stdout.write("At least one superuser already exists; "
                              "skipping superuser creation")
            return

        # Check if the initial superuser exists already, bail if so.
        existing_user_count = user_manager.filter(username=username).count()
        if existing_user_count > 0:
            self.stdout.write("User %s exists; skipping superuser creation." %
                              username)
            return

        # Finally, create the initial superuser account.
        user = user_manager.create_superuser(
            username=username, email=email, password=password)
        self.stdout.write("Created initial superuser %s (pk=%s)" %
                          (user.username, user.pk))
