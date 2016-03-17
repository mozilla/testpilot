# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import colorfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0011_feature_featurecondition_featurestate'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='gradient_start',
            field=colorfield.fields.ColorField(default='#e07634', max_length=10),
        ),
        migrations.AddField(
            model_name='experiment',
            name='gradient_stop',
            field=colorfield.fields.ColorField(default='#4cffa8', max_length=10),
        ),
    ]
