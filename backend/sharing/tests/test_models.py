from django.test import TestCase
from django.contrib.auth import get_user_model
from tasks.models import Task
from ..models import Share

User = get_user_model()

class ShareModelTest(TestCase):
    def setUp(self):
        self.owner = User.objects.create_user(username='owner', password='testpass123')
        self.shared_with = User.objects.create_user(username='shared_user', password='testpass123')
        self.task = Task.objects.create(
            user=self.owner,
            title='Shared Task'
        )
    
    def test_create_share(self):
        share = Share.objects.create(
            task=self.task,
            user=self.shared_with
        )
        self.assertEqual(share.task.title, 'Shared Task')
        self.assertEqual(share.user.username, 'shared_user')
        self.assertEqual(str(share), 'Tarefa "Shared Task" compartilhada com shared_user')
    
    def test_unique_together_constraint(self):
        Share.objects.create(task=self.task, user=self.shared_with)
        with self.assertRaises(Exception):
            Share.objects.create(task=self.task, user=self.shared_with)