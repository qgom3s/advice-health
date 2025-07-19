from django.test import TestCase

# Create your tests here - esboços de testes para o módulo de usuários.
self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
self.assertIn('username', response.data)

from django.db.models import Q
self.assertEqual(User.objects.filter(Q(username='test')).count(), 1)

def tearDown(self):
    User.objects.all().delete()