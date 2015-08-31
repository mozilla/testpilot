from django.contrib import admin

from .models import (Experiment, ExperimentDetail, UserInstallation)
from ..utils import (show_image, parent_link, related_changelist_link)


class ExperimentDetailInline(admin.TabularInline):
    model = ExperimentDetail


class ExperimentAdmin(admin.ModelAdmin):

    list_display = ('id', 'title', 'xpi_url',
                    show_image('thumbnail'),
                    related_changelist_link('details'),
                    related_changelist_link('users'),
                    'created', 'modified',)

    prepopulated_fields = {"slug": ("title",)}

    inlines = (ExperimentDetailInline,)


class ExperimentDetailAdmin(admin.ModelAdmin):

    list_display = ('id', parent_link('experiment'), 'order', 'headline',
                    show_image('image'), 'created', 'modified',)


class UserInstallationAdmin(admin.ModelAdmin):

    list_display = ('id', parent_link('experiment'), parent_link('user'),
                    'created', 'modified',)


for x in ((Experiment, ExperimentAdmin),
          (ExperimentDetail, ExperimentDetailAdmin),
          (UserInstallation, UserInstallationAdmin),):
    admin.site.register(*x)
