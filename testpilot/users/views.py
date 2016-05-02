from django.conf import settings

from django.contrib.auth import logout

from rest_framework import status
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from ..experiments.models import UserInstallation
from ..experiments.serializers import UserInstallationSerializer
from .models import UserProfile
from .serializers import UserProfileSerializer

import logging
logger = logging.getLogger(__name__)


class MeViewSet(ViewSet):
    permission_classes = []

    def list(self, request):

        if not request.user.is_authenticated():
            return Response({})

        user = request.user
        profile = UserProfile.objects.get_profile(user)

        return Response({
            "id": user.email,
            "profile": UserProfileSerializer(
                profile,
                context={'request': request}).data,
            "addon": {
                "name": "Test Pilot",
                "url": settings.ADDON_URL
            },
            "installed": UserInstallationSerializer(
                UserInstallation.objects.filter(user=user), many=True,
                context={'request': request}).data
        })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def user_retire(request):
    user = request.user
    profile = UserProfile.objects.get_profile(user)
    result = {'id': user.id, 'username': user.username, 'unsubscribe': profile.unsubscribe()}
    logout(request)
    user.delete()
    return Response(result, status=status.HTTP_200_OK)


def register_views(router):
    router.register(r'me', MeViewSet, base_name='me')
