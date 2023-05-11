from django.db import models
from django.contrib.auth.models import User
from profiles.models import Profile

# Create your models here.

class Post(models.Model):
    author = models.ForeignKey(Profile, on_delete=models.CASCADE)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)
    liked = models.ManyToManyField(User, blank=True)

    @property
    def like_count(self):
        return self.liked.all().count()

class TextPost(Post):
    title = models.CharField(max_length=200)
    body = models.TextField()

    def __str__(self):
        return str(self.title)

    class Meta:
        ordering = ("-created",)


class SongPost(Post):
    song_title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    year = models.CharField(max_length=4)
    audiofile = models.FileField(upload_to='audio/')

    def __str__(self):
        return str(self.song_title)
