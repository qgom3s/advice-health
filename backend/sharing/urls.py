from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShareViewSet, UserViewSet

router = DefaultRouter()
router.register(r'', ShareViewSet, basename='share')
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
]
