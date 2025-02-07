from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class Utilisateur(AbstractUser):
    # Additional fields can be added here if needed
    pass

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

# Call the function to create groups and permissions
create_groups_and_permissions()