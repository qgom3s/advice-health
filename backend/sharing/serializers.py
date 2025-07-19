# sharing/serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Share
from tasks.serializers import TaskSerializer
from tasks.models import Task

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class ShareSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    task = TaskSerializer(read_only=True)
    task_id = serializers.PrimaryKeyRelatedField(
        queryset=Task.objects.all(), source='task', write_only=True
    )

    class Meta:
        model = Share
        fields = ['id', 'task', 'task_id', 'user', 'user_id']
