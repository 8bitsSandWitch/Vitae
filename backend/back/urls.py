"""
URL configuration for back project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import routers
from backapp.views import UtilisateurViewSet, JobViewSet, CVViewSet, EntrepriseViewSet, update_profile_picture, apply_for_job, login_view, register

router = routers.DefaultRouter()
router.register(r'utilisateurs', UtilisateurViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'cvs', CVViewSet)
router.register(r'entreprises', EntrepriseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('backapp.urls')),
    path('api/', include(router.urls)),
    path('api/register/', register, name='register'),
    path('api/login/', login_view, name='login_view'),

    path('api/uploaded-cvs/', include('backapp.urls')),
    path('api/update-profile-picture/', update_profile_picture, name='update_profile_picture'),
    path('api/apply-for-job/', apply_for_job, name='apply_for_job'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
