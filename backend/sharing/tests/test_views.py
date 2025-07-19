from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from tasks.models import Task
from ..models import Share

User = get_user_model()

class ShareViewSetTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.owner = User.objects.create_user(username='owner', password='testpass123')
        self.user1 = User.objects.create_user(username='user1', password='testpass123')
        self.user2 = User.objects.create_user(username='user2', password='testpass123')
        
        self.task1 = Task.objects.create(
            user=self.owner,
            title='Task 1'
        )
        self.task2 = Task.objects.create(
            user=self.user1,
            title='Task 2'
        )
        
        self.share1 = Share.objects.create(
            task=self.task1,
            user=self.user1
        )
        
        self.client.force_authenticate(user=self.owner)
    
    def test_list_shares(self):
        url = reverse('share-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_create_share(self):
        url = reverse('share-list')
        data = {
            'task_id': self.task1.id,
            'user_id': self.user2.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Share.objects.count(), 2)
    
    def test_cannot_share_others_tasks(self):
        url = reverse('share-list')
        data = {
            'task_id': self.task2.id,  # Tarefa de outro usuário
            'user_id': self.user2.id
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_shared_user_can_view_share(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('share-detail', kwargs={'pk': self.share1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class UserViewSetTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.user1 = User.objects.create_user(username='user1', password='testpass123')
        self.user2 = User.objects.create_user(username='user2', password='testpass123')
        self.client.force_authenticate(user=self.user1)
    
    def test_list_users(self):
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_filter_users_by_username(self):
        url = reverse('user-list') + '?username=user2'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'user2')