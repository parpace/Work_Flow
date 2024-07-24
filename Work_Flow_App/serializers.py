from rest_framework import serializers
from .models import User, Project, ProjectCollaboration, List, Task, ChecklistItem, Invitation

class ChecklistItemSerializer(serializers.HyperlinkedModelSerializer):
    task = serializers.HyperlinkedRelatedField(view_name='task_detail', read_only=True)

    task_id = serializers.PrimaryKeyRelatedField(queryset=Task.objects.all(), source='task')

    class Meta:
       model = ChecklistItem
       fields = ('id', 'task', 'task_id', 'item_name', 'status')

class TaskSerializer(serializers.HyperlinkedModelSerializer):
    list = serializers.HyperlinkedRelatedField(view_name='list_detail', read_only=True)

    list_id = serializers.PrimaryKeyRelatedField(queryset=List.objects.all(), source='list')

    assigned_users = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)

    checklistItems = ChecklistItemSerializer( many=True, read_only=True)

    task_url = serializers.ModelSerializer.serializer_url_field(view_name='task_detail')

    class Meta:
       model = Task
       fields = ('id', 'task_url', 'list', 'list_id', 'assigned_users', 'task_name', 'description', 'checklistItems')

class ListSerializer(serializers.HyperlinkedModelSerializer):
    project = serializers.HyperlinkedRelatedField(view_name='project_detail', read_only=True)

    project_id = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), source='project')

    tasks = TaskSerializer(many=True, read_only=True)

    list_url = serializers.ModelSerializer.serializer_url_field(view_name='list_detail')

    class Meta:
       model = List
       fields = ('id', 'list_url', 'project', 'project_id', 'list_name', 'tasks')

class InvitationSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all())

    class Meta:
        model = Invitation
        fields = ('id', 'sender', 'receiver', 'project', 'status', 'created_at')

class ProjectCollaborationSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    class Meta:
        model = ProjectCollaboration
        fields = ('user', 'project', 'can_edit')

class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), write_only=True)

    collaborators = ProjectCollaborationSerializer(source='projectcollaboration_set', many=True, read_only=True)
    
    lists = ListSerializer(many=True, read_only=True)

    project_url = serializers.ModelSerializer.serializer_url_field(view_name='project_detail')

    class Meta:
       model = Project
       fields = ('id', 'project_url', 'owner', 'collaborators', 'project_name', 'background_image', 'color_scheme', 'lists')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    owned_projects = ProjectSerializer(many=True, read_only=True)
    collaborating_projects = ProjectSerializer(many=True, read_only=True)
    sent_invitations = InvitationSerializer(many=True, read_only=True)
    received_invitations = InvitationSerializer(many=True, read_only=True)

    class Meta:
       model = User
       fields = ('id', 'user_name', 'password', 'email', 'user_img', 'owned_projects', 'collaborating_projects', 'sent_invitations', 'received_invitations')