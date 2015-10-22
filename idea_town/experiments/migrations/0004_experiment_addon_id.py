# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0003_auto_20151021_2102'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='addon_id',
            field=models.CharField(max_length=500, default='addonid@mozilla.com'),
        ),
        migrations.AlterField(
            model_name='userinstallation',
            name='rating',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
