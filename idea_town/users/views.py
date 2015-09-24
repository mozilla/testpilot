from rest_framework.views import APIView
from rest_framework.response import Response

from ..experiments.models import (UserInstallation)
from ..experiments.serializers import ExperimentSerializer

import logging
logger = logging.getLogger(__name__)


class SelfView(APIView):
    permission_classes = []

    def get(self, request):

        if not request.user.is_authenticated():
            return Response({})

        user = request.user

        return Response({
            "id": user.email,
            "installed": [
                ExperimentSerializer(x.experiment,
                                     context={'request': request}).data
                for x in UserInstallation.objects.filter(user=user)
            ]
        })


def register_views(router):
    pass
