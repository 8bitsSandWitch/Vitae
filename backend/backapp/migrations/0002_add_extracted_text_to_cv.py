from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('backapp', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cv',
            name='extracted_text',
            field=models.TextField(null=True, blank=True),
        ),
    ]
