# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0010_auto_20160202_2211'),
    ]

    operations = [
        migrations.CreateModel(
            name='Feature',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('slug', models.SlugField(max_length=128, unique=True)),
                ('title', models.CharField(max_length=128)),
                ('default_active', models.BooleanField(default=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('experiment', models.ForeignKey(to='experiments.Experiment', related_name='features')),
            ],
        ),
        migrations.CreateModel(
            name='FeatureCondition',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('operator', models.CharField(max_length=256)),
                ('argument', models.TextField()),
                ('comment', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('experiment', models.ForeignKey(to='experiments.Experiment', related_name='conditions')),
            ],
        ),
        migrations.CreateModel(
            name='FeatureState',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('active', models.BooleanField(default=False)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('feature', models.ForeignKey(to='experiments.Feature', related_name='states')),
                ('installation', models.ForeignKey(to='experiments.UserInstallation', blank=True, null=True)),
            ],
        ),
    ]
