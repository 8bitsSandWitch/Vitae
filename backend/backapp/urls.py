from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register, name='register'),
    path('users/', views.get_all_users, name='get_all_users'),
    path('users/<int:user_id>/', views.get_user, name='get_user'),
    path('login/', views.login_view, name='login_view'),
    path('api/upload/', views.upload_cv, name='upload_cv'),
    path('api/post-job/', views.post_job, name='post_job'),
    path('api/jobs/', views.list_jobs, name='list_jobs'),
    path('api/filter-cv/', views.filter_cv, name='filter_cv'),
]
