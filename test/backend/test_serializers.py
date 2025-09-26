import os
import sys
import django
from django.test import TestCase
from decimal import Decimal
from datetime import date, datetime

# Agregar el directorio del backend al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gimnasio.settings')
django.setup()

from apps.core.models import Socio, Membresia, Entrenador, Asistencia, Pago, Clase, Equipo, SocioClase
from apps.core.serializers import (
    SocioSerializer, MembresiaSerializer, EntrenadorSerializer,
    AsistenciaSerializer, PagoSerializer, ClaseSerializer, EquipoSerializer, SocioClaseSerializer
)


class SocioSerializerTest(TestCase):
    """Tests para el serializer de Socio"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio_mensual=50.00,
            duracion_meses=1,
            descripcion='Membresía básica'
        )
        
        self.socio_data = {
            'nombre': 'Ana Serializer',
            'telefono': '555-1111',
            'correo': 'ana@test.com',
            'membresia': self.membresia.membresia_id
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
            'membresia': self.membresia.membresia_id
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
        
        self.assertIn('socio_id', data)
        self.assertIn('fecha_registro', data)
        self.assertIn('membresia_tipo', data)


class MembresiaSerializerTest(TestCase):
    """Tests para el serializer de Membresía"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia_data = {
            'tipo': 'Premium Test',
            'precio_mensual': 100.00,
            'duracion_meses': 3,
            'descripcion': 'Membresía premium de prueba'
        }
        
        self.membresia = Membresia.objects.create(
            tipo='VIP Existente',
            precio_mensual=200.00,
            duracion_meses=6,
            descripcion='Membresía VIP existente'
        )
    
    def test_membresia_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        serializer = MembresiaSerializer(data=self.membresia_data)
        self.assertTrue(serializer.is_valid())
        
        membresia = serializer.save()
        self.assertEqual(membresia.tipo, 'Premium Test')
        self.assertEqual(membresia.precio_mensual, Decimal('100.00'))
        self.assertEqual(membresia.duracion_meses, 3)
    
    def test_membresia_serializer_negative_price(self):
        """Test para serializer con precio negativo"""
        invalid_data = self.membresia_data.copy()
        invalid_data['precio_mensual'] = -50.00
        
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
            'precio_mensual': 250.00,
            'duracion_meses': 12,
            'descripcion': 'Membresía VIP anual actualizada'
        }
        
        serializer = MembresiaSerializer(self.membresia, data=update_data)
        self.assertTrue(serializer.is_valid())
        
        updated_membresia = serializer.save()
        self.assertEqual(updated_membresia.tipo, 'VIP Actualizada')
        self.assertEqual(updated_membresia.precio_mensual, Decimal('250.00'))
        self.assertEqual(updated_membresia.duracion_meses, 12)


class EntrenadorSerializerTest(TestCase):
    """Tests para el serializer de Entrenador"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.entrenador_data = {
            'nombre': 'Laura Trainer',
            'telefono': '555-3333',
            'correo': 'laura@gym.com',
            'especialidad': 'Pilates'
        }
        
        self.entrenador = Entrenador.objects.create(
            nombre='Miguel Existente',
            telefono='555-4444',
            correo= 'miguel@gym.com',
            especialidad= 'CrossFit'
        )
    
    def test_entrenador_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        serializer = EntrenadorSerializer(data=self.entrenador_data)
        self.assertTrue(serializer.is_valid())
        
        entrenador = serializer.save()
        self.assertEqual(entrenador.nombre, 'Laura Trainer')
        self.assertEqual(entrenador.especialidad, 'Pilates')
    
    def test_entrenador_serializer_invalid_email(self):
        """Test para serializer con email inválido"""
        invalid_data = self.entrenador_data.copy()
        invalid_data['correo'] = 'email_sin_formato'
        
        serializer = EntrenadorSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('correo', serializer.errors)
    
    def test_entrenador_serializer_missing_required_field(self):
        """Test para serializer con campo requerido faltante"""
        invalid_data = self.entrenador_data.copy()
        del invalid_data['nombre']
        
        serializer = EntrenadorSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nombre', serializer.errors)


class AsistenciaSerializerTest(TestCase):
    """Tests para el serializer de Asistencia"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio_mensual=50.00,
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
            'socio': self.socio.socio_id,
            'fecha_entrada': '2024-01-15T08:00:00Z'
        }
        
        self.asistencia = Asistencia.objects.create(
            socio=self.socio,
            fecha_entrada=datetime(2024, 1, 15, 9, 0, 0)
        )
    
    def test_asistencia_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        serializer = AsistenciaSerializer(data=self.asistencia_data)
        self.assertTrue(serializer.is_valid())
        
        asistencia = serializer.save()
        self.assertEqual(asistencia.socio, self.socio)
        self.assertIsNotNone(asistencia.fecha_entrada)
    
    def test_asistencia_serializer_missing_socio(self):
        """Test para serializer sin socio"""
        invalid_data = self.asistencia_data.copy()
        del invalid_data['socio']
        
        serializer = AsistenciaSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('socio', serializer.errors)
    
    def test_asistencia_serializer_invalid_socio(self):
        """Test para serializer con socio inválido"""
        invalid_data = self.asistencia_data.copy()
        invalid_data['socio'] = 999  # Socio que no existe
        
        serializer = AsistenciaSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
    
    def test_asistencia_serializer_read_only_fields(self):
        """Test para verificar campos de solo lectura"""
        serializer = AsistenciaSerializer(self.asistencia)
        data = serializer.data
        
        self.assertIn('asistencia_id', data)
        self.assertIn('socio_nombre', data)


class ClaseSerializerTest(TestCase):
    """Tests para el serializer de Clase"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.entrenador = Entrenador.objects.create(
            nombre='Laura Instructor',
            telefono='555-3333',
            correo='laura@gym.com',
            especialidad='Zumba'
        )
        
        self.clase_data = {
            'nombre': 'Zumba Matutino',
            'entrenador': self.entrenador.entrenador_id,
            'horario': '2024-01-15T09:00:00Z',
            'capacidad_max': 25
        }
        
        self.clase = Clase.objects.create(
            nombre='Aeróbicos Existente',
            entrenador=self.entrenador,
            horario=datetime(2024, 1, 15, 17, 0, 0),
            capacidad_max=20
        )
    
    def test_clase_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        serializer = ClaseSerializer(data=self.clase_data)
        self.assertTrue(serializer.is_valid())
        
        clase = serializer.save()
        self.assertEqual(clase.nombre, 'Zumba Matutino')
        self.assertEqual(clase.entrenador, self.entrenador)
        self.assertEqual(clase.capacidad_max, 25)
    
    def test_clase_serializer_invalid_capacity(self):
        """Test para serializer con capacidad inválida"""
        invalid_data = self.clase_data.copy()
        invalid_data['capacidad_max'] = -5
        
        serializer = ClaseSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
    
    def test_clase_serializer_missing_entrenador(self):
        """Test para serializer sin entrenador"""
        invalid_data = self.clase_data.copy()
        del invalid_data['entrenador']
        
        serializer = ClaseSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('entrenador', serializer.errors)
    
    def test_clase_serializer_read_only_fields(self):
        """Test para verificar campos de solo lectura"""
        serializer = ClaseSerializer(self.clase)
        data = serializer.data
        
        self.assertIn('clase_id', data)
        self.assertIn('entrenador_nombre', data)
        self.assertEqual(data['entrenador_nombre'], self.entrenador.nombre)


class EquipoSerializerTest(TestCase):
    """Tests para el serializer de Equipo"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.equipo_data = {
            'nombre': 'Elíptica Nueva',
            'descripcion': 'Máquina elíptica profesional',
            'fecha_adquisicion': date.today().isoformat(),
            'estado': 'disponible'
        }
        
        self.equipo = Equipo.objects.create(
            nombre='Banco de Pesas',
            descripcion='Banco ajustable para pesas',
            fecha_adquisicion=date.today(),
            estado='disponible'
        )
    
    def test_equipo_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        serializer = EquipoSerializer(data=self.equipo_data)
        self.assertTrue(serializer.is_valid())
        
        equipo = serializer.save()
        self.assertEqual(equipo.nombre, 'Elíptica Nueva')
        self.assertEqual(equipo.descripcion, 'Máquina elíptica profesional')
        self.assertEqual(equipo.estado, 'disponible')
    
    def test_equipo_serializer_missing_name(self):
        """Test para serializer sin nombre"""
        invalid_data = self.equipo_data.copy()
        del invalid_data['nombre']
        
        serializer = EquipoSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nombre', serializer.errors)
    
    def test_equipo_serializer_update(self):
        """Test para actualizar equipo con serializer"""
        update_data = {
            'nombre': 'Banco de Pesas Actualizado',
            'descripcion': 'Banco ajustable mejorado',
            'fecha_adquisicion': self.equipo.fecha_adquisicion.isoformat(),
            'estado': 'mantenimiento'
        }
        
        serializer = EquipoSerializer(self.equipo, data=update_data)
        self.assertTrue(serializer.is_valid())
        
        updated_equipo = serializer.save()
        self.assertEqual(updated_equipo.nombre, 'Banco de Pesas Actualizado')
        self.assertEqual(updated_equipo.estado, 'mantenimiento')
    
    def test_equipo_serializer_read_only_fields(self):
        """Test para verificar campos de solo lectura"""
        serializer = EquipoSerializer(self.equipo)
        data = serializer.data
        
        self.assertIn('equipo_id', data)


class SocioClaseSerializerTest(TestCase):
    """Tests para el serializer de SocioClase"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Premium',
            precio_mensual=100.00,
            duracion_meses=1,
            descripcion='Membresía premium'
        )
        
        self.socio = Socio.objects.create(
            nombre='Roberto Inscrito',
            telefono='555-4444',
            correo='roberto@test.com',
            membresia=self.membresia
        )
        
        self.entrenador = Entrenador.objects.create(
            nombre='Sofia Trainer',
            telefono='555-5555',
            correo='sofia@gym.com',
            especialidad='Spinning'
        )
        
        self.clase = Clase.objects.create(
            nombre='Spinning Intensivo',
            entrenador=self.entrenador,
            horario=datetime(2024, 1, 15, 20, 0, 0),
            capacidad_max=15
        )
        
        self.socio_clase_data = {
            'socio': self.socio.socio_id,
            'clase': self.clase.clase_id,
            'fecha_inscripcion': date.today().isoformat()
        }
        
        self.socio_clase = SocioClase.objects.create(
            socio=self.socio,
            clase=self.clase,
            fecha_inscripcion=date.today()
        )
    
    def test_socio_clase_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        # Crear otro socio para evitar duplicados
        otro_socio = Socio.objects.create(
            nombre='Maria Nueva',
            telefono='555-6666',
            correo='maria@test.com',
            membresia=self.membresia
        )
        
        data = {
            'socio': otro_socio.socio_id,
            'clase': self.clase.clase_id,
            'fecha_inscripcion': date.today().isoformat()
        }
        
        serializer = SocioClaseSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        
        socio_clase = serializer.save()
        self.assertEqual(socio_clase.socio, otro_socio)
        self.assertEqual(socio_clase.clase, self.clase)
    
    def test_socio_clase_serializer_missing_socio(self):
        """Test para serializer sin socio"""
        invalid_data = self.socio_clase_data.copy()
        del invalid_data['socio']
        
        serializer = SocioClaseSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('socio', serializer.errors)
    
    def test_socio_clase_serializer_missing_clase(self):
        """Test para serializer sin clase"""
        invalid_data = self.socio_clase_data.copy()
        del invalid_data['clase']
        
        serializer = SocioClaseSerializer(data=invalid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('clase', serializer.errors)
    
    def test_socio_clase_serializer_read_only_fields(self):
        """Test para verificar campos de solo lectura"""
        serializer = SocioClaseSerializer(self.socio_clase)
        data = serializer.data
        
        self.assertIn('socio_nombre', data)
        self.assertIn('clase_nombre', data)
        self.assertEqual(data['socio_nombre'], self.socio.nombre)
        self.assertEqual(data['clase_nombre'], self.clase.nombre)


class PagoSerializerTest(TestCase):
    """Tests para el serializer de Pago"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio_mensual=50.00,
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
            'socio': self.socio.socio_id,
            'monto': 50.00,
            'metodo': 'tarjeta'
        }
        
        self.pago = Pago.objects.create(
            socio=self.socio,
            monto=75.00,
            metodo='efectivo'
        )
    
    def test_pago_serializer_valid_data(self):
        """Test para serializer con datos válidos"""
        serializer = PagoSerializer(data=self.pago_data)
        self.assertTrue(serializer.is_valid())
        
        pago = serializer.save()
        self.assertEqual(pago.socio, self.socio)
        self.assertEqual(pago.monto, Decimal('50.00'))
        self.assertEqual(pago.metodo, 'tarjeta')
    
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
        
        self.assertIn('pago_id', data)
        self.assertIn('socio_nombre', data)