from rest_framework import serializers
from django.core.urlresolvers import reverse

from .models import (Experiment, ExperimentDetail)


class ExperimentDetailSerializer(serializers.HyperlinkedModelSerializer):
    experiment_url = serializers.SerializerMethodField()

    class Meta:
        model = ExperimentDetail
        fields = ('url', 'order', 'headline', 'image', 'copy', 'experiment_url')

    def get_experiment_url(self, obj):
        request = self.context['request']
        path = reverse('experiment-detail', args=(obj.experiment.pk,))
        return request.build_absolute_uri(path)


class ExperimentDeepSerializer(serializers.HyperlinkedModelSerializer):
    """Deep Experiment serializer that includes ExperimentDetails"""
    details = ExperimentDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Experiment
        fields = ('url', 'title', 'slug', 'thumbnail', 'description', 'details')


class ExperimentSerializer(serializers.HyperlinkedModelSerializer):
    """Shallow Experiment serializer that links to a set of ExperimentDetails"""
    details_url = serializers.SerializerMethodField()

    class Meta:
        model = Experiment
        fields = ('url', 'title', 'slug', 'thumbnail', 'description', 'details_url')

    def get_details_url(self, obj):
        request = self.context['request']
        path = reverse('experiment-details', args=(obj.pk,))
        return request.build_absolute_uri(path)
