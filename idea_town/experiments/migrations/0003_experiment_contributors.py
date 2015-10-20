# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('experiments', '0002_auto_20150831_1658'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='contributors',
            field=models.ManyToManyField(related_name='contributor', to=settings.AUTH_USER_MODEL),
        ),
    ]
