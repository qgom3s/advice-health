from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from ..models import Task
from ..serializers import TaskSerializer

User = get_user_model()

class TaskSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='serializertester',
            password='testpass123'
        )
        self.task_data = {
            'title': 'Serializer Test',
            'description': 'Testing serializer',
            'category': 'Test',
            'is_completed': False
        }
    
    def test_serializer_with_valid_data(self):
        serializer = TaskSerializer(data=self.task_data)
        self.assertTrue(serializer.is_valid())
        
    def test_serializer_with_missing_title(self):
        invalid_data = self.task_data.copy()
        invalid_data.pop('title')
        serializer = TaskSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('title', serializer.errors)
        
    def test_serializer_output(self):
        task = Task.objects.create(
            user=self.user,
            **self.task_data
        )
        serializer = TaskSerializer(instance=task)
        self.assertEqual(serializer.data['title'], 'Serializer Test')
        self.assertIn('created_at', serializer.data)