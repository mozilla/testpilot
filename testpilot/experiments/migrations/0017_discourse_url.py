# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0016_auto_20160512_1704'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='discourse_url',
            field=models.URLField(blank=True),
        )
]