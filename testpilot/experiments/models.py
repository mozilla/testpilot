import re

from django.db import models
from django.contrib.auth.models import User
from django.utils.functional import cached_property

from colorfield.fields import ColorField
from markupfield.fields import MarkupField

from hvad.models import TranslatableModel, TranslatedFields
from hvad.manager import TranslationManager

from ..utils import HashedUploadTo


experiment_facebook_upload_to = HashedUploadTo('image')
experiment_thumbnail_upload_to = HashedUploadTo('thumbnail')
experiment_twitter_upload_to = HashedUploadTo('image')
experimentdetail_image_upload_to = HashedUploadTo('image')
experimenttourstep_image_upload_to = HashedUploadTo('image')


class ExperimentManager(TranslationManager):

    def get_by_natural_key(self, slug):
        return self.get(slug=slug)

    def for_request(self, request):
        """
        Return a model instance for the object corresponding to the passed
        request object's path, with stripped trailing slashes. Returns None if
        no object is found.
        """
        match = re.match(r'\/experiments\/([^\/]+)', request.path)
        if match:
            try:
                return self.get(slug=match.groups()[0])
            except self.model.DoesNotExist:
                return None
        return None


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

    contributors = models.ManyToManyField(User, related_name='contributor')

    image_twitter = models.ImageField(upload_to=experiment_twitter_upload_to,
                                      help_text='560x300', null=True)
    image_facebook = models.ImageField(upload_to=experiment_facebook_upload_to,
                                       help_text='1200x1200, crop to 1200x630',
                                       null=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    @cached_property
    def installation_count(self):
        return UserInstallation.objects.filter(experiment=self).count()

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
    client_id = models.CharField(blank=True, max_length=128)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('experiment', 'client_id',)


class ExperimentNotification(TranslatableModel):
    experiment = models.ForeignKey('Experiment', related_name='notifications',
                                   db_index=True)

    translations = TranslatedFields(
        title=models.CharField(max_length=128),
        text=models.CharField(max_length=256)
    )

    notify_after = models.DateTimeField(null=True, blank=True, default=None)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('experiment', 'modified',)
