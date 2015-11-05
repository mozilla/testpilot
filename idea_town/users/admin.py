from django.contrib import admin

from .models import UserProfile
from ..utils import show_avatar, parent_link


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', parent_link('user'), show_avatar('avatar'),
                    'display_name', 'title', 'created', 'modified',)
    raw_id_fields = ('user',)


for x in ((UserProfile, UserProfileAdmin),):
    admin.site.register(*x)
