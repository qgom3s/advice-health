from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegisterViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse('user-register')
        
    def test_user_registration(self):
        data = {
            'username': 'registertest',
            'password': 'testpass123',
            'email': 'register@test.com'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='registertest').exists())
        
    def test_duplicate_username(self):
        User.objects.create_user(username='duplicate', password='test123')
        data = {
            'username': 'duplicate',
            'password': 'testpass123',
            'email': 'dupe@test.com'
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UserViewSetTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='viewsettester',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)
        self.url = reverse('user-list')
        
    def test_list_users(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        
    def test_filter_by_username(self):
        response = self.client.get(self.url, {'username': 'viewsettester'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['username'], 'viewsettester')