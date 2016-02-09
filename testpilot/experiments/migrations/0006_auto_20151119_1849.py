# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0005_auto_20151111_1758'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinstallation',
            name='client_id',
            field=models.CharField(blank=True, max_length=128),
        ),
        migrations.AlterUniqueTogether(
            name='userinstallation',
            unique_together=set([('experiment', 'user', 'client_id')]),
        ),
        migrations.RemoveField(
            model_name='userinstallation',
            name='rating',
        ),
    ]
