# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0002_auto_20150831_1658'),
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
