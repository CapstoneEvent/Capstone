# Generated by Django 4.2.5 on 2023-11-24 03:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='cover_picture',
            field=models.ImageField(upload_to='media/images/uploads'),
        ),
    ]
