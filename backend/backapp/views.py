from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required, permission_required
from django.shortcuts import render, redirect
from django.contrib.auth import views as auth_views
from django.urls import path
from django.http import JsonResponse
from .models import Utilisateur
from .forms import RegisterForm

@login_required
def assign_user_to_group(request, user_id, group_name):
    user = Utilisateur.objects.get(id=user_id)
    group = Group.objects.get(name=group_name)
    user.groups.add(group)
    return redirect('some_view')

@login_required
@permission_required('backapp.add_cv', raise_exception=True)
def add_cv(request):
    # Logic to add CV
    return render(request, 'add_cv.html')

@login_required
@permission_required('backapp.filter_cv', raise_exception=True)
def filter_cv(request):
    # Logic to filter CVs
    return render(request, 'filter_cv.html')

def register(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'message': 'User registered successfully'}, status=201)
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    else:
        form = RegisterForm()
    return render(request, 'register.html', {'form': form})

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('register/', register, name='register'),
]
