from django.contrib import admin

from .models import (Experiment, ExperimentDetail, UserInstallation,
                     UserFeedback)
from ..utils import (show_image, parent_link, related_changelist_link)


class ExperimentDetailInline(admin.TabularInline):
    model = ExperimentDetail


class ExperimentAdmin(admin.ModelAdmin):

    list_display = ('id',
                    show_image('thumbnail'),
                    'title', 'short_title', 'version', 'addon_id',
                    related_changelist_link('details'),
                    related_changelist_link('users'),
                    related_changelist_link('feedbacks'),
                    'created', 'modified',)

    prepopulated_fields = {"slug": ("title",)}

    raw_id_fields = ('contributors',)

    inlines = (ExperimentDetailInline,)


class ExperimentDetailAdmin(admin.ModelAdmin):

    list_display = ('id', parent_link('experiment'), 'order', 'headline',
                    show_image('image'), 'created', 'modified',)


class UserInstallationAdmin(admin.ModelAdmin):

    list_display = ('id', parent_link('experiment'), parent_link('user'),
                    'client_id',
                    'created', 'modified',)

    list_filter = ('experiment',)


class UserFeedbackAdmin(admin.ModelAdmin):

    list_display = ('id', parent_link('experiment'), parent_link('user'),
                    'question', 'answer',
                    'created', 'modified',)

    list_filter = ('experiment', 'question',)


for x in ((Experiment, ExperimentAdmin),
          (ExperimentDetail, ExperimentDetailAdmin),
          (UserFeedback, UserFeedbackAdmin),
          (UserInstallation, UserInstallationAdmin),):
    admin.site.register(*x)
