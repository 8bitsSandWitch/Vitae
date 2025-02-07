from django.urls import path
from .views import assign_user_to_group, add_cv, filter_cv, register
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('assign_user_to_group/<int:user_id>/<str:group_name>/', assign_user_to_group, name='assign_user_to_group'),
    path('add_cv/', add_cv, name='add_cv'),
    path('filter_cv/', filter_cv, name='filter_cv'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('register/', register, name='register'),
]
