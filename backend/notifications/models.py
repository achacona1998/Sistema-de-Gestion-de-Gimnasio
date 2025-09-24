from django.db import models
from django.contrib.auth import get_user_model
from apps.core.models import Socio

User = get_user_model()

class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ('info', 'Información'),
        ('success', 'Éxito'),
        ('warning', 'Advertencia'),
        ('error', 'Error'),
    ]
    
    CATEGORIES = [
        ('memberships', 'Membresías'),
        ('payments', 'Pagos'),
        ('classes', 'Clases'),
        ('equipment', 'Equipamiento'),
        ('reminders', 'Recordatorios'),
        ('system', 'Sistema'),
    ]
    
    PRIORITIES = [
        ('low', 'Baja'),
        ('medium', 'Media'),
        ('high', 'Alta'),
    ]
    
    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES, default='info')
    category = models.CharField(max_length=20, choices=CATEGORIES, default='system')
    priority = models.CharField(max_length=10, choices=PRIORITIES, default='medium')
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Campos opcionales para referencias
    socio = models.ForeignKey(Socio, on_delete=models.CASCADE, null=True, blank=True)
    reference_id = models.CharField(max_length=100, null=True, blank=True)  # Para referenciar otros objetos
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'read']),
            models.Index(fields=['created_at']),
            models.Index(fields=['category']),
            models.Index(fields=['priority']),
        ]
    
    def __str__(self):
        return f'{self.title} - {self.user.email}'

class NotificationSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_settings')
    
    # Métodos de notificación
    email_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    
    # Categorías
    memberships_enabled = models.BooleanField(default=True)
    payments_enabled = models.BooleanField(default=True)
    classes_enabled = models.BooleanField(default=True)
    equipment_enabled = models.BooleanField(default=True)
    reminders_enabled = models.BooleanField(default=True)
    system_enabled = models.BooleanField(default=True)
    
    # Prioridades
    high_priority_enabled = models.BooleanField(default=True)
    medium_priority_enabled = models.BooleanField(default=True)
    low_priority_enabled = models.BooleanField(default=False)
    
    # Configuraciones adicionales
    quiet_hours_start = models.TimeField(null=True, blank=True)  # Hora de inicio del modo silencioso
    quiet_hours_end = models.TimeField(null=True, blank=True)    # Hora de fin del modo silencioso
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'Configuración de {self.user.email}'

class NotificationTemplate(models.Model):
    """Plantillas para generar notificaciones automáticas"""
    
    TRIGGER_TYPES = [
        ('membership_expiry', 'Vencimiento de Membresía'),
        ('payment_due', 'Pago Pendiente'),
        ('class_reminder', 'Recordatorio de Clase'),
        ('equipment_maintenance', 'Mantenimiento de Equipo'),
        ('low_attendance', 'Baja Asistencia'),
        ('new_member', 'Nuevo Miembro'),
    ]
    
    template_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    trigger_type = models.CharField(max_length=30, choices=TRIGGER_TYPES)
    title_template = models.CharField(max_length=200)
    message_template = models.TextField()
    notification_type = models.CharField(max_length=20, choices=Notification.NOTIFICATION_TYPES)
    category = models.CharField(max_length=20, choices=Notification.CATEGORIES)
    priority = models.CharField(max_length=10, choices=Notification.PRIORITIES)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f'{self.name} ({self.trigger_type})'

class NotificationLog(models.Model):
    """Log de notificaciones enviadas para auditoría"""
    
    DELIVERY_METHODS = [
        ('in_app', 'En la aplicación'),
        ('email', 'Email'),
        ('sms', 'SMS'),
        ('push', 'Push'),
    ]
    
    DELIVERY_STATUS = [
        ('pending', 'Pendiente'),
        ('sent', 'Enviado'),
        ('delivered', 'Entregado'),
        ('failed', 'Fallido'),
        ('bounced', 'Rebotado'),
    ]
    
    log_id = models.AutoField(primary_key=True)
    notification = models.ForeignKey(Notification, on_delete=models.CASCADE, related_name='delivery_logs')
    delivery_method = models.CharField(max_length=20, choices=DELIVERY_METHODS)
    delivery_status = models.CharField(max_length=20, choices=DELIVERY_STATUS, default='pending')
    delivery_address = models.CharField(max_length=255)  # Email, teléfono, etc.
    error_message = models.TextField(null=True, blank=True)
    
    sent_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-sent_at']
    
    def __str__(self):
        return f'{self.notification.title} - {self.delivery_method} ({self.delivery_status})'
