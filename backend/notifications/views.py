from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from django.utils import timezone
from django.contrib.auth import get_user_model

from .models import Notification, NotificationSettings, NotificationTemplate, NotificationLog
from .serializers import (
    NotificationSerializer, NotificationCreateSerializer, NotificationUpdateSerializer,
    NotificationSettingsSerializer, NotificationTemplateSerializer, NotificationLogSerializer,
    NotificationStatsSerializer, BulkNotificationSerializer
)

User = get_user_model()

class NotificationViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return NotificationCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return NotificationUpdateSerializer
        return NotificationSerializer
    
    def get_queryset(self):
        user = self.request.user
        queryset = Notification.objects.filter(user=user)
        
        # Filtros
        category = self.request.query_params.get('category')
        priority = self.request.query_params.get('priority')
        read = self.request.query_params.get('read')
        
        if category:
            queryset = queryset.filter(category=category)
        if priority:
            queryset = queryset.filter(priority=priority)
        if read is not None:
            queryset = queryset.filter(read=read.lower() == 'true')
        
        return queryset.select_related('socio')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Obtener el número de notificaciones no leídas"""
        count = self.get_queryset().filter(read=False).count()
        return Response({'unread_count': count})
    
    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Marcar todas las notificaciones como leídas"""
        updated = self.get_queryset().filter(read=False).update(
            read=True,
            read_at=timezone.now()
        )
        return Response({'marked_read': updated})
    
    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Marcar una notificación específica como leída"""
        notification = self.get_object()
        if not notification.read:
            notification.read = True
            notification.read_at = timezone.now()
            notification.save()
        
        serializer = self.get_serializer(notification)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Obtener estadísticas de notificaciones"""
        queryset = self.get_queryset()
        
        total = queryset.count()
        unread = queryset.filter(read=False).count()
        
        # Estadísticas por categoría
        by_category = queryset.values('category').annotate(
            count=Count('notification_id')
        ).order_by('-count')
        
        # Estadísticas por prioridad
        by_priority = queryset.values('priority').annotate(
            count=Count('notification_id')
        ).order_by('-count')
        
        # Notificaciones recientes (últimas 5)
        recent = queryset.order_by('-created_at')[:5]
        
        stats_data = {
            'total_notifications': total,
            'unread_notifications': unread,
            'notifications_by_category': {item['category']: item['count'] for item in by_category},
            'notifications_by_priority': {item['priority']: item['count'] for item in by_priority},
            'recent_notifications': NotificationSerializer(recent, many=True).data
        }
        
        serializer = NotificationStatsSerializer(stats_data)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Crear notificaciones en lote"""
        serializer = BulkNotificationSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            user_ids = data.pop('user_ids')
            send_email = data.pop('send_email', False)
            send_push = data.pop('send_push', False)
            
            # Crear notificaciones para cada usuario
            notifications = []
            for user_id in user_ids:
                try:
                    user = User.objects.get(id=user_id)
                    notification = Notification.objects.create(user=user, **data)
                    notifications.append(notification)
                except User.DoesNotExist:
                    continue
            
            # Aquí se podría implementar el envío de emails/push notifications
            # if send_email:
            #     send_email_notifications(notifications)
            # if send_push:
            #     send_push_notifications(notifications)
            
            return Response({
                'created': len(notifications),
                'notifications': NotificationSerializer(notifications, many=True).data
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NotificationSettingsViewSet(viewsets.ModelViewSet):
    serializer_class = NotificationSettingsSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return NotificationSettings.objects.filter(user=self.request.user)
    
    def get_object(self):
        """Obtener o crear configuración de notificaciones para el usuario"""
        settings, created = NotificationSettings.objects.get_or_create(
            user=self.request.user
        )
        return settings
    
    @action(detail=False, methods=['get', 'put', 'patch'])
    def my_settings(self, request):
        """Obtener o actualizar configuración del usuario actual"""
        settings = self.get_object()
        
        if request.method == 'GET':
            serializer = self.get_serializer(settings)
            return Response(serializer.data)
        
        elif request.method in ['PUT', 'PATCH']:
            partial = request.method == 'PATCH'
            serializer = self.get_serializer(settings, data=request.data, partial=partial)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NotificationTemplateViewSet(viewsets.ModelViewSet):
    queryset = NotificationTemplate.objects.all()
    serializer_class = NotificationTemplateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filtros
        trigger_type = self.request.query_params.get('trigger_type')
        is_active = self.request.query_params.get('is_active')
        
        if trigger_type:
            queryset = queryset.filter(trigger_type=trigger_type)
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset
    
    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """Activar/desactivar plantilla"""
        template = self.get_object()
        template.is_active = not template.is_active
        template.save()
        
        serializer = self.get_serializer(template)
        return Response(serializer.data)

class NotificationLogViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Solo mostrar logs de notificaciones del usuario actual
        return NotificationLog.objects.filter(
            notification__user=self.request.user
        ).select_related('notification')
    
    @action(detail=False, methods=['get'])
    def delivery_stats(self, request):
        """Estadísticas de entrega de notificaciones"""
        queryset = self.get_queryset()
        
        # Estadísticas por método de entrega
        by_method = queryset.values('delivery_method').annotate(
            count=Count('log_id')
        ).order_by('-count')
        
        # Estadísticas por estado de entrega
        by_status = queryset.values('delivery_status').annotate(
            count=Count('log_id')
        ).order_by('-count')
        
        return Response({
            'by_delivery_method': {item['delivery_method']: item['count'] for item in by_method},
            'by_delivery_status': {item['delivery_status']: item['count'] for item in by_status},
            'total_logs': queryset.count()
        })
