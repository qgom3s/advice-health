from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class TaskSerializer(serializers.ModelSerializer):
    shared_with = UserSerializer(many=True, read_only=True)  # lista dos usuários que têm acesso
    shared_with_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description', 'category', 'is_completed',
            'created_at', 'updated_at', 'shared_with', 'shared_with_ids'
        ]

    def update(self, instance, validated_data):
        shared_users = validated_data.pop('shared_with_ids', None)
        instance = super().update(instance, validated_data)
        if shared_users is not None:
            instance.shared_with.set(shared_users)
        return instance

    def create(self, validated_data):
        shared_users = validated_data.pop('shared_with_ids', None)
        task = super().create(validated_data)
        if shared_users is not None:
            task.shared_with.set(shared_users)
        return task
