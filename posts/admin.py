from django.contrib import admin
from .models import Post, SongPost, TextPost

# Register your models here.

admin.site.register(Post)
admin.site.register(SongPost)
admin.site.register(TextPost)