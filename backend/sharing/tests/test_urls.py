from django.urls import reverse, resolve
from django.test import TestCase
from ..views import ShareViewSet, UserViewSet

class SharingUrlsTest(TestCase):
    def test_share_list_url(self):
        url = reverse('share-list')
        self.assertEqual(url, '/api/sharing/')
        self.assertEqual(resolve(url).func.cls, ShareViewSet)
    
    def test_user_list_url(self):
        url = reverse('user-list')
        self.assertEqual(url, '/api/sharing/users/')
        self.assertEqual(resolve(url).func.cls, UserViewSet)