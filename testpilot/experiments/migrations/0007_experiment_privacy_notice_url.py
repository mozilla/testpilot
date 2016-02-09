# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0006_auto_20151119_1849'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='privacy_notice_url',
            field=models.URLField(blank=True),
        ),
    ]
