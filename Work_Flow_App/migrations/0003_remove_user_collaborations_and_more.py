# Generated by Django 5.0.7 on 2024-07-24 15:17

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Work_Flow_App', '0002_rename_projectcollaborator_projectcollaboration_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='collaborations',
        ),
        migrations.RemoveField(
            model_name='user',
            name='owned_projects',
        ),
        migrations.AddField(
            model_name='project',
            name='collaborators',
            field=models.ManyToManyField(blank=True, related_name='collaborating_projects', through='Work_Flow_App.ProjectCollaboration', to='Work_Flow_App.user'),
        ),
        migrations.AddField(
            model_name='project',
            name='owner',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='owned_projects', to='Work_Flow_App.user'),
            preserve_default=False,
        ),
    ]
