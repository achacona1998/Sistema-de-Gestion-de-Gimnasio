import os
import sys
import django
from django.test import TestCase
from decimal import Decimal
from datetime import date

# Agregar el directorio del backend al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gimnasio.settings')
django.setup()

from apps.core.models import Socio, Membresia, Entrenador, Asistencia, Pago
from apps.core.serializers import (
    SocioSerializer, MembresiaSerializer, EntrenadorSerializer,
    AsistenciaSerializer, PagoSerializer
)


class SocioSerializerTest(TestCase):
    """Tests para el serializer de Socio"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio=50.00,
            duracion_meses=1,
            descripcion='Membresía básica'
        )
        
        self.socio_data = {
            'nombre': 'Ana Serializer',
            'telefono': '555-1111',
            'correo': 'ana@test.com',
            'membresia': self.membresia.id
        }
        
        self.socio = Socio.objects.create(
            nombre='Carlos Existente',
            telefono='555-2222',
            correo='carlos@test.com',
            membresia=self.membresia
        )
    
    def test_socio_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        serializer = SocioSerializer(data=self.socio_data)
        self.assertTrue(serializer.is_valid())
        
        socio = serializer.save()
        self.assertEqual(socio.nombre, 'Ana Serializer')
        self.assertEqual(socio.correo, 'ana@test.com')
        self.assertEqual(socio.membresia, self.membresia)
    
    def test_socio_serializer_invalid_email(self):
        """Test para serializer con email inválido"""
        invalid_data = self.socio_data.copy()
        invalid_data['correo'] = 'email_invalido'
        
        serializer = SocioSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('correo', serializer.errors)
    
    def test_socio_serializer_missing_required_field(self):
        """Test para serializer con campo requerido faltante"""
        invalid_data = self.socio_data.copy()
        del invalid_data['nombre']
        
        serializer = SocioSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nombre', serializer.errors)
    
    def test_socio_serializer_update(self):
        """Test para actualizar socio con serializer"""
        update_data = {
            'nombre': 'Carlos Actualizado',
            'telefono': '555-9999',
            'correo': 'carlos@test.com',
            'membresia': self.membresia.id
        }
        
        serializer = SocioSerializer(self.socio, data=update_data)
        self.assertTrue(serializer.is_valid())
        
        updated_socio = serializer.save()
        self.assertEqual(updated_socio.nombre, 'Carlos Actualizado')
        self.assertEqual(updated_socio.telefono, '555-9999')
    
    def test_socio_serializer_read_only_fields(self):
        """Test para verificar campos de solo lectura"""
        serializer = SocioSerializer(self.socio)
        data = serializer.data
        
        self.assertIn('id', data)
        self.assertIn('fecha_registro', data)
        self.assertIn('membresia_tipo', data)


class MembresiaSerializerTest(TestCase):
    """Tests para el serializer de Membresía"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia_data = {
            'tipo': 'Premium Test',
            'precio': 100.00,
            'duracion_meses': 3,
            'descripcion': 'Membresía premium de prueba'
        }
        
        self.membresia = Membresia.objects.create(
            tipo='VIP Existente',
            precio=200.00,
            duracion_meses=6,
            descripcion='Membresía VIP existente'
        )
    
    def test_membresia_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        serializer = MembresiaSerializer(data=self.membresia_data)
        self.assertTrue(serializer.is_valid())
        
        membresia = serializer.save()
        self.assertEqual(membresia.tipo, 'Premium Test')
        self.assertEqual(membresia.precio, Decimal('100.00'))
        self.assertEqual(membresia.duracion_meses, 3)
    
    def test_membresia_serializer_negative_price(self):
        """Test para serializer con precio negativo"""
        invalid_data = self.membresia_data.copy()
        invalid_data['precio'] = -50.00
        
        serializer = MembresiaSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
    
    def test_membresia_serializer_zero_duration(self):
        """Test para serializer con duración cero"""
        invalid_data = self.membresia_data.copy()
        invalid_data['duracion_meses'] = 0
        
        serializer = MembresiaSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
    
    def test_membresia_serializer_update(self):
        """Test para actualizar membresía con serializer"""
        update_data = {
            'tipo': 'VIP Actualizada',
            'precio': 250.00,
            'duracion_meses': 12,
            'descripcion': 'Membresía VIP anual actualizada'
        }
        
        serializer = MembresiaSerializer(self.membresia, data=update_data)
        self.assertTrue(serializer.is_valid())
        
        updated_membresia = serializer.save()
        self.assertEqual(updated_membresia.tipo, 'VIP Actualizada')
        self.assertEqual(updated_membresia.precio, Decimal('250.00'))
        self.assertEqual(updated_membresia.duracion_meses, 12)


class EntrenadorSerializerTest(TestCase):
    """Tests para el serializer de Entrenador"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.entrenador_data = {
            'nombre': 'Laura Trainer',
            'telefono': '555-3333',
            'correo': 'laura@gym.com',
            'especialidad': 'Pilates',
            'salario': 1800.00
        }
        
        self.entrenador = Entrenador.objects.create(
            nombre='Miguel Existente',
            telefono='555-4444',
            correo': 'miguel@gym.com',
            'especialidad': 'CrossFit',
            'salario': 2200.00
        )
    
    def test_entrenador_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        serializer = EntrenadorSerializer(data=self.entrenador_data)
        self.assertTrue(serializer.is_valid())
        
        entrenador = serializer.save()
        self.assertEqual(entrenador.nombre, 'Laura Trainer')
        self.assertEqual(entrenador.especialidad, 'Pilates')
        self.assertEqual(entrenador.salario, Decimal('1800.00'))
    
    def test_entrenador_serializer_invalid_email(self):
        """Test para serializer con email inválido"""
        invalid_data = self.entrenador_data.copy()
        invalid_data['correo'] = 'email_sin_formato'
        
        serializer = EntrenadorSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('correo', serializer.errors)
    
    def test_entrenador_serializer_negative_salary(self):
        """Test para serializer con salario negativo"""
        invalid_data = self.entrenador_data.copy()
        invalid_data['salario'] = -1000.00
        
        serializer = EntrenadorSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())


class AsistenciaSerializerTest(TestCase):
    """Tests para el serializer de Asistencia"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio=50.00,
            duracion_meses=1,
            descripcion='Membresía básica'
        )
        
        self.socio = Socio.objects.create(
            nombre='Roberto Asistente',
            telefono='555-5555',
            correo='roberto@test.com',
            membresia=self.membresia
        )
        
        self.asistencia_data = {
            'socio': self.socio.id,
            'fecha': date.today().isoformat(),
            'hora_entrada': '08:00:00'
        }
        
        self.asistencia = Asistencia.objects.create(
            socio=self.socio,
            fecha=date.today(),
            hora_entrada='09:00:00'
        )
    
    def test_asistencia_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        serializer = AsistenciaSerializer(data=self.asistencia_data)
        self.assertTrue(serializer.is_valid())
        
        asistencia = serializer.save()
        self.assertEqual(asistencia.socio, self.socio)
        self.assertEqual(asistencia.fecha, date.today())
        self.assertEqual(str(asistencia.hora_entrada), '08:00:00')
    
    def test_asistencia_serializer_missing_socio(self):
        """Test para serializer sin socio"""
        invalid_data = self.asistencia_data.copy()
        del invalid_data['socio']
        
        serializer = AsistenciaSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('socio', serializer.errors)
    
    def test_asistencia_serializer_invalid_date_format(self):
        """Test para serializer con formato de fecha inválido"""
        invalid_data = self.asistencia_data.copy()
        invalid_data['fecha'] = '2024-13-45'  # Fecha inválida
        
        serializer = AsistenciaSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
    
    def test_asistencia_serializer_read_only_fields(self):
        """Test para verificar campos de solo lectura"""
        serializer = AsistenciaSerializer(self.asistencia)
        data = serializer.data
        
        self.assertIn('id', data)
        self.assertIn('socio_nombre', data)


class PagoSerializerTest(TestCase):
    """Tests para el serializer de Pago"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio=50.00,
            duracion_meses=1,
            descripcion='Membresía básica'
        )
        
        self.socio = Socio.objects.create(
            nombre='Elena Pagadora',
            telefono='555-6666',
            correo='elena@test.com',
            membresia=self.membresia
        )
        
        self.pago_data = {
            'socio': self.socio.id,
            'monto': 50.00,
            'fecha_pago': date.today().isoformat(),
            'metodo_pago': 'Tarjeta',
            'concepto': 'Mensualidad Test'
        }
        
        self.pago = Pago.objects.create(
            socio=self.socio,
            monto=75.00,
            fecha_pago=date.today(),
            metodo_pago='Efectivo',
            concepto='Mensualidad Existente'
        )
    
    def test_pago_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        serializer = PagoSerializer(data=self.pago_data)
        self.assertTrue(serializer.is_valid())
        
        pago = serializer.save()
        self.assertEqual(pago.socio, self.socio)
        self.assertEqual(pago.monto, Decimal('50.00'))
        self.assertEqual(pago.metodo_pago, 'Tarjeta')
        self.assertEqual(pago.concepto, 'Mensualidad Test')
    
    def test_pago_serializer_negative_amount(self):
        """Test para serializer con monto negativo"""
        invalid_data = self.pago_data.copy()
        invalid_data['monto'] = -25.00
        
        serializer = PagoSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
    
    def test_pago_serializer_zero_amount(self):
        """Test para serializer con monto cero"""
        invalid_data = self.pago_data.copy()
        invalid_data['monto'] = 0.00
        
        serializer = PagoSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
    
    def test_pago_serializer_read_only_fields(self):
        """Test para verificar campos de solo lectura"""
        serializer = PagoSerializer(self.pago)
        data = serializer.data
        
        self.assertIn('id', data)
        self.assertIn('socio_nombre', data)