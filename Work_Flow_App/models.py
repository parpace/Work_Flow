from django.db import models

class User(models.Model):
    user_name = models.CharField(max_length=20, unique=True)
    password = models.CharField(max_length=20)
    email = models.EmailField(max_length=200, unique=True)
    user_img = models.CharField(max_length=200, default='../src/assets/defaultUser.jpg')

    def __str__(self):
        return self.user_name
    
class Project(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_projects')
    collaborators = models.ManyToManyField(User, through='ProjectCollaboration', related_name='collaborating_projects', blank=True)
    project_name = models.CharField(max_length=50)
    background_image = models.CharField(max_length=200, blank=True, null=True)
    color_scheme = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.project_name
    
class ProjectCollaboration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    can_edit = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.user_name} - {self.project.project_name}"

class Invitation(models.Model):
    sender = models.ForeignKey(User, related_name='sent_invitations', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_invitations', on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=[('pending', 'Pending'), ('accepted', 'Accepted'), ('declined', 'Declined')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} invites {self.receiver} to {self.project} - {self.status}"

class List(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='lists')
    list_name = models.CharField(max_length=100)

    def __str__(self):
        return self.list_name
    
class Task(models.Model):
    list = models.ForeignKey(List, on_delete=models.CASCADE, related_name='tasks')
    assigned_users = models.ManyToManyField(User, related_name='tasks')
    task_name = models.CharField(max_length=50)
    description = models.CharField(max_length=500)

    def __str__(self):
        return self.task_name

class ChecklistItem(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='checklistItems')
    item_name = models.CharField(max_length=100)
    status = models.BooleanField(default=False)

    def __str__(self):
        return self.item_name