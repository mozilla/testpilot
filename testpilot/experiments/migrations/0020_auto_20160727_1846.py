# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0019_auto_20160707_2050'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExperimentNotification',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('is_new', models.BooleanField(default=True)),
                ('is_updated', models.BooleanField(default=True)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('experiment', models.ForeignKey(related_name='notifications', to='experiments.Experiment')),
            ],
            options={
                'ordering': ('experiment', 'modified'),
            },
        ),
        migrations.CreateModel(
            name='ExperimentNotificationTranslation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, primary_key=True, auto_created=True)),
                ('title', models.CharField(max_length=128)),
                ('text', models.CharField(max_length=256)),
                ('language_code', models.CharField(max_length=15, db_index=True)),
                ('master', models.ForeignKey(related_name='translations', editable=False, to='experiments.ExperimentNotification', null=True)),
            ],
            options={
                'db_table': 'experiments_experimentnotification_translation',
                'abstract': False,
                'db_tablespace': '',
                'managed': True,
                'default_permissions': (),
            },
        ),
        migrations.AlterUniqueTogether(
            name='experimentnotificationtranslation',
            unique_together=set([('language_code', 'master')]),
        ),
    ]
