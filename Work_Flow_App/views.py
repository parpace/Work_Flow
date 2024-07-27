from django.shortcuts import render
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
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
        serializer.save()

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

    def perform_create(self, serializer):
        serializer.save()

class InvitationRequest(generics.ListCreateAPIView):
    serializer_class = InvitationSerializer

    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        if user_id:
            try:
                user = User.objects.get(pk=user_id)
            except User.DoesNotExist:
                raise NotFound("User does not exist")
            return Invitation.objects.filter(receiver=user)
        else:
            return Invitation.objects.none()

class InvitationDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invitation.objects.all()
    serializer_class = InvitationSerializer

class HandleInvitation(APIView):
    def patch(self, request, pk):
        try:
            invitation = Invitation.objects.get(pk=pk)
            # Add receiver to the project's collaborators
            project = invitation.project
            project.collaborators.add(invitation.receiver)
            project.save()
            # Delete the invitation after acceptance
            invitation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Invitation.DoesNotExist:
            return Response({"error": "Invitation not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            invitation = Invitation.objects.get(pk=pk)
            invitation.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Invitation.DoesNotExist:
            return Response({"error": "Invitation not found."}, status=status.HTTP_404_NOT_FOUND)

class ListList(generics.ListCreateAPIView):
    queryset = List.objects.all()
    serializer_class = ListSerializer

    def perform_create(self, serializer):
        serializer.save()

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

    def perform_create(self, serializer):
        serializer.save()

class ChecklistItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ChecklistItem.objects.all()
    serializer_class = ChecklistItemSerializer