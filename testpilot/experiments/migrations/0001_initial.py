# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import testpilot.utils


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Experiment',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('title', models.CharField(max_length=128)),
                ('slug', models.SlugField(unique=True, max_length=128)),
                ('thumbnail', models.ImageField(upload_to=testpilot.utils.HashedUploadTo('thumbnail'))),
                ('description', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='ExperimentDetail',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('order', models.IntegerField(default=0)),
                ('headline', models.CharField(max_length=256)),
                ('image', models.ImageField(upload_to=testpilot.utils.HashedUploadTo('image'))),
                ('copy', models.TextField()),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('experiment', models.ForeignKey(related_name='details', to='experiments.Experiment')),
            ],
            options={
                'ordering': ('experiment', 'order', 'modified'),
            },
        ),
        migrations.CreateModel(
            name='UserInstallation',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('rating', models.FloatField(null=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('experiment', models.ForeignKey(to='experiments.Experiment')),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='experiment',
            name='users',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL, through='experiments.UserInstallation'),
        ),
    ]
