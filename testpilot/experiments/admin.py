from django.contrib import admin

from hvad.admin import TranslatableAdmin, TranslatableTabularInline

from .models import (Experiment, ExperimentDetail, ExperimentTourStep)
from ..utils import (show_image, parent_link, related_changelist_link,
                     translated)


class ExperimentDetailInline(TranslatableTabularInline):
    model = ExperimentDetail
    extra = 0


class ExperimentTourStepInline(TranslatableTabularInline):
    model = ExperimentTourStep
    extra = 0


class ExperimentAdmin(TranslatableAdmin):

    list_display = ('id',
                    show_image('thumbnail'),
                    translated('title'), translated('short_title'),
                    'version', 'addon_id',
                    related_changelist_link('details'),
                    'created', 'modified',)

    raw_id_fields = ('contributors',)

    inlines = (ExperimentTourStepInline, ExperimentDetailInline,)

    # Workaround for prepopulated_fields and fieldsets from here:
    # https://github.com/KristianOellegaard/django-hvad/issues/10#issuecomment-5572524
    def __init__(self, *args, **kwargs):
        super(ExperimentAdmin, self).__init__(*args, **kwargs)
        self.prepopulated_fields = {"slug": ("title",)}


class ExperimentDetailAdmin(TranslatableAdmin):
    list_display = ('id', parent_link('experiment'), 'order',
                    translated('headline'),
                    show_image('image'), 'created', 'modified',)


class ExperimentTourStepAdmin(TranslatableAdmin):
    list_display = ('id', parent_link('experiment'), 'order',
                    show_image('image'), translated('copy'),
                    'created', 'modified',)


for x in ((Experiment, ExperimentAdmin),
          (ExperimentDetail, ExperimentDetailAdmin),
          (ExperimentTourStep, ExperimentTourStepAdmin),):
    admin.site.register(*x)
