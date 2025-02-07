from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from backapp.models import Utilisateur

@receiver(post_migrate)
def create_groups_and_permissions(sender, **kwargs):
    # Create groups
    job_applicants_group, created = Group.objects.get_or_create(name='Job Applicants')
    job_posters_group, created = Group.objects.get_or_create(name='Job Posters')

    # Define permissions
    permissions = {
        'Job Applicants': ['add_cv', 'view_cv'],
        'Job Posters': ['add_job', 'view_job', 'filter_cv']
    }

    # Create permissions if they do not exist
    for perm in ['add_cv', 'view_cv', 'add_job', 'view_job', 'filter_cv']:
        Permission.objects.get_or_create(
            codename=perm,
            name=f'Can {perm.replace("_", " ")}',
            content_type=ContentType.objects.get_for_model(Utilisateur),
        )

    # Assign permissions to groups
    for group_name, perms in permissions.items():
        group = Group.objects.get(name=group_name)
        for perm in perms:
            permission = Permission.objects.get(codename=perm)
            group.permissions.add(permission)
