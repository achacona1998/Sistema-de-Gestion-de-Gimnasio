import os
import sys
import django
from django.test import TestCase
from django.core.exceptions import ValidationError
from decimal import Decimal
from datetime import date, timedelta

# Agregar el directorio del backend al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gimnasio.settings')
django.setup()

from apps.core.models import Socio, Membresia, Entrenador, ClasesGrupales, Asistencia, Pago
from apps.Users.models import UserAccount


class SocioModelTest(TestCase):
    """Tests para el modelo Socio"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio=50.00,
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
        self.assertTrue(socio.activo)
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
    
    def test_socio_correo_unico(self):
        """Test para verificar que el correo sea único"""
        Socio.objects.create(
            nombre='Pedro López',
            telefono='555-9999',
            correo='pedro@email.com',
            membresia=self.membresia
        )
        
        with self.assertRaises(Exception):
            Socio.objects.create(
                nombre='Ana Martínez',
                telefono='555-8888',
                correo='pedro@email.com',  # Correo duplicado
                membresia=self.membresia
            )


class MembresiaModelTest(TestCase):
    """Tests para el modelo Membresía"""
    
    def test_crear_membresia_valida(self):
        """Test para crear una membresía con datos válidos"""
        membresia = Membresia.objects.create(
            tipo='Premium',
            precio=100.00,
            duracion_meses=3,
            descripcion='Membresía premium trimestral'
        )
        
        self.assertEqual(membresia.tipo, 'Premium')
        self.assertEqual(membresia.precio, Decimal('100.00'))
        self.assertEqual(membresia.duracion_meses, 3)
        self.assertEqual(membresia.descripcion, 'Membresía premium trimestral')
    
    def test_membresia_str_method(self):
        """Test para el método __str__ del modelo Membresía"""
        membresia = Membresia.objects.create(
            tipo='VIP',
            precio=200.00,
            duracion_meses=6,
            descripcion='Membresía VIP semestral'
        )
        
        self.assertEqual(str(membresia), 'VIP')
    
    def test_precio_positivo(self):
        """Test para verificar que el precio sea positivo"""
        with self.assertRaises(ValidationError):
            membresia = Membresia(
                tipo='Inválida',
                precio=-50.00,  # Precio negativo
                duracion_meses=1,
                descripcion='Membresía inválida'
            )
            membresia.full_clean()


class EntrenadorModelTest(TestCase):
    """Tests para el modelo Entrenador"""
    
    def test_crear_entrenador_valido(self):
        """Test para crear un entrenador con datos válidos"""
        entrenador = Entrenador.objects.create(
            nombre='Carlos Fitness',
            telefono='555-7777',
            correo='carlos@gym.com',
            especialidad='Musculación',
            salario=2000.00
        )
        
        self.assertEqual(entrenador.nombre, 'Carlos Fitness')
        self.assertEqual(entrenador.telefono, '555-7777')
        self.assertEqual(entrenador.correo, 'carlos@gym.com')
        self.assertEqual(entrenador.especialidad, 'Musculación')
        self.assertEqual(entrenador.salario, Decimal('2000.00'))
        self.assertTrue(entrenador.activo)
    
    def test_entrenador_str_method(self):
        """Test para el método __str__ del modelo Entrenador"""
        entrenador = Entrenador.objects.create(
            nombre='Ana Trainer',
            telefono='555-6666',
            correo='ana@gym.com',
            especialidad='Yoga',
            salario=1500.00
        )
        
        self.assertEqual(str(entrenador), 'Ana Trainer')


class AsistenciaModelTest(TestCase):
    """Tests para el modelo Asistencia"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio=50.00,
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
            socio=self.socio,
            fecha=date.today(),
            hora_entrada='09:00:00'
        )
        
        self.assertEqual(asistencia.socio, self.socio)
        self.assertEqual(asistencia.fecha, date.today())
        self.assertEqual(str(asistencia.hora_entrada), '09:00:00')
        self.assertIsNone(asistencia.hora_salida)
    
    def test_asistencia_str_method(self):
        """Test para el método __str__ del modelo Asistencia"""
        asistencia = Asistencia.objects.create(
            socio=self.socio,
            fecha=date.today(),
            hora_entrada='10:00:00'
        )
        
        expected_str = f'{self.socio.nombre} - {date.today()}'
        self.assertEqual(str(asistencia), expected_str)


class PagoModelTest(TestCase):
    """Tests para el modelo Pago"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio=50.00,
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
            fecha_pago=date.today(),
            metodo_pago='Efectivo',
            concepto='Mensualidad Enero'
        )
        
        self.assertEqual(pago.socio, self.socio)
        self.assertEqual(pago.monto, Decimal('50.00'))
        self.assertEqual(pago.fecha_pago, date.today())
        self.assertEqual(pago.metodo_pago, 'Efectivo')
        self.assertEqual(pago.concepto, 'Mensualidad Enero')
    
    def test_pago_str_method(self):
        """Test para el método __str__ del modelo Pago"""
        pago = Pago.objects.create(
            socio=self.socio,
            monto=75.00,
            fecha_pago=date.today(),
            metodo_pago='Tarjeta',
            concepto='Mensualidad Febrero'
        )
        
        expected_str = f'{self.socio.nombre} - $75.00'
        self.assertEqual(str(pago), expected_str)