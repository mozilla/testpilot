# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0020_auto_20160727_1846'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='experimentnotification',
            name='is_new',
        ),
        migrations.RemoveField(
            model_name='experimentnotification',
            name='is_updated',
        ),
        migrations.AddField(
            model_name='experimentnotification',
            name='notify_after',
            field=models.DateTimeField(blank=True, null=True, default=None),
        ),
    ]
