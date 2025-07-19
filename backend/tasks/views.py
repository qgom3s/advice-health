from rest_framework import viewsets, permissions
from django.db.models import Q
from .models import Task
from .serializers import TaskSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Task.objects.filter(Q(user=user) | Q(shared_with=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
    @action(detail=True, methods=['post'], url_path='share')
    def share_task(self, request, pk=None):
        """
        Adiciona um usuário para compartilhar a tarefa.
        Espera payload JSON: { "username": "usuario_destino" }
        """
        task = self.get_object()
        if task.user != request.user:
            return Response({"detail": "Apenas o dono pode compartilhar esta tarefa."}, status=status.HTTP_403_FORBIDDEN)

        username = request.data.get('username')
        if not username:
            return Response({"detail": "Campo username é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_share = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "Usuário com esse username não existe."}, status=status.HTTP_404_NOT_FOUND)

        if user_to_share == request.user:
            return Response({"detail": "Não é necessário compartilhar a tarefa com você mesmo."}, status=status.HTTP_400_BAD_REQUEST)

        task.shared_with.add(user_to_share)
        task.save()
        return Response({"detail": f"Tarefa compartilhada com {username}."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='unshare')
    def unshare_task(self, request, pk=None):
        """
        Remove um usuário do compartilhamento da tarefa.
        Espera payload JSON: { "username": "usuario_destino" }
        """
        task = self.get_object()
        if task.user != request.user:
            return Response({"detail": "Apenas o dono pode remover compartilhamento desta tarefa."}, status=status.HTTP_403_FORBIDDEN)

        username = request.data.get('username')
        if not username:
            return Response({"detail": "Campo username é obrigatório."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_to_unshare = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response({"detail": "Usuário com esse username não existe."}, status=status.HTTP_404_NOT_FOUND)

        task.shared_with.remove(user_to_unshare)
        task.save()
        return Response({"detail": f"Compartilhamento removido para {username}."}, status=status.HTTP_200_OK)

