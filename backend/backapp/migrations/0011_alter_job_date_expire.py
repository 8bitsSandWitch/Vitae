# Generated by Django 5.1.6 on 2025-02-13 11:51

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backapp', '0010_alter_entreprise_id_alter_job_date_expire'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='date_expire',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 15, 11, 51, 39, 722603, tzinfo=datetime.timezone.utc)),
        ),
    ]
