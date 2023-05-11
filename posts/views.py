from operator import itemgetter
from django.shortcuts import render
from .models import TextPost, SongPost, Post
from django.http import JsonResponse
from .forms import TextPostForm, AudioPostForm
from profiles.models import Profile

# Create your views here.

def post_list_and_create(request):

    if request.method == 'POST' and request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        form = TextPostForm(request.POST)
        audio_form = AudioPostForm(request.POST,request.FILES)

        if form.is_valid():
            author = Profile.objects.get(user=request.user)
            post_instance = form.save(commit=False)
            post_instance.author = author
            post_instance.save()
            return JsonResponse({
                'title': post_instance.title,
                'body': post_instance.body,
                'author': post_instance.author.user.username,
                'id': post_instance.id,
            })
        elif audio_form.is_valid():
            author = Profile.objects.get(user=request.user)
            audio_post_instance = audio_form.save(commit=False)
            audio_post_instance.author = author
            audio_post_instance.save()
            return JsonResponse({
                'song_title':audio_post_instance.song_title,
                'artist': audio_post_instance.artist,
                'author': audio_post_instance.author.user.username,
                'song_id': audio_post_instance.id,
            })
        else:
            return JsonResponse({'request': len(request.FILES)})
    else:
        form = TextPostForm()
        audio_form = AudioPostForm()

        context = {
            'form': form, 
            'audio_form': audio_form,
        }
        return render(request, 'posts/main.html', context)


def post_detail(request, pk, posttype):

    if posttype == 'song':
        obj = SongPost.objects.get(pk=pk)
        form = AudioPostForm()
    
    else:   # entro qui se posttype == 'text', se voglio inserire nuovo tipo di post devo gestire con elif
        obj = TextPost.objects.get(pk=pk)
        form = TextPostForm()

    context = {
        'obj': obj,
        'form': form,
    }
    return render(request, 'posts/detail.html', context)

def post_detail_data(request, pk, posttype):

    if posttype == 'song':
        obj = SongPost.objects.get(pk=pk)
        data = {
            'id': obj.id,
            'song_title': obj.song_title,
            'artist': obj.artist,
            'year': obj.year,
            'author': obj.author.user.username,
            'logged_in': request.user.username,
        }
    else:   # entro qui se posttype == 'text', se voglio inserire nuovo tipo di post devo gestire con elif
        obj = TextPost.objects.get(pk=pk)
        data = {
            'id': obj.id,
            'title': obj.title,
            'body': obj.body,
            'author': obj.author.user.username,
            'logged_in': request.user.username,
        }
    return JsonResponse({'data': data})

def load_posts_data_view(request, num_posts):
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        
        visible = 3
        upper = num_posts
        lower = upper - visible

        # costruisco lista di tutti i post ordinati per data di upload del post
        
        size = TextPost.objects.all().count() + SongPost.objects.all().count()

        text_post_qs = TextPost.objects.all()
        text_post_data = []
        for obj in text_post_qs:
            item = {
                'id': obj.id,
                'title': obj.title,
                'body': obj.body,
                'liked': True if request.user in obj.liked.all() else False,
                'author': obj.author.user.username,
                'count': obj.like_count,
                'created': obj.created,
            }
            text_post_data.append(item)

        song_post_qs = SongPost.objects.all()
        song_post_data = []     
        for obj in song_post_qs:
            item = {
                'id': obj.id,
                'song_title': obj.song_title,
                'artist': obj.artist,
                'year': obj.year,

                'liked': True if request.user in obj.liked.all() else False,
                'author': obj.author.user.username,
                'count': obj.like_count,
                'created': obj.created,
            }
            song_post_data.append(item)
        
        all_posts = text_post_data + song_post_data
        all_posts_sorted = sorted(all_posts, key=itemgetter('created'), reverse=True)

        return JsonResponse({'data':all_posts_sorted[lower:upper], 'size':size})

def like_unlike_post(request):
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':

        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)

        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked': liked, 'count': obj.like_count})

def update_post(request, pk, posttype):

    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        if posttype == 'song':

            obj = SongPost.objects.get(pk=pk)
            
            new_song_title = request.POST.get('song_title')
            new_artist = request.POST.get('artist')
            new_year = request.POST.get('year')

            obj.song_title = new_song_title
            obj.artist = new_artist
            obj.year = new_year
            obj.save()

            return JsonResponse({
                'song_title': new_song_title,
                'artist': new_artist,
                'year': new_year,
            })
        else:   # entro qui se posttype == 'text', se voglio inserire nuovo tipo di post devo gestire con elif

            
            obj = TextPost.objects.get(pk=pk)

            new_title = request.POST.get('title')
            new_body = request.POST.get('body')

            obj.title = new_title
            obj.body = new_body
            obj.save()

            return JsonResponse({
                'title': new_title,
                'body': new_body,
            })

def delete_post(request, pk, posttype):
    if posttype == 'song':
        obj = SongPost.objects.get(pk=pk)
    else:
        obj = TextPost.objects.get(pk=pk)
    if request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest':
        obj.delete()
        return JsonResponse({})
