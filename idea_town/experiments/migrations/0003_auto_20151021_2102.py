# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
import markupfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0002_auto_20150831_1658'),
    ]

    operations = [
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
    ]
