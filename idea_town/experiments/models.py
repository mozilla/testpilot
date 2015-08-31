from django.db import models
from django.contrib.auth.models import User

from ..utils import HashedUploadTo


experiment_thumbnail_upload_to = HashedUploadTo('thumbnail')
experimentdetail_image_upload_to = HashedUploadTo('image')


class Experiment(models.Model):

    title = models.CharField(max_length=128)
    slug = models.SlugField(max_length=128, unique=True, db_index=True)
    thumbnail = models.ImageField(upload_to=experiment_thumbnail_upload_to)
    description = models.TextField()
    xpi_url = models.URLField()

    users = models.ManyToManyField(User, through='UserInstallation')

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class ExperimentDetail(models.Model):

    experiment = models.ForeignKey('Experiment', related_name='details',
                                   db_index=True)

    order = models.IntegerField(default=0)
    headline = models.CharField(max_length=256)
    image = models.ImageField(upload_to=experimentdetail_image_upload_to)
    copy = models.TextField()

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('experiment', 'order', 'modified',)


class UserInstallation(models.Model):

    experiment = models.ForeignKey(Experiment)
    user = models.ForeignKey(User)

    rating = models.FloatField(null=True, blank=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
