from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NotificationViewSet,
    NotificationSettingsViewSet,
    NotificationTemplateViewSet,
    NotificationLogViewSet
)

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'settings', NotificationSettingsViewSet, basename='notification-settings')
router.register(r'templates', NotificationTemplateViewSet, basename='notification-template')
router.register(r'logs', NotificationLogViewSet, basename='notification-log')

urlpatterns = [
    path('api/', include(router.urls)),
]