from django.test import TestCase

# Create your tests here - esboços de testes para o módulo de compartilhamento.
def test_unauthenticated_access(self):
    self.client.logout()
    url = reverse('share-list')
    response = self.client.get(url)
    self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    
def test_update_share(self):
    url = reverse('share-detail', kwargs={'pk': self.share1.id})
    data = {'user_id': self.user2.id}
    response = self.client.patch(url, data)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.share1.refresh_from_db()
    self.assertEqual(self.share1.user.username, 'user2')
    
    
def test_delete_share(self):
    url = reverse('share-detail', kwargs={'pk': self.share1.id})
    response = self.client.delete(url)
    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    self.assertEqual(Share.objects.count(), 0)