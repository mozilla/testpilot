# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import markupfield.fields

import logging
logger = logging.getLogger(__name__)


def copy_fields_to_translation(model, translation_model, field_names):
    for obj in model.objects.all():
        fields = dict(master=obj, language_code='en-us')
        for name in field_names:
            fields['%s_tmp' % name] = getattr(obj, name)
        translation_model.objects.create(**fields)


def migrate_translations(apps, schema_editor):

    copy_fields_to_translation(
        apps.get_model("experiments", "Experiment"),
        apps.get_model("experiments", "ExperimentTranslation"),
        ('title', 'short_title', 'description', 'measurements'))

    copy_fields_to_translation(
        apps.get_model("experiments", "ExperimentDetail"),
        apps.get_model("experiments", "ExperimentDetailTranslation"),
        ('headline', 'copy'))


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0009_experiment_short_title'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExperimentDetailTranslation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('headline_tmp', models.CharField(max_length=256)),
                ('copy_tmp', models.TextField()),
                ('language_code', models.CharField(db_index=True, max_length=15)),
                ('master', models.ForeignKey(null=True, related_name='translations', editable=False, to='experiments.ExperimentDetail')),
            ],
            options={
                'db_tablespace': '',
                'db_table': 'experiments_experimentdetail_translation',
                'abstract': False,
                'default_permissions': (),
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='ExperimentTranslation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', primary_key=True, serialize=False, auto_created=True)),
                ('title_tmp', models.CharField(max_length=128)),
                ('short_title_tmp', models.CharField(blank=True, default='', max_length=60)),
                ('description_tmp', models.TextField()),
                ('measurements_tmp', markupfield.fields.MarkupField(rendered_field=True, blank=True, default='')),
                ('measurements_tmp_markup_type', models.CharField(choices=[('', '--'), ('html', 'HTML'), ('plain', 'Plain'), ('markdown', 'Markdown'), ('restructuredtext', 'Restructured Text')], blank=True, default='plain', max_length=30)),
                ('_measurements_tmp_rendered', models.TextField(editable=False)),
                ('language_code', models.CharField(db_index=True, max_length=15)),
                ('master', models.ForeignKey(null=True, related_name='translations', editable=False, to='experiments.Experiment')),
            ],
            options={
                'db_tablespace': '',
                'db_table': 'experiments_experiment_translation',
                'abstract': False,
                'default_permissions': (),
                'managed': True,
            },
        ),
        migrations.AlterUniqueTogether(
            name='experimenttranslation',
            unique_together=set([('language_code', 'master')]),
        ),
        migrations.AlterUniqueTogether(
            name='experimentdetailtranslation',
            unique_together=set([('language_code', 'master')]),
        ),
        migrations.RunPython(migrate_translations, migrations.RunPython.noop),
        migrations.RenameField(
            model_name='experimentdetailtranslation',
            old_name='copy_tmp',
            new_name='copy',
        ),
        migrations.RenameField(
            model_name='experimentdetailtranslation',
            old_name='headline_tmp',
            new_name='headline',
        ),
        migrations.RenameField(
            model_name='experimenttranslation',
            old_name='_measurements_tmp_rendered',
            new_name='_measurements_rendered',
        ),
        migrations.RenameField(
            model_name='experimenttranslation',
            old_name='description_tmp',
            new_name='description',
        ),
        migrations.RenameField(
            model_name='experimenttranslation',
            old_name='measurements_tmp',
            new_name='measurements',
        ),
        migrations.RenameField(
            model_name='experimenttranslation',
            old_name='measurements_tmp_markup_type',
            new_name='measurements_markup_type',
        ),
        migrations.RenameField(
            model_name='experimenttranslation',
            old_name='short_title_tmp',
            new_name='short_title',
        ),
        migrations.RenameField(
            model_name='experimenttranslation',
            old_name='title_tmp',
            new_name='title',
        ),
        migrations.RemoveField(
            model_name='experiment',
            name='_measurements_rendered',
        ),
        migrations.RemoveField(
            model_name='experiment',
            name='description',
        ),
        migrations.RemoveField(
            model_name='experiment',
            name='measurements',
        ),
        migrations.RemoveField(
            model_name='experiment',
            name='measurements_markup_type',
        ),
        migrations.RemoveField(
            model_name='experiment',
            name='short_title',
        ),
        migrations.RemoveField(
            model_name='experiment',
            name='title',
        ),
        migrations.RemoveField(
            model_name='experimentdetail',
            name='copy',
        ),
        migrations.RemoveField(
            model_name='experimentdetail',
            name='headline',
        ),
    ]
