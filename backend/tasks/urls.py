from rest_framework import routers
from django.urls import path, include
from .views import TaskViewSet

router = routers.DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')


urlpatterns = [
    path('', include(router.urls)),
]
