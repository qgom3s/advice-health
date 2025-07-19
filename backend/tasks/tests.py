from django.test import TestCase

# Create your tests here - esboços de testes para o módulo de tarefas.
def test_update_task(self):
    url = reverse('task-detail', kwargs={'pk': self.task.pk})
    data = {'title': 'Updated Title'}
    response = self.client.patch(url, data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.task.refresh_from_db()
    self.assertEqual(self.task.title, 'Updated Title')
    
    
def test_unauthenticated_access(self):
    self.client.logout()
    url = reverse('task-list')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    
def test_filter_by_completion_status(self):
    Task.objects.create(
        user=self.user,
        title='Completed Task',
        is_completed=True
    )
    url = reverse('task-list') + '?is_completed=true'
    response = self.client.get(url)
    self.assertEqual(len(response.data), 1)
    self.assertEqual(response.data[0]['title'], 'Completed Task')