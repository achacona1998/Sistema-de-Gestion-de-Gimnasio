import os
import django
import random
from datetime import datetime, timedelta, time
from decimal import Decimal

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gimnasio.settings')
django.setup()

from apps.core.models import (
    Membresia, Entrenador, Clase, Socio, Pago, Asistencia, 
    SocioClase, Equipo
)
from apps.Users.models import UserAccount
from notifications.models import Notification, NotificationSettings, NotificationTemplate

def create_memberships():
    """Crear tipos de membresías"""
    memberships_data = [
        {
            'tipo': 'Básica',
            'descripcion': 'Acceso al gimnasio y área de pesas. Incluye uso de vestidores y duchas.',
            'precio_mensual': Decimal('599.00'),
            'duracion_meses': 1
        },
        {
            'tipo': 'Premium',
            'descripcion': 'Acceso completo al gimnasio, clases grupales y área de cardio.',
            'precio_mensual': Decimal('899.00'),
            'duracion_meses': 1
        },
        {
            'tipo': 'VIP',
            'descripcion': 'Acceso completo + entrenamientos personales + nutricionista.',
            'precio_mensual': Decimal('1299.00'),
            'duracion_meses': 1
        },
        {
            'tipo': 'Anual Básica',
            'descripcion': 'Membresía básica con descuento por pago anual.',
            'precio_mensual': Decimal('499.00'),
            'duracion_meses': 12
        },
        {
            'tipo': 'Anual Premium',
            'descripcion': 'Membresía premium con descuento por pago anual.',
            'precio_mensual': Decimal('749.00'),
            'duracion_meses': 12
        }
    ]
    
    for data in memberships_data:
        Membresia.objects.get_or_create(
            tipo=data['tipo'],
            defaults=data
        )
    print(f"✓ Creadas {len(memberships_data)} membresías")

def create_trainers():
    """Crear entrenadores"""
    trainers_data = [
        {
            'nombre': 'Carlos Mendoza',
            'especialidad': 'CrossFit',
            'telefono': '555-0101',
            'correo': 'carlos.mendoza@gimnasio.com'
        },
        {
            'nombre': 'Ana Ruiz',
            'especialidad': 'Yoga',
            'telefono': '555-0102',
            'correo': 'ana.ruiz@gimnasio.com'
        },
        {
            'nombre': 'Luis García',
            'especialidad': 'Spinning',
            'telefono': '555-0103',
            'correo': 'luis.garcia@gimnasio.com'
        },
        {
            'nombre': 'María López',
            'especialidad': 'Pilates',
            'telefono': '555-0104',
            'correo': 'maria.lopez@gimnasio.com'
        },
        {
            'nombre': 'Roberto Silva',
            'especialidad': 'Funcional',
            'telefono': '555-0105',
            'correo': 'roberto.silva@gimnasio.com'
        },
        {
            'nombre': 'Carmen Torres',
            'especialidad': 'Zumba',
            'telefono': '555-0106',
            'correo': 'carmen.torres@gimnasio.com'
        },
        {
            'nombre': 'Diego Morales',
            'especialidad': 'Natación',
            'telefono': '555-0107',
            'correo': 'diego.morales@gimnasio.com'
        },
        {
            'nombre': 'Patricia Vega',
            'especialidad': 'Aeróbicos',
            'telefono': '555-0108',
            'correo': 'patricia.vega@gimnasio.com'
        }
    ]
    
    for data in trainers_data:
        Entrenador.objects.get_or_create(
            correo=data['correo'],
            defaults=data
        )
    print(f"✓ Creados {len(trainers_data)} entrenadores")

def create_classes():
    """Crear clases"""
    entrenadores = list(Entrenador.objects.all())
    if not entrenadores:
        print("❌ No hay entrenadores disponibles")
        return
    
    classes_data = [
        {'nombre': 'CrossFit Matutino', 'capacidad_max': 15, 'hora': 6},
        {'nombre': 'Yoga Relajante', 'capacidad_max': 20, 'hora': 7},
        {'nombre': 'Spinning Intenso', 'capacidad_max': 25, 'hora': 8},
        {'nombre': 'Pilates Core', 'capacidad_max': 18, 'hora': 9},
        {'nombre': 'Funcional HIIT', 'capacidad_max': 20, 'hora': 10},
        {'nombre': 'Zumba Fitness', 'capacidad_max': 30, 'hora': 17},
        {'nombre': 'Natación Libre', 'capacidad_max': 12, 'hora': 18},
        {'nombre': 'Aeróbicos Vespertino', 'capacidad_max': 25, 'hora': 19},
        {'nombre': 'CrossFit Nocturno', 'capacidad_max': 15, 'hora': 20},
        {'nombre': 'Yoga Nocturno', 'capacidad_max': 20, 'hora': 21}
    ]
    
    # Crear clases para los próximos 30 días
    base_date = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    
    for i in range(30):  # 30 días
        current_date = base_date + timedelta(days=i)
        
        for class_data in classes_data:
            # Asignar entrenador basado en especialidad
            entrenador = random.choice(entrenadores)
            
            horario = current_date.replace(
                hour=class_data['hora'],
                minute=random.choice([0, 30])  # Clases a las :00 o :30
            )
            
            Clase.objects.get_or_create(
                nombre=class_data['nombre'],
                horario=horario,
                defaults={
                    'entrenador': entrenador,
                    'capacidad_max': class_data['capacidad_max']
                }
            )
    
    print(f"✓ Creadas clases para 30 días")

def create_members():
    """Crear socios/miembros"""
    memberships = list(Membresia.objects.all())
    if not memberships:
        print("❌ No hay membresías disponibles")
        return
    
    members_data = [
        {'nombre': 'Juan Pérez', 'telefono': '555-1001', 'correo': 'juan.perez@email.com'},
        {'nombre': 'María García', 'telefono': '555-1002', 'correo': 'maria.garcia@email.com'},
        {'nombre': 'Carlos Ruiz', 'telefono': '555-1003', 'correo': 'carlos.ruiz@email.com'},
        {'nombre': 'Ana López', 'telefono': '555-1004', 'correo': 'ana.lopez@email.com'},
        {'nombre': 'Luis Martín', 'telefono': '555-1005', 'correo': 'luis.martin@email.com'},
        {'nombre': 'Carmen Sánchez', 'telefono': '555-1006', 'correo': 'carmen.sanchez@email.com'},
        {'nombre': 'Roberto Torres', 'telefono': '555-1007', 'correo': 'roberto.torres@email.com'},
        {'nombre': 'Patricia Morales', 'telefono': '555-1008', 'correo': 'patricia.morales@email.com'},
        {'nombre': 'Diego Vega', 'telefono': '555-1009', 'correo': 'diego.vega@email.com'},
        {'nombre': 'Laura Silva', 'telefono': '555-1010', 'correo': 'laura.silva@email.com'},
        {'nombre': 'Fernando Castro', 'telefono': '555-1011', 'correo': 'fernando.castro@email.com'},
        {'nombre': 'Sofía Herrera', 'telefono': '555-1012', 'correo': 'sofia.herrera@email.com'},
        {'nombre': 'Andrés Jiménez', 'telefono': '555-1013', 'correo': 'andres.jimenez@email.com'},
        {'nombre': 'Valeria Romero', 'telefono': '555-1014', 'correo': 'valeria.romero@email.com'},
        {'nombre': 'Javier Mendoza', 'telefono': '555-1015', 'correo': 'javier.mendoza@email.com'},
        {'nombre': 'Gabriela Flores', 'telefono': '555-1016', 'correo': 'gabriela.flores@email.com'},
        {'nombre': 'Ricardo Vargas', 'telefono': '555-1017', 'correo': 'ricardo.vargas@email.com'},
        {'nombre': 'Mónica Reyes', 'telefono': '555-1018', 'correo': 'monica.reyes@email.com'},
        {'nombre': 'Alejandro Cruz', 'telefono': '555-1019', 'correo': 'alejandro.cruz@email.com'},
        {'nombre': 'Isabella Ramírez', 'telefono': '555-1020', 'correo': 'isabella.ramirez@email.com'}
    ]
    
    for data in members_data:
        # Asignar membresía aleatoria
        membresia = random.choice(memberships)
        
        # Fecha de registro aleatoria en los últimos 6 meses
        fecha_registro = datetime.now() - timedelta(days=random.randint(1, 180))
        
        socio, created = Socio.objects.get_or_create(
            correo=data['correo'],
            defaults={
                'nombre': data['nombre'],
                'telefono': data['telefono'],
                'membresia': membresia,
                'fecha_registro': fecha_registro
            }
        )
    
    print(f"✓ Creados {len(members_data)} socios")

def create_payments():
    """Crear pagos"""
    socios = list(Socio.objects.all())
    if not socios:
        print("❌ No hay socios disponibles")
        return
    
    metodos = ['efectivo', 'tarjeta', 'transferencia']
    
    # Crear pagos para cada socio (1-3 pagos por socio)
    for socio in socios:
        num_pagos = random.randint(1, 3)
        
        for i in range(num_pagos):
            # Fecha de pago aleatoria en los últimos 3 meses
            fecha_pago = datetime.now() - timedelta(days=random.randint(1, 90))
            
            # Monto basado en la membresía del socio
            monto_base = socio.membresia.precio_mensual
            monto = monto_base + Decimal(random.uniform(-50, 50))  # Variación pequeña
            
            Pago.objects.create(
                socio=socio,
                monto=monto,
                fecha_pago=fecha_pago,
                metodo=random.choice(metodos)
            )
    
    print(f"✓ Creados pagos para todos los socios")

def create_attendance():
    """Crear registros de asistencia"""
    socios = list(Socio.objects.all())
    if not socios:
        print("❌ No hay socios disponibles")
        return
    
    # Crear asistencias para los últimos 30 días
    for i in range(30):
        fecha = datetime.now() - timedelta(days=i)
        
        # Número aleatorio de asistencias por día (5-15)
        num_asistencias = random.randint(5, 15)
        
        socios_del_dia = random.sample(socios, min(num_asistencias, len(socios)))
        
        for socio in socios_del_dia:
            # Hora de entrada aleatoria entre 6:00 AM y 10:00 PM
            hora_entrada = random.randint(6, 22)
            minuto_entrada = random.choice([0, 15, 30, 45])
            
            fecha_entrada = fecha.replace(
                hour=hora_entrada,
                minute=minuto_entrada,
                second=0,
                microsecond=0
            )
            
            # Duración de entrenamiento entre 45 minutos y 3 horas
            duracion_minutos = random.randint(45, 180)
            fecha_salida = fecha_entrada + timedelta(minutes=duracion_minutos)
            
            # 90% de probabilidad de tener fecha de salida
            if random.random() < 0.9:
                Asistencia.objects.create(
                    socio=socio,
                    fecha_entrada=fecha_entrada,
                    fecha_salida=fecha_salida
                )
            else:
                # Sin fecha de salida (aún en el gimnasio)
                Asistencia.objects.create(
                    socio=socio,
                    fecha_entrada=fecha_entrada
                )
    
    print(f"✓ Creadas asistencias para 30 días")

def create_class_enrollments():
    """Crear inscripciones a clases"""
    socios = list(Socio.objects.all())
    clases = list(Clase.objects.filter(horario__gte=datetime.now()))
    
    if not socios or not clases:
        print("❌ No hay socios o clases disponibles")
        return
    
    # Inscribir socios a clases aleatorias
    for socio in socios:
        # Cada socio se inscribe a 1-5 clases
        num_clases = random.randint(1, 5)
        clases_socio = random.sample(clases, min(num_clases, len(clases)))
        
        for clase in clases_socio:
            # Verificar que no exceda la capacidad
            inscripciones_actuales = SocioClase.objects.filter(clase=clase).count()
            
            if inscripciones_actuales < clase.capacidad_max:
                SocioClase.objects.get_or_create(
                    socio=socio,
                    clase=clase,
                    defaults={
                        'fecha_inscripcion': datetime.now() - timedelta(days=random.randint(1, 7))
                    }
                )
    
    print(f"✓ Creadas inscripciones a clases")

def create_equipment():
    """Crear equipamiento"""
    equipment_data = [
        {
            'nombre': 'Cinta de Correr TechnoGym',
            'descripcion': 'Cinta de correr profesional con pantalla táctil y programas predefinidos',
            'estado': 'disponible'
        },
        {
            'nombre': 'Bicicleta Estática Spinning',
            'descripcion': 'Bicicleta de spinning con resistencia magnética y monitor de frecuencia cardíaca',
            'estado': 'disponible'
        },
        {
            'nombre': 'Máquina de Remo Concept2',
            'descripcion': 'Máquina de remo profesional con monitor PM5',
            'estado': 'disponible'
        },
        {
            'nombre': 'Banco de Pesas Ajustable',
            'descripcion': 'Banco ajustable para ejercicios con mancuernas y barras',
            'estado': 'disponible'
        },
        {
            'nombre': 'Rack de Sentadillas',
            'descripcion': 'Rack profesional para sentadillas y press de banca',
            'estado': 'disponible'
        },
        {
            'nombre': 'Máquina Elíptica',
            'descripcion': 'Elíptica con resistencia variable y programas de entrenamiento',
            'estado': 'mantenimiento'
        },
        {
            'nombre': 'Set de Mancuernas',
            'descripcion': 'Juego completo de mancuernas de 5kg a 50kg',
            'estado': 'disponible'
        },
        {
            'nombre': 'Máquina de Poleas',
            'descripcion': 'Sistema de poleas para ejercicios de tracción y empuje',
            'estado': 'disponible'
        },
        {
            'nombre': 'Prensa de Piernas',
            'descripcion': 'Máquina de prensa inclinada para entrenamiento de piernas',
            'estado': 'reparacion'
        },
        {
            'nombre': 'Barras Olímpicas',
            'descripcion': 'Set de barras olímpicas de 20kg para levantamiento de pesas',
            'estado': 'disponible'
        }
    ]
    
    for data in equipment_data:
        # Fecha de adquisición aleatoria en los últimos 2 años
        fecha_adquisicion = datetime.now().date() - timedelta(days=random.randint(30, 730))
        
        # Fecha de último mantenimiento (si aplica)
        ultima_mantenimiento = None
        if random.random() < 0.7:  # 70% tiene mantenimiento registrado
            ultima_mantenimiento = fecha_adquisicion + timedelta(days=random.randint(30, 365))
        
        Equipo.objects.get_or_create(
            nombre=data['nombre'],
            defaults={
                'descripcion': data['descripcion'],
                'fecha_adquisicion': fecha_adquisicion,
                'estado': data['estado'],
                'ultima_mantenimiento': ultima_mantenimiento
            }
        )
    
    print(f"✓ Creados {len(equipment_data)} equipos")

def create_users():
    """Crear usuarios del sistema"""
    users_data = [
        {
            'email': 'admin@gimnasio.com',
            'first_name': 'Administrador',
            'last_name': 'Sistema',
            'is_staff': True,
            'is_superuser': True
        },
        {
            'email': 'recepcion@gimnasio.com',
            'first_name': 'Personal',
            'last_name': 'Recepción',
            'is_staff': True,
            'is_superuser': False
        },
        {
            'email': 'gerente@gimnasio.com',
            'first_name': 'Gerente',
            'last_name': 'General',
            'is_staff': True,
            'is_superuser': False
        }
    ]
    
    for data in users_data:
        user, created = UserAccount.objects.get_or_create(
            email=data['email'],
            defaults={
                'first_name': data['first_name'],
                'last_name': data['last_name'],
                'is_staff': data['is_staff'],
                'is_superuser': data['is_superuser']
            }
        )
        
        if created:
            user.set_password('admin123')  # Contraseña por defecto
            user.save()
    
    print(f"✓ Creados {len(users_data)} usuarios del sistema")

def create_notifications():
    """Crear notificaciones de ejemplo"""
    users = list(UserAccount.objects.all())
    socios = list(Socio.objects.all())
    
    if not users:
        print("❌ No hay usuarios disponibles")
        return
    
    notifications_data = [
        {
            'title': 'Bienvenido al Sistema',
            'message': 'Gracias por unirte a nuestro gimnasio. ¡Esperamos que disfrutes tu experiencia!',
            'notification_type': 'success',
            'category': 'system',
            'priority': 'medium'
        },
        {
            'title': 'Mantenimiento Programado',
            'message': 'El sistema estará en mantenimiento el próximo domingo de 2:00 AM a 6:00 AM.',
            'notification_type': 'warning',
            'category': 'system',
            'priority': 'high'
        },
        {
            'title': 'Nueva Clase Disponible',
            'message': 'Se ha agregado una nueva clase de Yoga Avanzado los martes a las 7:00 PM.',
            'notification_type': 'info',
            'category': 'classes',
            'priority': 'medium'
        },
        {
            'title': 'Recordatorio de Pago',
            'message': 'Tu membresía vence en 3 días. No olvides renovarla para continuar disfrutando nuestros servicios.',
            'notification_type': 'warning',
            'category': 'payments',
            'priority': 'high'
        },
        {
            'title': 'Equipo en Mantenimiento',
            'message': 'La máquina elíptica #3 estará fuera de servicio por mantenimiento hasta el viernes.',
            'notification_type': 'info',
            'category': 'equipment',
            'priority': 'low'
        }
    ]
    
    for user in users:
        for i, data in enumerate(notifications_data):
            # Crear notificación
            notification = Notification.objects.create(
                user=user,
                title=data['title'],
                message=data['message'],
                notification_type=data['notification_type'],
                category=data['category'],
                priority=data['priority'],
                read=random.choice([True, False]),  # Algunas leídas, otras no
                socio=random.choice(socios) if socios and random.random() < 0.3 else None
            )
            
            # Si está leída, agregar fecha de lectura
            if notification.read:
                notification.read_at = datetime.now() - timedelta(hours=random.randint(1, 48))
                notification.save()
    
    print(f"✓ Creadas notificaciones para todos los usuarios")

def create_notification_settings():
    """Crear configuraciones de notificación"""
    users = UserAccount.objects.all()
    
    for user in users:
        NotificationSettings.objects.get_or_create(
            user=user,
            defaults={
                'email_notifications': True,
                'push_notifications': True,
                'sms_notifications': False,
                'memberships_enabled': True,
                'payments_enabled': True,
                'classes_enabled': True,
                'equipment_enabled': True,
                'reminders_enabled': True,
                'system_enabled': True,
                'high_priority_enabled': True,
                'medium_priority_enabled': True,
                'low_priority_enabled': False,
                'quiet_hours_start': time(22, 0),  # 10:00 PM
                'quiet_hours_end': time(7, 0)     # 7:00 AM
            }
        )
    
    print(f"✓ Creadas configuraciones de notificación")

def main():
    """Función principal para poblar la base de datos"""
    print("🚀 Iniciando población de la base de datos...\n")
    
    try:
        # Crear datos en orden de dependencias
        create_memberships()
        create_trainers()
        create_classes()
        create_members()
        create_payments()
        create_attendance()
        create_class_enrollments()
        create_equipment()
        create_users()
        create_notifications()
        create_notification_settings()
        
        print("\n✅ ¡Base de datos poblada exitosamente!")
        print("\n📊 Resumen:")
        print(f"   • Membresías: {Membresia.objects.count()}")
        print(f"   • Entrenadores: {Entrenador.objects.count()}")
        print(f"   • Clases: {Clase.objects.count()}")
        print(f"   • Socios: {Socio.objects.count()}")
        print(f"   • Pagos: {Pago.objects.count()}")
        print(f"   • Asistencias: {Asistencia.objects.count()}")
        print(f"   • Inscripciones a clases: {SocioClase.objects.count()}")
        print(f"   • Equipos: {Equipo.objects.count()}")
        print(f"   • Usuarios del sistema: {UserAccount.objects.count()}")
        print(f"   • Notificaciones: {Notification.objects.count()}")
        
        print("\n🔑 Credenciales de acceso:")
        print("   • Email: admin@gimnasio.com")
        print("   • Contraseña: admin123")
        
    except Exception as e:
        print(f"❌ Error al poblar la base de datos: {e}")
        raise

if __name__ == '__main__':
    main()