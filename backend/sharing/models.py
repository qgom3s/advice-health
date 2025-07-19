from django.db import models
from django.contrib.auth.models import User
from tasks.models import Task

class Share(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='shares')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shared_tasks')

    class Meta:
        unique_together = ('task', 'user')

    def __str__(self):
        return f'Tarefa "{self.task.title}" compartilhada com {self.user.username}'
