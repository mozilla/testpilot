# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0007_experiment_privacy_notice_url'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='experiment',
            options={'ordering': ['order']},
        ),
        migrations.AddField(
            model_name='experiment',
            name='order',
            field=models.IntegerField(default=0),
        ),
    ]
