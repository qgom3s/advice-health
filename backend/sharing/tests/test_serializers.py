from django.test import TestCase
from django.contrib.auth import get_user_model
from tasks.models import Task
from ..serializers import ShareSerializer

User = get_user_model()

class ShareSerializerTest(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username='owner', password='testpass123')
        self.shared_with = User.objects.create_user(username='shared_user', password='testpass123')
        self.task = Task.objects.create(
            user=self.owner,
            title='Serialized Task'
        )
        self.share_data = {
            'task_id': self.task.id,
            'user_id': self.shared_with.id
        }
    
    def test_serializer_valid_data(self):
        serializer = ShareSerializer(data=self.share_data)
        self.assertTrue(serializer.is_valid())
    
    def test_serializer_invalid_data(self):
        invalid_data = self.share_data.copy()
        invalid_data['task_id'] = 9999  # ID inexistente
        serializer = ShareSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('task_id', serializer.errors)
    
    def test_serializer_output(self):
        share = Share.objects.create(
            task=self.task,
            user=self.shared_with
        )
        serializer = ShareSerializer(instance=share)
        self.assertEqual(serializer.data['task']['title'], 'Serialized Task')
        self.assertEqual(serializer.data['user']['username'], 'shared_user')