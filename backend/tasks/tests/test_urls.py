from django.urls import reverse, resolve
from django.test import TestCase
from ..views import TaskViewSet

class TaskUrlsTest(TestCase):
    def test_task_list_url(self):
        url = reverse('task-list')
        self.assertEqual(url, '/api/tasks/tasks/')
        self.assertEqual(resolve(url).func.cls, TaskViewSet)
        
    def test_task_detail_url(self):
        url = reverse('task-detail', kwargs={'pk': 1})
        self.assertEqual(url, '/api/tasks/tasks/1/')
        self.assertEqual(resolve(url).func.cls, TaskViewSet)