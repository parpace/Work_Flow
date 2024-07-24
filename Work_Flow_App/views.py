from django.shortcuts import render
from rest_framework import generics
from rest_framework.exceptions import NotFound
from .models import User, Project, ProjectCollaboration, List, Task, ChecklistItem, Invitation
from .serializers import UserSerializer, ProjectSerializer, ProjectCollaborationSerializer, ListSerializer, TaskSerializer, ChecklistItemSerializer, InvitationSerializer

class UserList(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProjectList(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

class ProjectCollaborationList(generics.ListCreateAPIView):
    queryset = ProjectCollaboration.objects.all()
    serializer_class = ProjectCollaborationSerializer

class ProjectCollaborationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProjectCollaboration.objects.all()
    serializer_class = ProjectCollaborationSerializer

class InvitationList(generics.ListCreateAPIView):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer

class InvitationRequest(generics.ListCreateAPIView):
    serializer_class = InvitationSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id is not None:
            try:
                user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                raise Http404("User does not exist")
            return Invitation.objects.filter(receiver=user)
        else:
            return Invitation.objects.none()

class InvitationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer

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