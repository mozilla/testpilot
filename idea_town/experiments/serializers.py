from rest_framework import serializers
from django.core.urlresolvers import reverse

from ..users.models import UserProfile
from ..users.serializers import UserProfileSerializer
from .models import (Experiment, ExperimentDetail)
from ..utils import MarkupField


class ExperimentDetailSerializer(serializers.HyperlinkedModelSerializer):
    experiment_url = serializers.SerializerMethodField()

    class Meta:
        model = ExperimentDetail
        fields = ('url', 'order', 'headline', 'image', 'copy', 'experiment_url')

    def get_experiment_url(self, obj):
        request = self.context['request']
        path = reverse('experiment-detail', args=(obj.experiment.pk,))
        return request.build_absolute_uri(path)


class ExperimentSerializer(serializers.HyperlinkedModelSerializer):
    """Experiment serializer that includes ExperimentDetails"""
    details = ExperimentDetailSerializer(many=True, read_only=True)
    contributors = serializers.SerializerMethodField()
    measurements = MarkupField()

    class Meta:
        model = Experiment
        fields = ('id', 'url', 'title', 'slug', 'thumbnail', 'description',
                  'version', 'changelog_url', 'contribute_url', 'measurements',
                  'xpi_url', 'addon_id', 'users', 'details', 'contributors',
                  'created', 'modified',)

    def get_contributors(self, obj):
        request = self.context['request']
        return [
            UserProfileSerializer(UserProfile.objects.get_profile(user),
                                  context={'request': request}).data
            for user in obj.contributors.all()
        ]
