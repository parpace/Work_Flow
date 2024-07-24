from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UserList.as_view(), name='user_list'),
    path('users/<int:pk>/', views.UserDetail.as_view(), name='user_detail'),
    path('invitations/', views.InvitationList.as_view(), name='invitation_list'),
    path('user-invitations/', views.InvitationRequest.as_view(), name='invitation_request'),
    path('invitations/<int:pk>/', views.InvitationDetail.as_view(), name='invitation_detail'),
    path('projects/', views.ProjectList.as_view(), name='project_list'),
    path('projects/<int:pk>/', views.ProjectDetail.as_view(), name='project_detail'),
    path('project-collaborators/', views.ProjectCollaborationList.as_view(), name='projectCollaboration_list'),
    path('project-collaborators/<int:pk>/', views.ProjectCollaborationDetail.as_view(), name='projectCollaboration_detail'),
    path('lists/', views.ListList.as_view(), name='list_list'),
    path('lists/<int:pk>/', views.ListDetail.as_view(), name='list_detail'),
    path('tasks/', views.TaskList.as_view(), name='task_list'),
    path('tasks/<int:pk>/', views.TaskDetail.as_view(), name='task_detail'),
    path('checklist-items/', views.ChecklistItemList.as_view(), name='checklistItem_list'),
    path('checklist-items/<int:pk>/', views.ChecklistItemDetail.as_view(), name='checklistItem_detail'),
]