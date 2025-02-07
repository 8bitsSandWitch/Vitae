from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class Utilisateur(AbstractUser):
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
            permission = Permission.objects.get(codename=perm)
            group.permissions.add(permission)