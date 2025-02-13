from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Utilisateur, CV, Job, Experience, Education, Entreprise

class UtilisateurAdmin(UserAdmin):
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'type_utils')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'first_name', 'last_name', 'email', 'type_utils'),
        }),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'type_utils', 'is_staff')
    search_fields = ('username', 'first_name', 'last_name', 'email')
    ordering = ('username',)

admin.site.register(Utilisateur, UtilisateurAdmin)
admin.site.register(CV)
admin.site.register(Job)
admin.site.register(Experience)
admin.site.register(Education)
admin.site.register(Entreprise)