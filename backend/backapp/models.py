from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils import timezone
from datetime import timedelta

class Utilisateur(AbstractUser):
    TYPE_UTILS_CHOICES = [
        ('job_applicant', 'Job Applicant'),
        ('job_poster', 'Job Poster'),
        ('default', 'Default'),
    ]
    type_utils = models.CharField(max_length=20, choices=TYPE_UTILS_CHOICES, default='default')
    groups = models.ManyToManyField(
        Group,
        related_name='utilisateur_set',  # Add related_name attribute
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='utilisateur_set',  # Add related_name attribute
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )

# Create groups and permissions
def create_groups_and_permissions():
    # Create groups
    job_applicants_group, created = Group.objects.get_or_create(name='Job Applicants')
    job_posters_group, created = Group.objects.get_or_create(name='Job Posters')

    # Define permissions
    permissions = {
        'Job Applicants': ['add_cv', 'view_cv'],
        'Job Posters': ['add_job', 'view_job', 'filter_cv']
    }

    # Assign permissions to groups
    for group_name, perms in permissions.items():
        group = Group.objects.get(name=group_name)
        for perm in perms:
            permission = Permission.objects.filter(codename=perm).first()
            if permission:
                group.permissions.add(permission)

class Entreprise(models.Model):
    user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    email = models.EmailField()
    website = models.URLField()

    def __str__(self):
        return self.name

class Job(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    keywords = models.JSONField()
    enterprise_name = models.CharField(max_length=255, default="Unknown")
    enterprise_email = models.EmailField(default='email@example.com')
    location = models.CharField(max_length=255, default="Unknown")
    date_posted = models.DateTimeField(default=timezone.now)
    date_expire = models.DateTimeField(default=timezone.now() + timedelta(days=30))
    user = models.ForeignKey(Utilisateur, on_delete=models.CASCADE)  # Foreign key to Utilisateur

    def __str__(self):
        return self.title

class CV(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    description = models.TextField(default='Nothing to say')
    keywords = models.JSONField()
    cv_url = models.URLField()
    extracted_text = models.TextField(null=True, blank=True)  # New field to store extracted text

    def __str__(self):
        return self.name

class Education(models.Model):
    cv = models.ForeignKey(CV, related_name='educations', on_delete=models.CASCADE)
    institution_name = models.CharField(max_length=255)
    degree = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.degree} at {self.institution_name}"

class Experience(models.Model):
    cv = models.ForeignKey(CV, related_name='experiences', on_delete=models.CASCADE)
    company_name = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.job_title} at {self.company_name}"