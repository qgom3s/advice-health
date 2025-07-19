from django.db import models

# Create your models here.

# Define the Task model for the tasks app
# This model will represent a task with fields for title, description, completion status, and timestamps
class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
