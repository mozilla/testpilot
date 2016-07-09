from django.db import models
from django.contrib.auth.models import User
from django.utils.functional import cached_property

from colorfield.fields import ColorField
from markupfield.fields import MarkupField

from hvad.models import TranslatableModel, TranslatedFields
from hvad.manager import TranslationManager

from ..utils import HashedUploadTo


experiment_thumbnail_upload_to = HashedUploadTo('thumbnail')
experimentdetail_image_upload_to = HashedUploadTo('image')
experimenttourstep_image_upload_to = HashedUploadTo('image')


class ExperimentManager(TranslationManager):

    def get_by_natural_key(self, slug):
        return self.get(slug=slug)


class Experiment(TranslatableModel):
    objects = ExperimentManager()

    class Meta:
        ordering = ['order']

    translations = TranslatedFields(
        title=models.CharField(max_length=128),
        short_title=models.CharField(max_length=60, blank=True, default=''),
        description=models.TextField(),
        measurements=MarkupField(blank=True, default='',
                                 default_markup_type='plain'),
        introduction=MarkupField(blank=True, default='',
                                 default_markup_type='markdown'),
    )

    slug = models.SlugField(max_length=128, unique=True, db_index=True)
    thumbnail = models.ImageField(upload_to=experiment_thumbnail_upload_to)
    xpi_url = models.URLField()
    version = models.CharField(blank=True, max_length=128)
    order = models.IntegerField(default=0)
    changelog_url = models.URLField(blank=True)
    contribute_url = models.URLField(blank=True)
    bug_report_url = models.URLField(blank=True)
    discourse_url = models.URLField(blank=True)
    privacy_notice_url = models.URLField(blank=True)
    addon_id = models.CharField(max_length=500, blank=False,)
    gradient_start = ColorField(default='#e07634')
    gradient_stop = ColorField(default='#4cffa8')

    users = models.ManyToManyField(User, through='UserInstallation')
    contributors = models.ManyToManyField(User, related_name='contributor')

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    @cached_property
    def installation_count(self):
        return UserInstallation.objects.distinct('user').filter(
            experiment=self).count()

    def __str__(self):
        return self.title

    def natural_key(self):
        return (self.slug,)


class ExperimentDetail(TranslatableModel):
    experiment = models.ForeignKey('Experiment', related_name='details',
                                   db_index=True)

    order = models.IntegerField(default=0)

    translations = TranslatedFields(
        headline=models.CharField(max_length=256),
        copy=models.TextField()
    )

    image = models.ImageField(upload_to=experimentdetail_image_upload_to)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('experiment', 'order', 'modified',)


class ExperimentTourStep(TranslatableModel):
    experiment = models.ForeignKey('Experiment', related_name='tour_steps',
                                   db_index=True)
    order = models.IntegerField(default=0)
    image = models.ImageField(upload_to=experimenttourstep_image_upload_to)
    translations = TranslatedFields(
        copy=MarkupField(blank=True, default='',
                         default_markup_type='markdown'),
    )
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('experiment', 'order', 'modified',)


class UserInstallation(models.Model):

    experiment = models.ForeignKey(Experiment)
    user = models.ForeignKey(User)
    client_id = models.CharField(blank=True, max_length=128)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('experiment', 'user', 'client_id',)
