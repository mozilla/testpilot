from rest_framework import serializers
from django.core.urlresolvers import reverse

from ..users.models import UserProfile
from ..users.serializers import UserProfileSerializer
from .models import (Experiment, ExperimentDetail, UserFeedback, UserInstallation)
from ..utils import MarkupField


class ExperimentDetailSerializer(serializers.HyperlinkedModelSerializer):
    experiment_url = serializers.SerializerMethodField()

    class Meta:
        model = ExperimentDetail
        fields = ('url', 'order', 'headline', 'image', 'copy',
                  'experiment_url')

    def get_experiment_url(self, obj):
        request = self.context['request']
        path = reverse('experiment-detail', args=(obj.experiment.pk,))
        return request.build_absolute_uri(path)


class ExperimentSerializer(serializers.HyperlinkedModelSerializer):
    """Experiment serializer that includes ExperimentDetails"""
    details = ExperimentDetailSerializer(many=True, read_only=True)
    contributors = serializers.SerializerMethodField()
    installations_url = serializers.SerializerMethodField()
    measurements = MarkupField()

    class Meta:
        model = Experiment
        fields = ('id', 'url', 'title', 'slug', 'thumbnail', 'description',
                  'version', 'changelog_url', 'contribute_url', 'measurements',
                  'xpi_url', 'addon_id', 'details', 'contributors',
                  'installations_url',
                  'created', 'modified',)

    def get_contributors(self, obj):
        request = self.context['request']
        return [
            UserProfileSerializer(UserProfile.objects.get_profile(user),
                                  context={'request': request}).data
            for user in obj.contributors.all()
        ]

    def get_installations_url(self, obj):
        request = self.context['request']
        path = reverse('experiment-installation-list',
                       args=(obj.pk,))
        return request.build_absolute_uri(path)


class UserFeedbackSerializer(serializers.HyperlinkedModelSerializer):

    class Meta:
        model = UserFeedback
        fields = ('url', 'experiment', 'question', 'answer', 'extra',
                  'created', 'modified')


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
