from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from .models import (Experiment, ExperimentDetail, UserFeedback)
from .serializers import (ExperimentSerializer,
                          ExperimentDetailSerializer,
                          UserFeedbackSerializer)
from ..utils import IsRequestUserBackend

import logging
logger = logging.getLogger(__name__)


class ExperimentViewSet(viewsets.ModelViewSet):
    """
    Returns a list of all Experiments in the system.
    """
    queryset = Experiment.objects.all()
    serializer_class = ExperimentSerializer

    def retrieve(self, request, *args, **kwargs):
        """Use the deep serializer for individual retrieval, which includes
        ExperimentDetail items"""
        instance = self.get_object()
        serializer = ExperimentSerializer(
            instance, context=self.get_serializer_context())
        return Response(serializer.data)

    @detail_route()
    def details(self, request, pk=None):
        instance = self.get_object()
        queryset = instance.details.all()
        serializer = ExperimentDetailSerializer(
            queryset, many=True,
            context=self.get_serializer_context())
        return Response(serializer.data)


class ExperimentDetailViewSet(viewsets.ModelViewSet):
    queryset = ExperimentDetail.objects.all()
    serializer_class = ExperimentDetailSerializer


class UserFeedbackViewSet(viewsets.ModelViewSet):
    queryset = UserFeedback.objects.all()
    serializer_class = UserFeedbackSerializer
    filter_backends = (IsRequestUserBackend,)
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(user=self.request.user)


def register_views(router):
    router.register(r'experiments', ExperimentViewSet)
    router.register(r'details', ExperimentDetailViewSet)
    router.register(r'feedback', UserFeedbackViewSet, base_name='userfeedback')
