# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import markupfield.fields
import testpilot.utils


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0014_remove_userfeedback'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExperimentTourStep',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('order', models.IntegerField(default=0)),
                ('image', models.ImageField(upload_to=testpilot.utils.HashedUploadTo('image'))),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('experiment', models.ForeignKey(related_name='tour_steps', to='experiments.Experiment')),
            ],
            options={
                'ordering': ('experiment', 'order', 'modified'),
            },
        ),
        migrations.CreateModel(
            name='ExperimentTourStepTranslation',
            fields=[
                ('id', models.AutoField(auto_created=True, serialize=False, verbose_name='ID', primary_key=True)),
                ('copy', markupfield.fields.MarkupField(rendered_field=True, blank=True, default='')),
                ('copy_markup_type', models.CharField(choices=[('', '--'), ('html', 'HTML'), ('plain', 'Plain'), ('markdown', 'Markdown'), ('restructuredtext', 'Restructured Text')], blank=True, max_length=30, default='markdown')),
                ('_copy_rendered', models.TextField(editable=False)),
                ('language_code', models.CharField(db_index=True, max_length=15)),
                ('master', models.ForeignKey(null=True, editable=False, related_name='translations', to='experiments.ExperimentTourStep')),
            ],
            options={
                'default_permissions': (),
                'db_table': 'experiments_experimenttourstep_translation',
                'db_tablespace': '',
                'abstract': False,
                'managed': True,
            },
        ),
        migrations.AlterUniqueTogether(
            name='experimenttoursteptranslation',
            unique_together=set([('language_code', 'master')]),
        ),
    ]
