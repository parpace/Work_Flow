from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions
from .models import User, Project, ProjectCollaborator, List, Task, ChecklistItem
from .serializers import UserSerializer, ProjectSerializer, ProjectCollaboratorSerializer, ListSerializer, TaskSerializer, ChecklistItemSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

class ProjectCollaboratorViewSet(viewsets.ModelViewSet):
    queryset = ProjectCollaborator.objects.all()
    serializer_class = ProjectCollaboratorSerializer
    permission_classes = [permissions.IsAuthenticated]

class ListViewSet(viewsets.ModelViewSet):
    queryset = List.objects.all()
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

class ChecklistItemViewSet(viewsets.ModelViewSet):
    queryset = ChecklistItem.objects.all()
    serializer_class = ChecklistItemSerializer
    permission_classes = [permissions.IsAuthenticated]