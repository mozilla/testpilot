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
            name='changelog_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='experiment',
            name='contribute_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='experiment',
            name='version',
            field=models.CharField(blank=True, max_length=128),
        ),
    ]
