# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0018_auto_20160709_0247'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='experiment',
            name='users',
        ),
        migrations.AlterUniqueTogether(
            name='userinstallation',
            unique_together=set([('experiment', 'client_id')]),
        ),
        migrations.RemoveField(
            model_name='userinstallation',
            name='user',
        ),
    ]
