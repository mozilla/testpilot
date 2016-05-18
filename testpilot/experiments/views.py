from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import (detail_route, permission_classes,
                                       api_view)

from django.shortcuts import get_object_or_404

from .models import (Experiment, ExperimentDetail, UserInstallation)
from .serializers import (ExperimentSerializer,
                          ExperimentDetailSerializer,
                          UserInstallationSerializer)
from ..utils import IsAccountAdminOrReadOnly

import logging
logger = logging.getLogger(__name__)


class ExperimentViewSet(viewsets.ModelViewSet):
    """
    Returns a list of all Experiments in the system.
    """
    serializer_class = ExperimentSerializer
    permission_classes = (IsAccountAdminOrReadOnly,)

    def get_queryset(self):
        return Experiment.objects.language().fallbacks('en')

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
        logging.getLogger('testpilot.test-install').info('', extra={
            'uid': request.user.id,
            'context': experiment.title
        })
    else:
        installation = get_object_or_404(
            UserInstallation,
            user=request.user, experiment=experiment, client_id=client_id)

    if 'DELETE' == request.method:
        installation.delete()
        return Response({}, status=status.HTTP_410_GONE)

    return Response(UserInstallationSerializer(
        installation, context={'request': request}).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def features_list(request, experiment_pk, client_id):
    experiment = get_object_or_404(Experiment, pk=experiment_pk)
    installation = get_object_or_404(
        UserInstallation,
        user=request.user, experiment=experiment, client_id=client_id)
    return Response(installation.features)


class ExperimentDetailViewSet(viewsets.ModelViewSet):
    serializer_class = ExperimentDetailSerializer
    permission_classes = (IsAccountAdminOrReadOnly,)

    def get_queryset(self):
        return ExperimentDetail.objects.language().fallbacks('en')


def register_views(router):
    router.register(r'experiments', ExperimentViewSet, base_name='experiment')
    router.register(r'details', ExperimentDetailViewSet, base_name='experimentdetail')
