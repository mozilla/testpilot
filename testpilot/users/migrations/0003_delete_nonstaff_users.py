# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations

from testpilot.utils import cleanup_nonstaff_users


def delete_nonstaff_users_forwards(apps, schema_editor):
    Experiment = apps.get_model('experiments', 'Experiment')
    User = apps.get_model('auth', 'User')
    cleanup_nonstaff_users(User, Experiment.objects.all())

class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_userprofile_invite_pending'),
    ]

    operations = [
        # Clean up tables left over from FxA removal...
        migrations.RunSQL('DROP TABLE IF EXISTS account_emailconfirmation'),
        migrations.RunSQL('DROP TABLE IF EXISTS account_emailaddress'),
        migrations.RunSQL('DROP TABLE IF EXISTS socialaccount_socialtoken'),
        migrations.RunSQL('DROP TABLE IF EXISTS socialaccount_socialapp_sites'),
        migrations.RunSQL('DROP TABLE IF EXISTS socialaccount_socialapp'),
        migrations.RunSQL('DROP TABLE IF EXISTS socialaccount_socialaccount'),

        migrations.RunPython(delete_nonstaff_users_forwards)
    ]
