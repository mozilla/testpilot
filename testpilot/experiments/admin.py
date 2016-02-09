from django.contrib import admin

from hvad.admin import TranslatableAdmin, TranslatableTabularInline

from .models import (Experiment, ExperimentDetail, UserInstallation,
                     UserFeedback)
from ..utils import (show_image, parent_link, related_changelist_link,
                     translated)


class ExperimentDetailInline(TranslatableTabularInline):
    model = ExperimentDetail


class ExperimentAdmin(TranslatableAdmin):

    list_display = ('id',
                    show_image('thumbnail'),
                    translated('title'), translated('short_title'),
                    'version', 'addon_id',
                    related_changelist_link('details'),
                    related_changelist_link('users'),
                    related_changelist_link('feedbacks'),
                    'created', 'modified',)

    raw_id_fields = ('contributors',)

    inlines = (ExperimentDetailInline,)

    # Workaround for prepopulated_fields and fieldsets from here:
    # https://github.com/KristianOellegaard/django-hvad/issues/10#issuecomment-5572524
    def __init__(self, *args, **kwargs):
        super(ExperimentAdmin, self).__init__(*args, **kwargs)
        self.prepopulated_fields = {"slug": ("title",)}


class ExperimentDetailAdmin(TranslatableAdmin):
    list_display = ('id', parent_link('experiment'), 'order',
                    translated('headline'),
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
