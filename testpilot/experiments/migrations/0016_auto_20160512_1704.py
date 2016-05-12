# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0015_experimenttourstep'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='bug_report_url',
            field=models.URLField(blank=True),
        )
    ]
