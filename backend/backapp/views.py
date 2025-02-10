from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required, permission_required
from django.shortcuts import render, redirect
from django.contrib.auth import views as auth_views
from django.urls import path
from django.http import JsonResponse
from .models import Utilisateur, Job, CV
from .forms import RegisterForm
from .serializers import UtilisateurSerializer, JobSerializer, CVSerializer
import logging
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.parsers import MultiPartParser

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
        return JsonResponse({'error': 'An error occurred during usergroup assignment'}, status=500)

@login_required
@permission_required('backapp.add_cv', raise_exception=True)
def add_cv(request):
    try:
        # Logic to add CV
        return render(request, 'add_cv.html')
    except Exception as e:
        logger.error(f"Error in add_cv: {str(e)}")
        return JsonResponse({'error': 'An error occurred during permission checking'}, status=500)

@login_required
@permission_required('backapp.filter_cv', raise_exception=True)
def filter_cv(request):
    try:
        keywords = request.GET.get('keywords', '').split(',')
        cvs = CV.objects.filter(keywords__overlap=keywords)
        serializer = CVSerializer(cvs, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in filter_cv: {str(e)}")
        return JsonResponse({'error': 'An error occurred while filtering CVs'}, status=500)

@csrf_exempt
@api_view(['POST'])
def register(request):
    try:
        logger.info(f"Request data: {request.data}")  # Log the request data
        if request.method == 'POST':
            serializer = UtilisateurSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                # Assign the user to the appropriate group based on type_utils
                if user.type_utils == 'job_applicant':
                    group_name = 'Job Applicants'
                elif user.type_utils == 'job_poster':
                    group_name = 'Job Posters'
                else:
                    group_name = 'Default Group'
                
                group, created = Group.objects.get_or_create(name=group_name)
                user.groups.add(group)
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
        return JsonResponse({'error': 'An error occurred durin registration'}, status=500)

@csrf_exempt
@api_view(['POST'])
def login_view(request):
    try:
        data = request.data
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            user_data = UtilisateurSerializer(user)
            
            return JsonResponse({
                'id': user_data.data['id'],
                'username': user_data.data['username'],
                'first_name': user_data.data['first_name'],
                'last_name': user_data.data['last_name'],
                'email': user_data.data['email'],
                'type_utils': user_data.data['type_utils'],
            }, status=200)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)
    except Exception as e:
        logger.error(f"Error in login_view: {str(e)}")
        return JsonResponse({'error': 'An error occurred during login'}, status=500)

@csrf_exempt
@api_view(['POST'])
def upload_cv(request):
    try:
        print("OKay")
        parser_classes = (MultiPartParser,)
        file = request.FILES['cv']
        file_name = default_storage.save(file.name, ContentFile(file.read()))
        file_url = default_storage.url(file_name)
        return JsonResponse({'message': 'File uploaded successfully', 'file_url': file_url}, status=201)
    except Exception as e:
        logger.error(f"Error in upload_cv: {str(e)}")
        return JsonResponse({'error': 'An error occurred during file upload'}, status=500)

@api_view(['GET'])
def get_all_users(request):
    try:
        users = Utilisateur.objects.all()
        serializer = UtilisateurSerializer(users, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in get_all_users: {str(e)}")
        return JsonResponse({'error': 'An error occurred while fecthing all users'}, status=500)

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
        return JsonResponse({'error': 'An error occurred while fectching a user'}, status=500)

@csrf_exempt
@api_view(['POST'])
def post_job(request):
    try:
        data = request.data
        logger.info(f"Received job data: {data}")  # Log the received data
        job = Job.objects.create(
            title=data['title'],
            description=data['description'],
            keywords=data['keywords']
        )
        return JsonResponse({'message': 'Job posted successfully'}, status=201)
    except Exception as e:
        logger.error(f"Error in post_job: {str(e)}")
        return JsonResponse({'error': f'An error occurred during job posting: {str(e)}'}, status=500)

@api_view(['GET'])
def list_jobs(request):
    try:
        jobs = Job.objects.all()
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in list_jobs: {str(e)}")
        return JsonResponse({'error': 'An error occurred while fetching jobs'}, status=500)

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('register/', register, name='register'),
    path('users/', get_all_users, name='get_all_users'),
    path('users/<int:user_id>/', get_user, name='get_user'),
    path('api/login/', login_view, name='login_view'),
    path('api/upload/', upload_cv, name='upload_cv'),
    path('api/post-job/', post_job, name='post_job'),
    path('api/jobs/', list_jobs, name='list_jobs'),
    path('api/filter-cv/', filter_cv, name='filter_cv'),
]
