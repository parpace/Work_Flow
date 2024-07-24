from django.shortcuts import render
from rest_framework import generics
from .models import User, Project, ProjectCollaboration, List, Task, ChecklistItem
from .serializers import UserSerializer, ProjectSerializer, ProjectCollaborationSerializer, ListSerializer, TaskSerializer, ChecklistItemSerializer

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProjectList(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ProjectCollaborationList(generics.ListCreateAPIView):
    queryset = ProjectCollaboration.objects.all()
    serializer_class = ProjectCollaborationSerializer

class ProjectCollaborationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectCollaboration.objects.all()
    serializer_class = ProjectCollaborationSerializer

class ListList(generics.ListCreateAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer

class ListDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer

class TaskList(generics.ListCreateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class TaskDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

class ChecklistItemList(generics.ListCreateAPIView):
    queryset = ChecklistItem.objects.all()
    serializer_class = ChecklistItemSerializer

class ChecklistItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChecklistItem.objects.all()
    serializer_class = ChecklistItemSerializer