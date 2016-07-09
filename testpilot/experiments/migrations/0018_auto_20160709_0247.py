# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0017_discourse_url'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='feature',
            name='experiment',
        ),
        migrations.RemoveField(
            model_name='featurecondition',
            name='experiment',
        ),
        migrations.RemoveField(
            model_name='featurestate',
            name='feature',
        ),
        migrations.RemoveField(
            model_name='featurestate',
            name='installation',
        ),
        migrations.DeleteModel(
            name='Feature',
        ),
        migrations.DeleteModel(
            name='FeatureCondition',
        ),
        migrations.DeleteModel(
            name='FeatureState',
        ),
    ]
