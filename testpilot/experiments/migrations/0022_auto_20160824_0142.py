# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import testpilot.utils


class Migration(migrations.Migration):

    dependencies = [
        ('experiments', '0021_auto_20160729_1522'),
    ]

    operations = [
        migrations.AddField(
            model_name='experiment',
            name='image_facebook',
            field=models.ImageField(null=True, upload_to=testpilot.utils.HashedUploadTo('image'), help_text='1200x1200, crop to 1200x630'),
        ),
        migrations.AddField(
            model_name='experiment',
            name='image_twitter',
            field=models.ImageField(null=True, upload_to=testpilot.utils.HashedUploadTo('image'), help_text='560x300'),
        ),
    ]
