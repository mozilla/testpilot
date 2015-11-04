from django.contrib import admin

from .models import UserProfile
from ..utils import show_image, parent_link


class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', parent_link('user'), show_image('avatar'),
                    'display_name', 'title', 'invite_pending',
                    'created', 'modified',)
    list_filter = ('invite_pending',)
    raw_id_fields = ('user',)


for x in ((UserProfile, UserProfileAdmin),):
    admin.site.register(*x)
