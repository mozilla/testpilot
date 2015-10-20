import hashlib
import random
import os
from time import time

from django.conf import settings
from django.utils.deconstruct import deconstructible
from django.core.urlresolvers import reverse

from rest_framework import serializers

import logging
logger = logging.getLogger(__name__)


MK_UPLOAD_TMPL = getattr(
    settings, 'MK_UPLOAD_TMPL',
    '%(base)s/%(h1)s/%(h2)s/%(hash)s_%(field_fn)s_%(now)s_%(rand)04d%(ext)s')


class MarkupField(serializers.Field):
    """Serializer for django-markupfield MarkupField"""

    def to_internal_value(self, value):
        # TODO: This needs implementation if we do a writeable API that accepts
        # measurement field changes
        pass

    def to_representation(self, value):
        return value.rendered


@deconstructible
class HashedUploadTo(object):
    """Builds an upload_to function for naming file uploads"""

    def __init__(self, field_fn, tmpl=MK_UPLOAD_TMPL):
        self.field_fn = field_fn
        self.tmpl = tmpl

    def __call__(self, instance, filename):
        name, ext = os.path.splitext(filename)
        base = instance._meta.db_table
        slug = getattr(instance, 'slug', name)
        hash = (hashlib.md5(slug.encode('utf-8', 'ignore'))
                       .hexdigest())
        return self.tmpl % dict(
            now=int(time()), rand=random.randint(0, 1000), slug=slug[:50],
            base=base, field_fn=self.field_fn, pk=instance.pk, hash=hash,
            h1=hash[0], h2=hash[1], name=name, ext=ext)


def show_image(field_name, height="50"):
    """Helper to show images in admin changelist views"""

    def show_image_display(obj):
        if not hasattr(obj, field_name):
            return 'None'
        img_url = "%s%s" % (settings.MEDIA_URL, getattr(obj, field_name))
        return ('<a href="%s" target="_new"><img src="%s" height="%s" /></a>' %
                (img_url, img_url, height))

    show_image_display.allow_tags = True
    show_image_display.short_description = field_name

    return show_image_display


def parent_link(field_name):
    """Helper to link to parent model in admin changelists"""

    def build_link(self):

        parent = getattr(self, field_name)

        field = self._meta.get_field(field_name)
        parent_app_name = field.related_model._meta.app_label
        parent_model_name = field.related_model._meta.model_name

        url = reverse(
            'admin:%s_%s_change' % (parent_app_name, parent_model_name),
            args=[parent.id])
        return '<a href="%s">%s</a>' % (url, parent)

    build_link.allow_tags = True
    build_link.short_description = field_name

    return build_link


def related_changelist_link(field_name):
    """Helper to link to related models from parent in admin changelists"""

    def build_link(self):

        field = self._meta.get_field(field_name)
        queryset = getattr(self, field_name)

        parent_model_name = self._meta.model_name

        if hasattr(queryset, 'through'):
            model = queryset.through
        else:
            model = field.related_model

        model_name = model._meta.model_name
        app_name = model._meta.app_label
        name_single = model._meta.verbose_name
        name_plural = model._meta.verbose_name_plural

        link = '%s?%s' % (
            reverse('admin:%s_%s_changelist' % (app_name, model_name), args=[]),
            '%s__exact=%s' % (parent_model_name, self.id))

        new_link = '%s?%s' % (
            reverse('admin:%s_%s_add' % (app_name, model_name), args=[]),
            '%s=%s' % (parent_model_name, self.id))

        count = queryset.count()
        what = (count == 1) and name_single or name_plural
        return ('<a href="%s">%s %s</a> (<a class="addlink" href="%s">add</a>)' %
                (link, count, what, new_link))

    build_link.allow_tags = True
    build_link.short_description = field_name

    return build_link
