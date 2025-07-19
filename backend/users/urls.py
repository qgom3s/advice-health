from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserRegisterView

router = DefaultRouter()
router.register(r'', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', UserRegisterView.as_view(), name='register'),
]
