from rest_framework import serializers
from .models import Notification, NotificationSettings, NotificationTemplate, NotificationLog
from apps.core.serializers import SocioSerializer

class NotificationSerializer(serializers.ModelSerializer):
    socio = SocioSerializer(read_only=True)
    time_ago = serializers.SerializerMethodField()
    
    class Meta:
        model = Notification
        fields = [
            'notification_id', 'title', 'message', 'notification_type',
            'category', 'priority', 'read', 'created_at', 'read_at',
            'socio', 'reference_id', 'time_ago'
        ]
        read_only_fields = ['notification_id', 'created_at']
    
    def get_time_ago(self, obj):
        from django.utils import timezone
        from datetime import timedelta
        
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff.days > 0:
            return f'hace {diff.days} día{"s" if diff.days > 1 else ""}'
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f'hace {hours} hora{"s" if hours > 1 else ""}'
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f'hace {minutes} minuto{"s" if minutes > 1 else ""}'
        else:
            return 'hace unos segundos'

class NotificationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = [
            'title', 'message', 'notification_type', 'category',
            'priority', 'socio', 'reference_id'
        ]

class NotificationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['read', 'read_at']
    
    def update(self, instance, validated_data):
        if validated_data.get('read') and not instance.read:
            from django.utils import timezone
            validated_data['read_at'] = timezone.now()
        return super().update(instance, validated_data)

class NotificationSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationSettings
        fields = [
            'email_notifications', 'push_notifications', 'sms_notifications',
            'memberships_enabled', 'payments_enabled', 'classes_enabled',
            'equipment_enabled', 'reminders_enabled', 'system_enabled',
            'high_priority_enabled', 'medium_priority_enabled', 'low_priority_enabled',
            'quiet_hours_start', 'quiet_hours_end'
        ]

class NotificationTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationTemplate
        fields = [
            'template_id', 'name', 'trigger_type', 'title_template',
            'message_template', 'notification_type', 'category',
            'priority', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['template_id', 'created_at', 'updated_at']

class NotificationLogSerializer(serializers.ModelSerializer):
    notification = NotificationSerializer(read_only=True)
    
    class Meta:
        model = NotificationLog
        fields = [
            'log_id', 'notification', 'delivery_method', 'delivery_status',
            'delivery_address', 'error_message', 'sent_at', 'delivered_at'
        ]
        read_only_fields = ['log_id', 'sent_at']

class NotificationStatsSerializer(serializers.Serializer):
    """Serializer para estadísticas de notificaciones"""
    total_notifications = serializers.IntegerField()
    unread_notifications = serializers.IntegerField()
    notifications_by_category = serializers.DictField()
    notifications_by_priority = serializers.DictField()
    recent_notifications = NotificationSerializer(many=True)

class BulkNotificationSerializer(serializers.Serializer):
    """Serializer para envío masivo de notificaciones"""
    title = serializers.CharField(max_length=200)
    message = serializers.CharField()
    notification_type = serializers.ChoiceField(choices=Notification.NOTIFICATION_TYPES)
    category = serializers.ChoiceField(choices=Notification.CATEGORIES)
    priority = serializers.ChoiceField(choices=Notification.PRIORITIES)
    user_ids = serializers.ListField(
        child=serializers.IntegerField(),
        allow_empty=False
    )
    send_email = serializers.BooleanField(default=False)
    send_push = serializers.BooleanField(default=False)