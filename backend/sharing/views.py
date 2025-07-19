from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from django.db import models
from .models import Share
from .serializers import ShareSerializer, UserSerializer

class ShareViewSet(viewsets.ModelViewSet):
    serializer_class = ShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Share.objects.filter(models.Q(task__user=user) | models.Q(user=user)).distinct()

    def perform_create(self, serializer):
        task = serializer.validated_data['task']
        if task.user != self.request.user:
            raise PermissionDenied("Você só pode compartilhar suas próprias tarefas.")
        serializer.save()

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.all()
        username = self.request.query_params.get('username')
        if username:
            queryset = queryset.filter(username=username)
        return queryset
