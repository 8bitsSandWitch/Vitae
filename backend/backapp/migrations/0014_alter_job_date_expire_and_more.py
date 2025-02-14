# Generated by Django 5.1.6 on 2025-02-14 09:16

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('backapp', '0013_alter_job_date_expire_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='date_expire',
            field=models.DateTimeField(default=datetime.datetime(2025, 3, 16, 9, 16, 27, 130532, tzinfo=datetime.timezone.utc)),
        ),
        migrations.AlterField(
            model_name='utilisateur',
            name='profile_picture',
            field=models.CharField(blank=True, default='default.png', max_length=255),
        ),
    ]
