import json

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import detail_route

from django.shortcuts import get_object_or_404
from django.contrib.staticfiles.views import serve

from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt

import waffle

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

    def list(self, request, *args, **kwargs):
        # Switch between static experiments JSON or dynamic API data based on
        # waffle flag static_experiments_json
        if waffle.flag_is_active(request, 'static_experiments_json'):
            return serve(request, path='api/experiments.json')

        return super(ExperimentViewSet, self).list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """Use the deep serializer for individual retrieval, which includes
        ExperimentDetail items"""
        # Switch between static experiments JSON or dynamic API data based on
        # waffle flag static_experiments_json
        if waffle.flag_is_active(request, 'static_experiments_json'):
            return serve(request, path='api/experiments/%s.json' % kwargs['pk'])

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


@csrf_exempt
def installation_detail(request, experiment_pk, client_id):
    experiment = get_object_or_404(Experiment, pk=experiment_pk)

    if 'PUT' == request.method:
        installation, created = UserInstallation.objects.get_or_create(
            experiment=experiment, client_id=client_id)
        installation.save()
        logging.getLogger('testpilot.test-install').info('', extra={
            'uid': request.user.id,
            'context': experiment.title
        })
    else:
        installation = get_object_or_404(
            UserInstallation,
            experiment=experiment, client_id=client_id)

    if 'DELETE' == request.method:
        installation.delete()
        return HttpResponse('{}', status=status.HTTP_410_GONE)

    return HttpResponse(json.dumps(UserInstallationSerializer(
        installation, context={'request': request}).data))


class ExperimentDetailViewSet(viewsets.ModelViewSet):
    serializer_class = ExperimentDetailSerializer
    permission_classes = (IsAccountAdminOrReadOnly,)

    def get_queryset(self):
        return ExperimentDetail.objects.language().fallbacks('en')


def register_views(router):
    router.register(r'experiments', ExperimentViewSet, base_name='experiment')
    router.register(r'details', ExperimentDetailViewSet, base_name='experimentdetail')
