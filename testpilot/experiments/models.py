import json
import random

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

    @cached_property
    def features(self):
        return FeatureState.objects.get_for_installation(self)


class Feature(models.Model):
    experiment = models.ForeignKey(Experiment, related_name='features',
                                   db_index=True)
    slug = models.SlugField(max_length=128, unique=True, db_index=True)
    title = models.CharField(max_length=128)
    default_active = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)


class FeatureConditionManager(models.Manager):

    operator_registry = {}

    def register_operator(self, name, description=''):
        """Decorator to register a condition operator function"""
        def decorator(func):
            self.operator_registry[name] = dict(
                func=func, description=description)
            return func
        return decorator

    def get_operator_choices(self):
        """Assemble list of operator choices for form fields"""
        return [
            (name, '%s: %s' % (name, operator['description']))
            for name, operator in self.operator_registry.items()
        ]

    def apply_conditions_for_installation(self, installation):
        conditions = FeatureCondition.objects.filter(
            experiment=installation.experiment)
        for condition in conditions:
            operator = self.operator_registry.get(condition.operator, None)
            if operator is not None:
                # TODO: Report some error on an unknown operator?
                operator['func'](condition, installation)


class FeatureCondition(models.Model):
    objects = FeatureConditionManager()

    experiment = models.ForeignKey(Experiment, related_name='conditions',
                                   db_index=True)
    operator = models.CharField(max_length=256, choices=[('', 'None'), ])
    argument = models.TextField()
    comment = models.TextField(blank=True)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)


class FeatureStateManager(models.Manager):

    def get_for_installation(self, installation):
        experiment = installation.experiment

        out = dict()

        # Gather default active values for defined features
        features = Feature.objects.filter(experiment=experiment)
        out.update((f.slug, f.default_active) for f in features)

        # Apply conditions, which will set some states if necessary
        FeatureCondition.objects.apply_conditions_for_installation(installation)

        # Update with installation-specific feature FeatureState
        states = FeatureState.objects.filter(installation=installation)
        out.update((s.feature.slug, s.active) for s in states)

        return out


class FeatureState(models.Model):
    objects = FeatureStateManager()

    installation = models.ForeignKey(UserInstallation, blank=True, null=True)
    feature = models.ForeignKey('Feature', related_name='states',
                                db_index=True)
    active = models.BooleanField(default=False)

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)


@FeatureCondition.objects.register_operator(
    'random_bucket',
    'Pick a random feature from a list')
def operator_random_bucket(condition, installation):
    buckets = json.loads(condition.argument)
    states = dict((s.feature.slug, s.active) for s in
                  FeatureState.objects.filter(installation=installation))

    # Check if the user is already in a bucket - bail out if so.
    for bucket in buckets:
        if states.get(bucket, False):
            return

    # Attempt to activate state for a random bucket
    bucket = random.choice(buckets)
    try:
        feature = Feature.objects.get(slug=bucket)
        FeatureState.objects.get_or_create(installation=installation,
                                           feature=feature, active=True)
    except Feature.DoesNotExist:
        # TODO: Report an error on a bucket name not matching a feature?
        pass
