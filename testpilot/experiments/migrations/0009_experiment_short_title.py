# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0008_auto_20160111_1702'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='short_title',
            field=models.CharField(max_length=60, default='', blank=True),
        ),
    ]
