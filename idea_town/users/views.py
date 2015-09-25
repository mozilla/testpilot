from django.conf import settings

from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

from ..experiments.models import (UserInstallation)
from ..experiments.serializers import ExperimentSerializer

import logging
logger = logging.getLogger(__name__)


class MeViewSet(ViewSet):
    permission_classes = []

    def list(self, request):

        if not request.user.is_authenticated():
            return Response({})

        user = request.user

        return Response({
            "id": user.email,
            "addon": {
                "name": "Idea Town",
                "url": settings.ADDON_URL
            },
            "installed": [
                ExperimentSerializer(x.experiment,
                                     context={'request': request}).data
                for x in UserInstallation.objects.filter(user=user)
            ]
        })


def register_views(router):
    router.register(r'me', MeViewSet, base_name='me')
