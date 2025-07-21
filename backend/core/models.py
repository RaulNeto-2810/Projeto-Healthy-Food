from django.db import models
from django.utils import timezone

class Recipe(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_url = models.URLField(max_length=500, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.title