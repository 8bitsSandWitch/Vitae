from django.db import migrations, models
import django.utils.timezone
from datetime import timedelta

def set_default_date_expire(apps, schema_editor):
    Job = apps.get_model('backapp', 'Job')
    default_date_expire = django.utils.timezone.now() + timedelta(days=30)
    Job.objects.all().update(date_expire=default_date_expire)

class Migration(migrations.Migration):

    dependencies = [
        ('backapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='job',
            name='date_expire',
            field=models.DateTimeField(default=django.utils.timezone.now() + timedelta(days=30)),
        ),
        migrations.RunPython(set_default_date_expire),
    ]
