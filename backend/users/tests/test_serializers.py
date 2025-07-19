from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from ..serializers import UserRegisterSerializer, UserSerializer

User = get_user_model()

class UserRegisterSerializerTest(TestCase):
    def test_valid_registration_data(self):
        data = {
            'username': 'testuser',
            'password': 'testpass123',
            'email': 'test@example.com'
        }
        serializer = UserRegisterSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
    def test_missing_password(self):
        data = {'username': 'testuser', 'email': 'test@example.com'}
        serializer = UserRegisterSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors)
        
    def test_create_user(self):
        data = {
            'username': 'newuser',
            'password': 'newpass123',
            'email': 'new@example.com'
        }
        serializer = UserRegisterSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        self.assertEqual(user.username, 'newuser')
        self.assertTrue(user.check_password('newpass123'))

class UserSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='serializertest',
            password='testpass123'
        )
    
    def test_serialized_data(self):
        serializer = UserSerializer(instance=self.user)
        self.assertEqual(serializer.data['username'], 'serializertest')
        self.assertNotIn('password', serializer.data)