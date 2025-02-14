from django.contrib.auth.models import Group
from django.contrib.auth.decorators import login_required, permission_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import views as auth_views
from django.urls import path
from django.http import JsonResponse
from .models import Utilisateur, Job, CV, Entreprise, JobApplication
from .forms import RegisterForm
from .serializers import UtilisateurSerializer, JobSerializer, CVSerializer, EntrepriseSerializer, JobApplicationSerializer
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
def login_view(request):
    try:
        data = request.data
        username = data.get('username')
        password = data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            user_data = UtilisateurSerializer(user).data
            profile_picture = user_data['profile_picture']
            profile_picture_url = f'src/components/IMG/{profile_picture}'
            
            return JsonResponse({
                'id': user_data['id'],
                'username': user_data['username'],
                'first_name': user_data['first_name'],
                'last_name': user_data['last_name'],
                'email': user_data['email'],
                'type_utils': user_data['type_utils'],
                'profile_picture': profile_picture_url,
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

  
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_picture(request):
    try:
        user = request.user
        if not user.is_authenticated:
            return JsonResponse({'error': 'User is not authenticated'}, status=401)
        
        if 'profile_picture' not in request.FILES:
            return JsonResponse({'error': 'No profile picture uploaded'}, status=400)
        
        file = request.FILES['profile_picture']
        file_name = default_storage.save(f'profile_pictures/{file.name}', ContentFile(file.read()))
        file_url = default_storage.url(file_name)
        
        user.profile_picture = file_name  # Save only the file name
        user.save()
        
        return JsonResponse({'message': 'Profile picture updated successfully', 'profile_picture': file_name}, status=200)
    except Exception as e:
        logger.error(f"Error in update_profile_picture: {str(e)}")
        return JsonResponse({'error': 'An error occurred during profile picture update'}, status=500)  
    

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def apply_for_job(request):
    try:
        job_id = request.data.get('job_id')
        job = get_object_or_404(Job, id=job_id)
        applicant = request.user

        # Check if the user has already applied for the job
        if JobApplication.objects.filter(job=job, applicant=applicant).exists():
            return JsonResponse({'error': 'You have already applied for this job.'}, status=400)

        job_application = JobApplication.objects.create(job=job, applicant=applicant)
        serializer = JobApplicationSerializer(job_application)
        return JsonResponse(serializer.data, status=201)
    except Exception as e:
        logger.error(f"Error in apply_for_job: {str(e)}")
        return JsonResponse({'error': 'An error occurred during job application.'}, status=500)
 
 
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
 
@csrf_exempt
@login_required
@api_view(['GET', 'POST', 'PUT', 'DELETE'])
def UtilisateurApi(request, user_id=None):
    try:
        if request.method == 'GET':
            if user_id is None:
                utilisateurs = Utilisateur.objects.all()
                utilisateur_serializer = UtilisateurSerializer(utilisateurs, many=True)
                return JsonResponse(utilisateur_serializer.data, safe=False)
            else:
                try:
                    utilisateur = Utilisateur.objects.get(id=user_id)
                    utilisateur_serializer = UtilisateurSerializer(utilisateur)
                    return JsonResponse(utilisateur_serializer.data, safe=False)
                except Utilisateur.DoesNotExist:
                    return JsonResponse({'error': 'User Not Found'}, safe=False, status=400)
        
        elif request.method == 'POST':
            try:
                logger.info(f"Received data: {request.data}")  # Log the request data
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
                logger.error(f"Error during user registration: {str(e)}")
                return JsonResponse({'error': 'An error occurred during user registration'}, status=500)
    
        elif request.method == 'PUT':
            utilisateur_data = JSONParser().parse(request)
            try:
                utilisateur = Utilisateur.objects.get(id=user_id)
                utilisateur_serializer = UtilisateurSerializer(utilisateur, data=utilisateur_data)
                if utilisateur_serializer.is_valid():
                    utilisateur_serializer.save()
                    return JsonResponse(utilisateur_serializer.data, safe=False, status=200)
                return JsonResponse(utilisateur_serializer.errors, safe=False, status=400)
            except Utilisateur.DoesNotExist:
                return JsonResponse({"error": "User Not Found"}, safe=False, status=400)
        
        elif request.method == 'DELETE':
            try:
                utilisateur = Utilisateur.objects.get(id=user_id)
                utilisateur.delete()
                return JsonResponse("User Deleted Successfully", safe=False, status=200)
            except Utilisateur.DoesNotExist:
                return JsonResponse({"error": "Utilisateur non trouvé"}, safe=False, status=400)
    except Exception as e:
        logger.error(f'Error in Utilisateur API: {str(e)}')
        return JsonResponse({'error': f'An error occured in Utilisateur API: {str(e)}'}, status=500)
   
@login_required
@api_view(['GET', 'POST', 'PUT', 'DELETE']) 
def jobApi(request, job_id=None):
    try:
        if request.method == 'GET':
            if job_id is None:
                jobs = Job.objects.all()
                job_serializer = JobSerializer(jobs, many=True)
            else:
                try:
                    job = Job.objects.get(id=job_id)
                    job_serializer = JobSerializer(job)
                except Job.DoesNotExist:
                    return JsonResponse({'error': 'No Job Found'}, safe=False, status=400)
            return JsonResponse(job_serializer.data, safe=False)
        
        elif request.method == 'POST':
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
                return JsonResponse({'message': 'Job posted successfully'}, status=201)
            except Exception as e:
                logger.error(f"Error in post_job: {str(e)}")
                return JsonResponse({'error': f'An error occurred during job posting: {str(e)}'}, status=500)
        
        elif request.method == 'PUT':
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
        
        elif request.method == 'DELETE':
            try: 
                job = Job.objects.get(id=job_id)
                job.delete()
                return JsonResponse('Job Deleted Successfully', safe=False, status=201)
            except Job.DoesNotExist:
                logger.error(f"Error in delete_job: {str(e)}")
                return JsonResponse({'error': 'Job Not Found'}, safe=False, status=400)
            
    except Exception as e:
        logger.error(f"Error in Job API: {str(e)}")
        return JsonResponse({'error': f'An error occurred in Job API: {str(e)}'}, status=500)
    
@login_required
@api_view(['GET'])
def get_user_jobs(request):
    try:
        logger.info(f"User: {request.user}")  # Log the user information
        jobs = Job.objects.filter(user=request.user)
        logger.info(f"Jobs: {jobs}")  # Log the jobs information
        serializer = JobSerializer(jobs, many=True)
        return Response(serializer.data)
    except Exception as e:
        logger.error(f"Error in get_user_jobs: {str(e)}")
        return JsonResponse({'error': 'An error occurred while fetching user jobs'}, status=500)

urlpatterns = [
    # Connexion API
    path('api/login/', login_view, name='login_view'),
    path('login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    
    # User API
    path('api/Utilisateur/', UtilisateurApi, name='UtilisateurApi'),
    path('api/Utilisateur/<int:user_id>/', UtilisateurApi, name='UtilisateurApi'),
    
    # User Update API
    path('api/update-profile-picture/', update_profile_picture, name='update_profile_picture'),
    
    # Entreprise API
    path('api/entreprise/', entrepriseApi, name='entreprise_list'),
    path('api/entreprise/<int:id>/', entrepriseApi, name='entreprise_detail'),
    
    # CV's API
    path('api/upload/', upload_cv, name='upload_cv'),
    path('api/uploaded-cvs/', get_uploaded_cvs, name='get_uploaded_cvs'),
    path('api/delete-cv/<int:cv_id>/', delete_cv, name='delete_cv'),
    path('api/filter-cv/', filter_cv, name='filter_cv'),
    
    # Job API    
    path('api/jobApi/', jobApi, name='jobApi'),
    path('api/jobApi/<int:job_id>/', jobApi, name='jobApi'),
    path('api/user-jobs/', get_user_jobs, name='get_user_jobs'),
    
    
    path('api/apply-for-job/', apply_for_job, name='apply_for_job'),
]
