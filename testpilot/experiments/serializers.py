from rest_framework import serializers
from hvad.contrib.restframework import HyperlinkedTranslatableModelSerializer
from django.core.urlresolvers import reverse

from ..users.models import UserProfile
from ..users.serializers import UserProfileSerializer
from .models import (Experiment, ExperimentDetail, ExperimentTourStep,
                     ExperimentNotification, UserInstallation)
from ..utils import MarkupField


class ExperimentDetailSerializer(HyperlinkedTranslatableModelSerializer):
    experiment_url = serializers.SerializerMethodField()

    class Meta:
        model = ExperimentDetail
        fields = ('url', 'order', 'headline', 'image', 'copy',
                  'experiment_url')

    def get_experiment_url(self, obj):
        request = self.context['request']
        path = reverse('experiment-detail', args=(obj.experiment.pk,))
        return request.build_absolute_uri(path)


class ExperimentTourStepSerializer(HyperlinkedTranslatableModelSerializer):
    experiment_url = serializers.SerializerMethodField()

    class Meta:
        model = ExperimentTourStep
        fields = ('order', 'image', 'copy', 'experiment_url')

    def get_experiment_url(self, obj):
        request = self.context['request']
        path = reverse('experiment-detail', args=(obj.experiment.pk,))
        return request.build_absolute_uri(path)


class ExperimentNotificationSerializer(HyperlinkedTranslatableModelSerializer):
    class Meta:
        model = ExperimentNotification
        fields = ('id', 'title', 'text', 'notify_after')


class ExperimentSerializer(HyperlinkedTranslatableModelSerializer):
    """Experiment serializer that includes ExperimentDetails"""
    details = ExperimentDetailSerializer(many=True, read_only=True)
    tour_steps = ExperimentTourStepSerializer(many=True, read_only=True)
    notifications = ExperimentNotificationSerializer(many=True, read_only=True)
    contributors = serializers.SerializerMethodField()
    html_url = serializers.SerializerMethodField()
    installations_url = serializers.SerializerMethodField()
    survey_url = serializers.SerializerMethodField()
    measurements = MarkupField()
    introduction = MarkupField()

    class Meta:
        model = Experiment
        fields = ('id', 'url', 'title', 'short_title', 'slug',
                  'thumbnail', 'description', 'introduction',
                  'version', 'html_url', 'changelog_url', 'contribute_url',
                  'bug_report_url', 'discourse_url', 'privacy_notice_url', 'measurements',
                  'xpi_url', 'addon_id', 'gradient_start', 'gradient_stop',
                  'details', 'tour_steps', 'notifications', 'contributors',
                  'survey_url', 'installations_url',
                  'installation_count', 'created', 'modified', 'order',)

    def get_html_url(self, obj):
        request = self.context['request']
        path = '/experiments/%s' % obj.slug
        return request.build_absolute_uri(path)

    def get_contributors(self, obj):
        request = self.context['request']
        return [
            UserProfileSerializer(UserProfile.objects.get_profile(user),
                                  context={'request': request}).data
            for user in obj.contributors.all()
        ]

    def get_installations_url(self, obj):
        request = self.context['request']
        path = '%s/installations/' % reverse('experiment-detail', args=(obj.pk,))
        return request.build_absolute_uri(path)

    def get_survey_url(self, obj):
        return 'https://qsurvey.mozilla.com/s3/%s' % obj.slug


class UserInstallationSerializer(serializers.HyperlinkedModelSerializer):
    url = serializers.SerializerMethodField()
    addon_id = serializers.SerializerMethodField()

    class Meta:
        model = UserInstallation
        fields = ('url', 'experiment', 'client_id', 'addon_id',
                  'created', 'modified')

    def get_url(self, obj):
        request = self.context['request']
        path = reverse('experiment-installation-detail',
                       args=(obj.experiment.pk, obj.client_id))
        return request.build_absolute_uri(path)

    def get_addon_id(self, obj):
        return obj.experiment.addon_id
