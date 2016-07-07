from django.conf import settings

from rest_framework.viewsets import ViewSet
from rest_framework.response import Response

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
        })


def register_views(router):
    router.register(r'me', MeViewSet, base_name='me')
