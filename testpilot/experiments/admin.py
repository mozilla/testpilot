from django.contrib import admin

from hvad.admin import TranslatableAdmin, TranslatableTabularInline

from .models import (Experiment, ExperimentDetail, UserInstallation,
                     Feature, FeatureCondition)
from ..utils import (show_image, parent_link, related_changelist_link,
                     translated)


class ExperimentDetailInline(TranslatableTabularInline):
    model = ExperimentDetail
    extra = 0


class FeatureInline(admin.TabularInline):
    model = Feature
    extra = 0


class FeatureConditionInline(admin.TabularInline):
    model = FeatureCondition
    extra = 0

    def formfield_for_choice_field(self, db_field, request, **kwargs):
        if db_field.name == 'operator':
            kwargs['choices'] = FeatureCondition.objects.get_operator_choices()
        return (super(FeatureConditionInline, self)
                .formfield_for_choice_field(db_field, request, **kwargs))


class ExperimentAdmin(TranslatableAdmin):

    list_display = ('id',
                    show_image('thumbnail'),
                    translated('title'), translated('short_title'),
                    'version', 'addon_id',
                    related_changelist_link('details'),
                    related_changelist_link('users'),
                    'created', 'modified',)

    raw_id_fields = ('contributors',)

    inlines = (ExperimentDetailInline, FeatureInline, FeatureConditionInline, )

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


for x in ((Experiment, ExperimentAdmin),
          (ExperimentDetail, ExperimentDetailAdmin),
          (UserInstallation, UserInstallationAdmin),):
    admin.site.register(*x)
