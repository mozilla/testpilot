# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings
import markupfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0002_auto_20150831_1658'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='contributors',
            field=models.ManyToManyField(related_name='contributor', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='experiment',
            name='changelog_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='experiment',
            name='contribute_url',
            field=models.URLField(blank=True),
        ),
        migrations.AddField(
            model_name='experiment',
            name='version',
            field=models.CharField(blank=True, max_length=128),
        ),
        migrations.AddField(
            model_name='experiment',
            name='_measurements_rendered',
            field=models.TextField(editable=False, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='experiment',
            name='measurements',
            field=markupfield.fields.MarkupField(rendered_field=True, default='', default_markup_type='plain', blank=True),
        ),
        migrations.AddField(
            model_name='experiment',
            name='measurements_markup_type',
            field=models.CharField(choices=[('', '--'), ('html', 'HTML'), ('plain', 'Plain'), ('markdown', 'Markdown'), ('restructuredtext', 'Restructured Text')], max_length=30, default='plain', blank=True),
        ),
        migrations.AddField(
            model_name='experiment',
            name='addon_id',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='userinstallation',
            name='rating',
            field=models.FloatField(blank=True, null=True),
        ),
    ]
