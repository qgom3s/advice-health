from django.urls import reverse, resolve
from django.test import TestCase
from ..views import UserRegisterView, UserViewSet

class UrlsTest(TestCase):
    def test_register_url(self):
        url = reverse('user-register')
        self.assertEqual(url, '/api/users/register/')
        self.assertEqual(resolve(url).func.view_class, UserRegisterView)
        
    def test_user_list_url(self):
        url = reverse('user-list')
        self.assertEqual(url, '/api/users/')
        self.assertEqual(resolve(url).func.cls, UserViewSet)