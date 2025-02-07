from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required, permission_required
from django.shortcuts import render, redirect
from django.contrib.auth import views as auth_views
from django.urls import path
from django.http import JsonResponse
from .models import Utilisateur
from .forms import RegisterForm
from .serializers import UtilisateurSerializer
import logging
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Get an instance of a logger
logger = logging.getLogger(__name__)

@login_required
def assign_user_to_group(request, user_id, group_name):
    try:
        user = Utilisateur.objects.get(id=user_id)
        group = Group.objects.get(name=group_name)
        user.groups.add(group)
        return redirect('some_view')
    except Exception as e:
        logger.error(f"Error in assign_user_to_group: {str(e)}")
        return JsonResponse({'error': 'An error occurred'}, status=500)

@login_required
@permission_required('backapp.add_cv', raise_exception=True)
def add_cv(request):
    try:
        # Logic to add CV
        return render(request, 'add_cv.html')
    except Exception as e:
        logger.error(f"Error in add_cv: {str(e)}")
        return JsonResponse({'error': 'An error occurred'}, status=500)

@login_required
@permission_required('backapp.filter_cv', raise_exception=True)
def filter_cv(request):
    try:
        # Logic to filter CVs
        return render(request, 'filter_cv.html')
    except Exception as e:
        logger.error(f"Error in filter_cv: {str(e)}")
        return JsonResponse({'error': 'An error occurred'}, status=500)

@csrf_exempt
@api_view(['POST'])
def register(request):
    try:
        if request.method == 'POST':
            serializer = UtilisateurSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                response = JsonResponse({'message': 'User registered successfully'}, status=201)
                response["Access-Control-Allow-Origin"] = "http://localhost:5173"
                response["Access-Control-Allow-Credentials"] = "true"
                return response
            else:
                response = JsonResponse({'errors': serializer.errors}, status=400)
                response["Access-Control-Allow-Origin"] = "http://localhost:5173"
                response["Access-Control-Allow-Credentials"] = "true"
                return response
    except Exception as e:
        logger.error(f"Error in register: {str(e)}")
        return JsonResponse({'error': 'An error occurred'}, status=500)

@api_view(['GET'])
def get_all_users(request):
    try:
        users = Utilisateur.objects.all()
        serializer = UtilisateurSerializer(users, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in get_all_users: {str(e)}")
        return JsonResponse({'error': 'An error occurred'}, status=500)

@api_view(['GET'])
def get_user(request, user_id):
    try:
        user = Utilisateur.objects.filter(id=user_id).first()
        if user:
            serializer = UtilisateurSerializer(user)
            return Response(serializer.data)
        else:
            return JsonResponse({'error': 'User not found'}, status=404)
    except Exception as e:
        logger.error(f"Error in get_user: {str(e)}")
        return JsonResponse({'error': 'An error occurred'}, status=500)

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('register/', register, name='register'),
    path('users/', get_all_users, name='get_all_users'),
    path('users/<int:user_id>/', get_user, name='get_user'),
]
