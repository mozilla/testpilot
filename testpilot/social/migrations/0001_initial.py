# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import testpilot.utils


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SocialMetadata',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('image_twitter', models.ImageField(upload_to=testpilot.utils.HashedUploadTo('image'))),
                ('image_facebook', models.ImageField(upload_to=testpilot.utils.HashedUploadTo('image'))),
                ('url', models.CharField(unique=True, max_length=128)),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='SocialMetadataTranslation',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', serialize=False, primary_key=True)),
                ('title', models.CharField(max_length=256)),
                ('description', models.TextField()),
                ('language_code', models.CharField(max_length=15, db_index=True)),
                ('master', models.ForeignKey(editable=False, related_name='translations', to='social.SocialMetadata', null=True)),
            ],
            options={
                'default_permissions': (),
                'db_table': 'social_socialmetadata_translation',
                'abstract': False,
                'db_tablespace': '',
                'managed': True,
            },
        ),
        migrations.AlterUniqueTogether(
            name='socialmetadatatranslation',
            unique_together=set([('language_code', 'master')]),
        ),
    ]
