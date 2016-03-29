# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import markupfield.fields


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0012_auto_20160317_1352'),
    ]

    operations = [
        migrations.AddField(
            model_name='experimenttranslation',
            name='_introduction_rendered',
            field=models.TextField(editable=False, default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='experimenttranslation',
            name='introduction',
            field=markupfield.fields.MarkupField(blank=True, rendered_field=True, default=''),
        ),
        migrations.AddField(
            model_name='experimenttranslation',
            name='introduction_markup_type',
            field=models.CharField(blank=True, default='markdown', choices=[('', '--'), ('html', 'HTML'), ('plain', 'Plain'), ('markdown', 'Markdown'), ('restructuredtext', 'Restructured Text')], max_length=30),
        ),
    ]
