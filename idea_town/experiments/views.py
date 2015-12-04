from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import (detail_route, permission_classes,
                                       api_view)

from django.shortcuts import get_object_or_404

from .models import (Experiment, ExperimentDetail, UserFeedback,
                     UserInstallation)
from .serializers import (ExperimentSerializer,
                          ExperimentDetailSerializer,
                          UserFeedbackSerializer,
                          UserInstallationSerializer)
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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def installation_list(request, experiment_pk):
    experiment = get_object_or_404(Experiment, pk=experiment_pk)
    queryset = UserInstallation.objects.filter(
        user=request.user, experiment=experiment)
    return Response(UserInstallationSerializer(
        queryset, many=True, context={'request': request}).data)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def installation_detail(request, experiment_pk, client_id):
    experiment = get_object_or_404(Experiment, pk=experiment_pk)

    if 'PUT' == request.method:
        installation, created = UserInstallation.objects.get_or_create(
            user=request.user, experiment=experiment, client_id=client_id)
        installation.save()
    else:
        installation = get_object_or_404(
            UserInstallation,
            user=request.user, experiment=experiment, client_id=client_id)

    if 'DELETE' == request.method:
        installation.delete()
        return Response({}, status=status.HTTP_410_GONE)

    return Response(UserInstallationSerializer(
        installation, context={'request': request}).data)


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
