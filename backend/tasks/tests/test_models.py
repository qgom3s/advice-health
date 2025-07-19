from django.test import TestCase
from django.contrib.auth import get_user_model
from ..models import Task

User = get_user_model()

class TaskModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='modeltester',
            password='testpass123'
        )
    
    def test_create_task(self):
        task = Task.objects.create(
            user=self.user,
            title='Test Task',
            description='Test Description',
            category='Test Category'
        )
        self.assertEqual(task.title, 'Test Task')
        self.assertEqual(task.user.username, 'modeltester')
        self.assertFalse(task.is_completed)
        self.assertIsNotNone(task.created_at)
        
    def test_task_string_representation(self):
        task = Task.objects.create(
            user=self.user,
            title='String Test'
        )
        self.assertEqual(str(task), 'String Test')
        
    def test_default_values(self):
        task = Task.objects.create(
            user=self.user,
            title='Defaults Test'
        )
        self.assertEqual(task.description, '')
        self.assertEqual(task.category, '')
        self.assertFalse(task.is_completed)