from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, UserRegisterView

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    path('register/', UserRegisterView.as_view(), name='user-register'),
] + router.urls