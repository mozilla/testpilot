from django.contrib import admin

from hvad.admin import TranslatableAdmin

from .models import SocialMetadata
from ..utils import translated


class SocialMetadataAdmin(TranslatableAdmin):
    list_display = ('id', translated('title'), 'url')


admin.site.register(SocialMetadata, SocialMetadataAdmin)
