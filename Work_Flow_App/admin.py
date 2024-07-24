from django.contrib import admin
from .models import User, Project, ProjectCollaboration, List, Task, ChecklistItem

admin.site.register(User)
admin.site.register(Project)
admin.site.register(ProjectCollaboration)
admin.site.register(List)
admin.site.register(Task)
admin.site.register(ChecklistItem)