from django.db import models

from hvad.models import TranslatableModel, TranslatedFields
from hvad.manager import TranslationManager

from ..utils import HashedUploadTo


socialtwitter_upload_to = HashedUploadTo('image')
socialfacebook_upload_to = HashedUploadTo('image')


class SocialMetadataManager(TranslationManager):
    """
    Custom manager for the SocialMetadata model.
    """
    def for_request(self, request):
        """
        Return a model instance for the object corresponding to the passed
        request object's path, with stripped trailing slashes. Returns None if
        no object is found.
        """
        url = request.path
        if url.endswith('/'):
            url = url[:-1]
        try:
            return self.get(url=url)
        except self.model.DoesNotExist:
            return None


class SocialMetadata(TranslatableModel):
    """
    Sharing metadata for a given URL.
    """
    objects = SocialMetadataManager()

    translations = TranslatedFields(
        title=models.CharField(max_length=256),
        description=models.TextField(),
    )

    image_twitter = models.ImageField(upload_to=socialtwitter_upload_to,
                                      help_text='560x300')
    image_facebook = models.ImageField(upload_to=socialfacebook_upload_to,
                                       help_text='1200x1200, crop to 1200x630')
    url = models.CharField(max_length=128, unique=True,
                           help_text='e.g. /experiments/activity-stream')

    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.url

    def save(self, *args, **kwargs):
        """
        Strip any trailing slashes in the URL field before saving. The manager
        will ensure that filters or excludes for objects with URLs with
        trailing slashes are equivalent to those for objects with.
        """
        if self.url.endswith('/'):
            self.url = self.url[:-1]
        super(SocialMetadata, self).save(*args, **kwargs)
