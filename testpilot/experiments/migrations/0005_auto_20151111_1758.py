# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('experiments', '0004_experiment_addon_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='UserFeedback',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, auto_created=True, serialize=False)),
                ('question', models.CharField(max_length=256)),
                ('answer', models.CharField(max_length=256, blank=True)),
                ('extra', models.TextField(blank=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.AddField(
            model_name='userfeedback',
            name='experiment',
            field=models.ForeignKey(to='experiments.Experiment', related_name='feedbacks'),
        ),
        migrations.AlterField(
            model_name='experiment',
            name='addon_id',
            field=models.CharField(max_length=500),
        ),
        migrations.AddField(
            model_name='userfeedback',
            name='user',
            field=models.ForeignKey(to=settings.AUTH_USER_MODEL, null=True, blank=True),
        ),
    ]
