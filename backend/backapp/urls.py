from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'utilisateurs', UtilisateurViewSet, basename='utilisateur')
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'cvs', CVViewSet, basename='cv')
router.register(r'entreprises', EntrepriseViewSet, basename='entreprise')

urlpatterns = [
    path('login/', login_view, name='login_view'),
    path('apply-for-job/', apply_for_job, name='apply_for_job'),
    path('update-profile-picture/', update_profile_picture, name='update_profile_picture'),
    path('uploaded-cvs/', get_uploaded_cvs, name='get_uploaded_cvs'),
    
    # Utilisateur API
    path('api/Utilisateur/', UtilisateurApi, name='UtilisateurApi'),
    path('api/Utilisateur/<int:user_id>/', UtilisateurApi, name='UtilisateurApi'),
    
    # Job API
    path('api/jobApi/', jobApi, name='jobApi'),
    path('api/jobApi/<int:job_id>/', jobApi, name='jobApi'),
    path('api/user-jobs/', get_user_jobs, name='get_user_jobs'),
    
    path('', include(router.urls)),
]
