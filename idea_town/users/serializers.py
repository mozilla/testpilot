from rest_framework import serializers

from .models import UserProfile


class UserProfileSerializer(serializers.HyperlinkedModelSerializer):
    username = serializers.SerializerMethodField()
    display_name = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ('username', 'display_name', 'title', 'avatar',)

    def get_username(self, obj):
        return obj.user.username

    def get_display_name(self, obj):
        user = obj.user
        # Could also use first/last name here, but it's a bad l10n assumption
        if obj.display_name:
            return obj.display_name
        else:
            return user.username

    def get_avatar(self, obj):
        if obj.avatar:
            request = self.context['request']
            return request.build_absolute_uri(obj.avatar.url)
        else:
            return None
