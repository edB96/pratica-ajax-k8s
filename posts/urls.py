from django.urls import path
from .views import (
    post_list_and_create,
    load_posts_data_view,
    like_unlike_post,
    post_detail,
    post_detail_data,
    update_post,
    delete_post,
)

app_name = 'posts'

urlpatterns = [
    path('', post_list_and_create, name='main-page'),

    path('like-unlike/', like_unlike_post, name='like-unlike'),

    path('<int:pk>/<str:posttype>/', post_detail, name='post-detail'),
    path('<int:pk>/<str:posttype>/data/', post_detail_data, name='post-detail-data'),
    path('<int:pk>/<str:posttype>/update/', update_post, name='post-update'),
    path('<int:pk>/<str:posttype>/delete/', delete_post, name='post-delete'),

    path('data/<int:num_posts>/', load_posts_data_view, name='data'),
]