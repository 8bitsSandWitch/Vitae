from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required, permission_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import views as auth_views
from django.urls import path
from django.http import JsonResponse
from .models import Utilisateur, Job, CV, Entreprise
from .forms import RegisterForm
from .serializers import UtilisateurSerializer, JobSerializer, CVSerializer, EntrepriseSerializer
import logging
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.parsers import MultiPartParser, JSONParser
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

# Get an instance of a logger
logger = logging.getLogger(__name__)

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Job.objects.filter(user=self.request.user)

class CVViewSet(viewsets.ModelViewSet):
    queryset = CV.objects.all()
    serializer_class = CVSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CV.objects.filter(email=self.request.user.email)

class EntrepriseViewSet(viewsets.ModelViewSet):
    queryset = Entreprise.objects.all()
    serializer_class = EntrepriseSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return Entreprise.objects.filter(user=self.request.user)

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
                user.type_utils = request.data['type_utils']
                user.set_password(request.data['password'])
                user.save()
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
        return JsonResponse({'error': 'An error occurred during registration'}, status=500)

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
        parser_classes = (MultiPartParser,)
        logger.info(f"Request data: {request.data}")  # Log the request data
        logger.info(f"Request FILES: {request.FILES}")  # Log the request files
        if 'cv' not in request.FILES:
            return JsonResponse({'error': 'No file uploaded'}, status=400)
        
        file = request.FILES['cv']
        file_name = default_storage.save(file.name, ContentFile(file.read()))
        file_url = default_storage.url(file_name)
        cv = CV.objects.create(
            name=request.data['name'],
            email=request.data['email'],
            description=request.data['description'],
            keywords=request.data['keywords'].split(','),  # Convert keywords to list
            cv_url=file_url
        )
        return JsonResponse({'message': 'File uploaded successfully', 'file_url': file_url}, status=201)
    except Exception as e:
        logger.error(f"Error in upload_cv: {str(e)}")
        return JsonResponse({'error': 'An error occurred during file upload'}, status=500)

@csrf_exempt
@api_view(['DELETE'])
@login_required
def delete_cv(request, cv_id):
    try:
        cv = CV.objects.get(id=cv_id, email=request.user.email)
        cv.delete()
        return JsonResponse({'message': 'CV deleted successfully'}, status=200)
    except CV.DoesNotExist:
        return JsonResponse({'error': 'CV not found'}, status=404)
    except Exception as e:
        logger.error(f"Error in delete_cv: {str(e)}")
        return JsonResponse({'error': 'An error occurred during CV deletion'}, status=500)

@csrf_exempt
@api_view(['DELETE'])
@login_required
def delete_job(request, job_id):
    try:
        job = Job.objects.get(id=job_id, user=request.user)
        job.delete()
        return JsonResponse({'message': 'Job deleted successfully'}, status=200)
    except Job.DoesNotExist:
        return JsonResponse({'error': 'Job not found'}, status=404)
    except Exception as e:
        logger.error(f"Error in delete_job: {str(e)}")
        return JsonResponse({'error': 'An error occurred during job deletion'}, status=500)

@csrf_exempt
@api_view(['PUT'])
@login_required
def update_job(request, job_id):
    try:
        job = get_object_or_404(Job, id=job_id, user=request.user)
        data = request.data
        job.title = data.get('title', job.title)
        job.description = data.get('description', job.description)
        job.keywords = data.get('keywords', job.keywords)
        job.enterprise_name = data.get('enterprise_name', job.enterprise_name)
        job.enterprise_email = data.get('enterprise_email', job.enterprise_email)
        job.location = data.get('location', job.location)
        job.date_expire = data.get('date_expire', job.date_expire)
        job.save()
        return JsonResponse({'message': 'Job updated successfully'}, status=200)
    except Exception as e:
        logger.error(f"Error in update_job: {str(e)}")
        return JsonResponse({'error': 'An error occurred during job update'}, status=500)

@login_required
@api_view(['GET'])
def get_uploaded_cvs(request):
    try:
        cvs = CV.objects.filter(email=request.user.email)
        serializer = CVSerializer(cvs, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in get_uploaded_cvs: {str(e)}")
        return JsonResponse({'error': 'An error occurred while fetching uploaded CVs'}, status=500)

@api_view(['GET'])
def get_all_users(request):
    try:
        users = Utilisateur.objects.all()
        serializer = UtilisateurSerializer(users, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in get_all_users: {str(e)}")
        return JsonResponse({'error': 'An error occurred while fetching all users'}, status=500)

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
        return JsonResponse({'error': 'An error occurred while fetching the user'}, status=500)

@csrf_exempt
@api_view(['POST'])
@login_required
def post_job(request):
    try:
        data = request.data
        logger.info(f"Received job data: {data}")  # Log the received data
        job = Job.objects.create(
            title=data['title'],
            description=data['description'],
            keywords=data['keywords'],
            enterprise_name=data['enterprise_name'],
            enterprise_email=data['enterprise_email'],
            location=data['location'],
            date_expire=data['date_expire'],
            user=request.user  # Set the current user as the job poster
        )
        return JsonResponse({'message': 'Job posted successfully', 'id': job.id}, status=201)
    except Exception as e:
        logger.error(f"Error in post_job: {str(e)}")
        return JsonResponse({'error': f'An error occurred during job posting: {str(e)}'}, status=500)

@api_view(['GET'])
def list_jobs(request):
    try:
        jobs = Job.objects.all()  # Fetch all job offers
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in list_jobs: {str(e)}")
        return JsonResponse({'error': 'An error occurred while fetching jobs'}, status=500)

@login_required
@api_view(['GET'])
def get_user_jobs(request):
    try:
        jobs = Job.objects.filter(user=request.user)
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in get_user_jobs: {str(e)}")
        return JsonResponse({'error': 'An error occurred while fetching user jobs'}, status=500)

@csrf_exempt
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def entrepriseApi(request, id=None):
    try:
        if id is None:
            if request.method == 'GET':
                entreprises = Entreprise.objects.all()
                serializer = EntrepriseSerializer(entreprises, many=True)
                return JsonResponse(serializer.data, safe=False)
            
            elif request.method == 'POST':
                data = JSONParser().parse(request)
                serializer = EntrepriseSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return JsonResponse(serializer.data, status=201)
                return JsonResponse(serializer.errors, status=400)
        else:
            entreprise = get_object_or_404(Entreprise, id=id)
            
            if request.method == 'GET':
                serializer = EntrepriseSerializer(entreprise)
                return JsonResponse(serializer.data)
            
            elif request.method == 'PUT':
                data = JSONParser().parse(request)
                serializer = EntrepriseSerializer(entreprise, data=data)
                if serializer.is_valid():
                    serializer.save()
                    return JsonResponse(serializer.data)
                return JsonResponse(serializer.errors, status=400)
            
            elif request.method == 'DELETE':
                entreprise.delete()
                return JsonResponse({'message': 'Entreprise deleted successfully'}, status=204)
    except Exception as e:
        logging.error(f"Error in entrepriseApi: {str(e)}")
        return JsonResponse({'error': 'An error occurred'}, status=500)

urlpatterns = [
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('register/', register, name='register'),
    path('users/', get_all_users, name='get_all_users'),
    path('users/<int:user_id>/', get_user, name='get_user'),
    path('api/login/', login_view, name='login_view'),
    path('api/upload/', upload_cv, name='upload_cv'),
    path('api/uploaded-cvs/', get_uploaded_cvs, name='get_uploaded_cvs'),
    path('api/delete-cv/<int:cv_id>/', delete_cv, name='delete_cv'),
    path('api/post-job/', post_job, name='post_job'),
    path('api/jobs/', list_jobs, name='list_jobs'),
    path('api/filter-cv/', filter_cv, name='filter_cv'),
    path('api/user-jobs/', get_user_jobs, name='get_user_jobs'),
    path('api/delete-job/<int:job_id>/', delete_job, name='delete_job'),
    path('api/update-job/<int:job_id>/', update_job, name='update_job'),
    path('api/entreprise/', entrepriseApi, name='entreprise_list'),
    path('api/entreprise/<int:id>/', entrepriseApi, name='entreprise_detail'),
]
