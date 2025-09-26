import os
import sys
import django
from django.test import TestCase
from django.core.exceptions import ValidationError
from decimal import Decimal
from datetime import date, timedelta, datetime

# Agregar el directorio del backend al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gimnasio.settings')
django.setup()

from apps.core.models import Socio, Membresia, Entrenador, Clase, Asistencia, Pago, Equipo, SocioClase
from apps.Users.models import UserAccount


class SocioModelTest(TestCase):
    """Tests para el modelo Socio"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio_mensual=50.00,
            duracion_meses=1,
            descripcion='Membresía básica mensual'
        )
    
    def test_crear_socio_valido(self):
        """Test para crear un socio con datos válidos"""
        socio = Socio.objects.create(
            nombre='Juan Pérez',
            telefono='555-1234',
            correo='juan@email.com',
            membresia=self.membresia
        )
        
        self.assertEqual(socio.nombre, 'Juan Pérez')
        self.assertEqual(socio.telefono, '555-1234')
        self.assertEqual(socio.correo, 'juan@email.com')
        self.assertEqual(socio.membresia, self.membresia)
        self.assertIsNotNone(socio.fecha_registro)
    
    def test_socio_str_method(self):
        """Test para el método __str__ del modelo Socio"""
        socio = Socio.objects.create(
            nombre='María García',
            telefono='555-5678',
            correo='maria@email.com',
            membresia=self.membresia
        )
        
        self.assertEqual(str(socio), 'María García')
    
    def test_socio_correo_duplicado_permitido(self):
        """Test para verificar que se pueden crear socios con el mismo correo"""
        socio1 = Socio.objects.create(
            nombre='Pedro López',
            telefono='555-9999',
            correo='pedro@email.com',
            membresia=self.membresia
        )
        
        # El modelo permite correos duplicados
        socio2 = Socio.objects.create(
            nombre='Ana Martínez',
            telefono='555-8888',
            correo='pedro@email.com',  # Correo duplicado permitido
            membresia=self.membresia
        )
        
        self.assertEqual(socio1.correo, socio2.correo)


class MembresiaModelTest(TestCase):
    """Tests para el modelo Membresía"""
    
    def test_crear_membresia_valida(self):
        """Test para crear una membresía con datos válidos"""
        membresia = Membresia.objects.create(
            tipo='Premium',
            precio_mensual=100.00,
            duracion_meses=3,
            descripcion='Membresía premium trimestral'
        )
        
        self.assertEqual(membresia.tipo, 'Premium')
        self.assertEqual(membresia.precio_mensual, Decimal('100.00'))
        self.assertEqual(membresia.duracion_meses, 3)
        self.assertEqual(membresia.descripcion, 'Membresía premium trimestral')
    
    def test_membresia_str_method(self):
        """Test para el método __str__ del modelo Membresía"""
        membresia = Membresia.objects.create(
            tipo='VIP',
            precio_mensual=200.00,
            duracion_meses=6,
            descripcion='Membresía VIP semestral'
        )
        
        self.assertEqual(str(membresia), 'VIP')
    
    def test_precio_negativo_permitido(self):
        """Test para verificar que el modelo permite precios negativos"""
        membresia = Membresia(
            tipo='Test',
            precio_mensual=-50.00,  # Precio negativo permitido
            duracion_meses=1,
            descripcion='Membresía de prueba'
        )
        # El modelo no valida precios positivos, así que esto debería funcionar
        membresia.full_clean()
        membresia.save()
        self.assertEqual(membresia.precio_mensual, -50.00)


class EntrenadorModelTest(TestCase):
    """Tests para el modelo Entrenador"""
    
    def test_crear_entrenador_valido(self):
        """Test para crear un entrenador con datos válidos"""
        entrenador = Entrenador.objects.create(
            nombre='Carlos Fitness',
            telefono='555-7777',
            correo='carlos@gym.com',
            especialidad='Musculación'
        )
        
        self.assertEqual(entrenador.nombre, 'Carlos Fitness')
        self.assertEqual(entrenador.telefono, '555-7777')
        self.assertEqual(entrenador.correo, 'carlos@gym.com')
        self.assertEqual(entrenador.especialidad, 'Musculación')
    
    def test_entrenador_str_method(self):
        """Test para el método __str__ del modelo Entrenador"""
        entrenador = Entrenador.objects.create(
            nombre='Ana Trainer',
            telefono='555-6666',
            correo='ana@gym.com',
            especialidad='Yoga'
        )
        
        self.assertEqual(str(entrenador), 'Ana Trainer')


class AsistenciaModelTest(TestCase):
    """Tests para el modelo Asistencia"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio_mensual=50.00,
            duracion_meses=1,
            descripcion='Membresía básica'
        )
        
        self.socio = Socio.objects.create(
            nombre='Luis Deportista',
            telefono='555-3333',
            correo='luis@email.com',
            membresia=self.membresia
        )
    
    def test_crear_asistencia_valida(self):
        """Test para crear una asistencia con datos válidos"""
        asistencia = Asistencia.objects.create(
            socio=self.socio
        )
        
        self.assertEqual(asistencia.socio, self.socio)
        self.assertIsNotNone(asistencia.fecha_entrada)
        self.assertIsNone(asistencia.fecha_salida)
    
    def test_asistencia_str_method(self):
        """Test para el método __str__ del modelo Asistencia"""
        asistencia = Asistencia.objects.create(
            socio=self.socio
        )
        
        expected_str = f'Asistencia {asistencia.asistencia_id} - {self.socio.nombre}'
        self.assertEqual(str(asistencia), expected_str)


class PagoModelTest(TestCase):
    """Tests para el modelo Pago"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio_mensual=50.00,
            duracion_meses=1,
            descripcion='Membresía básica'
        )
        
        self.socio = Socio.objects.create(
            nombre='Carmen Pagadora',
            telefono='555-4444',
            correo='carmen@email.com',
            membresia=self.membresia
        )
    
    def test_crear_pago_valido(self):
        """Test para crear un pago con datos válidos"""
        pago = Pago.objects.create(
            socio=self.socio,
            monto=50.00,
            metodo='efectivo'
        )
        
        self.assertEqual(pago.socio, self.socio)
        self.assertEqual(pago.monto, Decimal('50.00'))
        self.assertIsNotNone(pago.fecha_pago)
        self.assertEqual(pago.metodo, 'efectivo')
    
    def test_pago_str_method(self):
        """Test para el método __str__ del modelo Pago"""
        pago = Pago.objects.create(
            socio=self.socio,
            monto=75.00,
            metodo='tarjeta'
        )
        
        expected_str = f'Pago {pago.pago_id} - {self.socio.nombre}'
        self.assertEqual(str(pago), expected_str)


class ClaseModelTest(TestCase):
    """Tests para el modelo Clase"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.entrenador = Entrenador.objects.create(
            nombre='Pedro Instructor',
            telefono='555-8888',
            correo='pedro@gym.com',
            especialidad='CrossFit'
        )
    
    def test_crear_clase_valida(self):
        """Test para crear una clase con datos válidos"""
        horario_clase = datetime(2024, 1, 15, 8, 0, 0)
        clase = Clase.objects.create(
            nombre='CrossFit Matutino',
            entrenador=self.entrenador,
            horario=horario_clase,
            capacidad_max=15
        )
        
        self.assertEqual(clase.nombre, 'CrossFit Matutino')
        self.assertEqual(clase.entrenador, self.entrenador)
        self.assertEqual(clase.horario, horario_clase)
        self.assertEqual(clase.capacidad_max, 15)
    
    def test_clase_str_method(self):
        """Test para el método __str__ del modelo Clase"""
        horario_clase = datetime(2024, 1, 15, 18, 0, 0)
        clase = Clase.objects.create(
            nombre='Yoga Vespertino',
            entrenador=self.entrenador,
            horario=horario_clase,
            capacidad_max=20
        )
        
        self.assertEqual(str(clase), 'Yoga Vespertino')
    
    def test_capacidad_maxima_negativa_permitida(self):
        """Test para verificar que el modelo permite capacidades negativas"""
        horario_clase = datetime(2024, 1, 15, 10, 0, 0)
        # El modelo no valida capacidades positivas, así que esto debería funcionar
        clase = Clase(
            nombre='Clase Test',
            entrenador=self.entrenador,
            horario=horario_clase,
            capacidad_max=-5  # Capacidad negativa permitida
        )
        clase.full_clean()
        clase.save()
        self.assertEqual(clase.capacidad_max, -5)


class EquipoModelTest(TestCase):
    """Tests para el modelo Equipo"""
    
    def test_crear_equipo_valido(self):
        """Test para crear un equipo con datos válidos"""
        equipo = Equipo.objects.create(
            nombre='Cinta de Correr',
            descripcion='Cinta de correr profesional marca X',
            fecha_adquisicion=date.today(),
            estado='Operativo'
        )
        
        self.assertEqual(equipo.nombre, 'Cinta de Correr')
        self.assertEqual(equipo.descripcion, 'Cinta de correr profesional marca X')
        self.assertEqual(equipo.fecha_adquisicion, date.today())
        self.assertEqual(equipo.estado, 'Operativo')
        self.assertIsNone(equipo.ultima_mantenimiento)
    
    def test_equipo_str_method(self):
        """Test para el método __str__ del modelo Equipo"""
        equipo = Equipo.objects.create(
            nombre='Bicicleta Estática',
            descripcion='Bicicleta estática con monitor',
            fecha_adquisicion=date.today(),
            estado='Operativo'
        )
        
        self.assertEqual(str(equipo), 'Bicicleta Estática')
    
    def test_equipo_con_mantenimiento(self):
        """Test para equipo con fecha de último mantenimiento"""
        fecha_mantenimiento = date.today() - timedelta(days=30)
        equipo = Equipo.objects.create(
            nombre='Máquina de Pesas',
            descripcion='Máquina multifuncional de pesas',
            fecha_adquisicion=date.today() - timedelta(days=365),
            estado='Mantenimiento',
            ultima_mantenimiento=fecha_mantenimiento
        )
        
        self.assertEqual(equipo.ultima_mantenimiento, fecha_mantenimiento)
        self.assertEqual(equipo.estado, 'Mantenimiento')


class SocioClaseModelTest(TestCase):
    """Tests para el modelo SocioClase"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Premium',
            precio_mensual=100.00,
            duracion_meses=1,
            descripcion='Membresía premium'
        )
        
        self.socio = Socio.objects.create(
            nombre='Ana Deportista',
            telefono='555-9999',
            correo='ana@email.com',
            membresia=self.membresia
        )
        
        self.entrenador = Entrenador.objects.create(
            nombre='Miguel Trainer',
            telefono='555-0000',
            correo='miguel@gym.com',
            especialidad='Pilates'
        )
        
        horario_clase = datetime(2024, 1, 15, 19, 0, 0)
        self.clase = Clase.objects.create(
            nombre='Pilates Avanzado',
            entrenador=self.entrenador,
            horario=horario_clase,
            capacidad_max=12
        )
    
    def test_crear_socio_clase_valida(self):
        """Test para crear una inscripción socio-clase válida"""
        socio_clase = SocioClase.objects.create(
            socio=self.socio,
            clase=self.clase
        )
        
        self.assertEqual(socio_clase.socio, self.socio)
        self.assertEqual(socio_clase.clase, self.clase)
        self.assertIsNotNone(socio_clase.fecha_inscripcion)
    
    def test_socio_clase_str_method(self):
        """Test para el método __str__ del modelo SocioClase"""
        socio_clase = SocioClase.objects.create(
            socio=self.socio,
            clase=self.clase
        )
        
        expected_str = f'{self.socio.nombre} - {self.clase.nombre}'
        self.assertEqual(str(socio_clase), expected_str)
    
    def test_inscripcion_unica_socio_clase(self):
        """Test para verificar que un socio no se pueda inscribir dos veces a la misma clase"""
        # Primera inscripción
        SocioClase.objects.create(
            socio=self.socio,
            clase=self.clase
        )
        
        # Intentar segunda inscripción (debería fallar)
        with self.assertRaises(Exception):
            SocioClase.objects.create(
                socio=self.socio,
                clase=self.clase
            )


class UserAccountModelTest(TestCase):
    """Tests para el modelo UserAccount"""
    
    def test_crear_usuario_valido(self):
        """Test para crear un usuario con datos válidos"""
        user = UserAccount.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User'
        )
        
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.first_name, 'Test')
        self.assertEqual(user.last_name, 'User')
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
    
    def test_crear_superusuario(self):
        """Test para crear un superusuario"""
        admin = UserAccount.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        
        self.assertEqual(admin.email, 'admin@example.com')
        self.assertTrue(admin.is_active)
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
    
    def test_usuario_str_method(self):
        """Test para el método __str__ del modelo UserAccount"""
        user = UserAccount.objects.create_user(
            email='john@example.com',
            password='johnpass123',
            first_name='John',
            last_name='Doe'
        )
        
        self.assertEqual(str(user), 'john@example.com')
    
    def test_email_unico(self):
        """Test para verificar que el email sea único"""
        UserAccount.objects.create_user(
            email='unique@example.com',
            password='pass123',
            first_name='First',
            last_name='User'
        )
        
        # Intentar crear otro usuario con el mismo email
        with self.assertRaises(Exception):
            UserAccount.objects.create_user(
                email='unique@example.com',
                password='pass456',
                first_name='Second',
                last_name='User'
            )