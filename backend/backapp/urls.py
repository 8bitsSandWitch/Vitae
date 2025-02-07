from django.urls import path
from .views import register, get_all_users, get_user

urlpatterns = [
    path('register/', register, name='register'),
    path('users/', get_all_users, name='get_all_users'),
    path('users/<int:user_id>/', get_user, name='get_user'),
]
