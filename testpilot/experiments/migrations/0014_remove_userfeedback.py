# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0013_auto_20160329_1941'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userfeedback',
            name='experiment',
        ),
        migrations.RemoveField(
            model_name='userfeedback',
            name='user',
        ),
        migrations.DeleteModel(
            name='UserFeedback',
        ),
    ]
