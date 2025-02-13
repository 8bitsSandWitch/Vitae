from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'utilisateurs', UtilisateurViewSet, basename='utilisateur')
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'cvs', CVViewSet, basename='cv')
router.register(r'entreprises', EntrepriseViewSet, basename='entreprise')

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login_view, name='login_view'),
    path('job-offers/', list_jobs, name='list_jobs'),
    path('user-jobs/', get_user_jobs, name='get_user_jobs'),
    path('uploaded-cvs/', get_uploaded_cvs, name='get_uploaded_cvs'),
    path('', include(router.urls)),
]
