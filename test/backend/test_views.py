import os
import sys
import django
import json
from decimal import Decimal
from datetime import date, datetime
from django.utils import timezone

# Agregar el directorio del backend al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gimnasio.settings')
django.setup()

from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from apps.core.models import Socio, Membresia, Entrenador, Asistencia, Pago, Clase, Equipo, SocioClase
from apps.Users.models import UserAccount

User = get_user_model()


class AuthenticationTestCase(APITestCase):
    """Tests para autenticación JWT"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.client = APIClient()
        self.user_data = {
            'email': 'test@test.com',
            'password': 'testpass123',
            'first_name': 'Test',
            'last_name': 'User'
        }
        self.user = UserAccount.objects.create_user(**self.user_data)
    
    def test_user_registration(self):
        """Test para registro de usuario"""
        url = '/auth/users/'
        data = {
            'email': 'newuser@test.com',
            'password': 'newpass123',
            're_password': 'newpass123',
            'first_name': 'New',
            'last_name': 'User'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(UserAccount.objects.filter(email='newuser@test.com').exists())
    
    def test_user_login(self):
        """Test para login de usuario"""
        url = '/auth/jwt/create/'
        data = {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_user_login_invalid_credentials(self):
        """Test para login con credenciales inválidas"""
        url = '/auth/jwt/create/'
        data = {
            'email': self.user_data['email'],
            'password': 'wrongpassword'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_token_refresh(self):
        """Test para renovar token"""
        refresh = RefreshToken.for_user(self.user)
        url = '/auth/jwt/refresh/'
        data = {'refresh': str(refresh)}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


class SocioAPITestCase(APITestCase):
    """Tests para la API de Socios"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.client = APIClient()
        
        # Crear usuario y autenticarlo
        self.user = UserAccount.objects.create_user(
            email='admin@test.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User',
            is_staff=True
        )
        
        # Obtener token JWT
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {self.access_token}')
        
        # Crear membresía de prueba
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio_mensual=50.00,
            duracion_meses=1,
            descripcion='Membresía básica de prueba'
        )
        
        # Crear socio de prueba
        self.socio = Socio.objects.create(
            nombre='Juan Test',
            telefono='555-1234',
            correo='juan@test.com',
            membresia=self.membresia
        )
    
    def test_get_socios_list(self):
        """Test para obtener lista de socios"""
        url = '/api/v1/socios/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)


class EntrenadorAPITestCase(APITestCase):
    """Tests para la API de Entrenadores"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.client = APIClient()
        
        # Crear usuario y autenticarlo
        self.user = UserAccount.objects.create_user(
            email='admin@test.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User',
            is_staff=True
        )
        
        # Autenticar usuario
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {refresh.access_token}')
        
        # Crear entrenador de prueba
        self.entrenador = Entrenador.objects.create(
            nombre='Carlos Fitness',
            telefono='987654321',
            correo='carlos@gym.com',
            especialidad='CrossFit'
        )
    
    def test_get_entrenadores_list(self):
        """Test para obtener lista de entrenadores"""
        url = '/api/v1/entrenadores/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
    
    def test_create_entrenador(self):
        """Test para crear un nuevo entrenador"""
        url = '/api/v1/entrenadores/'
        data = {
            'nombre': 'Ana García',
            'telefono': '555123456',
            'correo': 'ana@gym.com',
            'especialidad': 'Yoga'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Entrenador.objects.filter(correo='ana@gym.com').exists())
    
    def test_update_entrenador(self):
        """Test para actualizar un entrenador"""
        url = f'/api/v1/entrenadores/{self.entrenador.entrenador_id}/'
        data = {
            'nombre': 'Carlos Fitness Updated',
            'telefono': '987654321',
            'correo': 'carlos@gym.com',
            'especialidad': 'CrossFit Avanzado'
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.entrenador.refresh_from_db()
        self.assertEqual(self.entrenador.especialidad, 'CrossFit Avanzado')


class ClaseAPITestCase(APITestCase):
    """Tests para la API de Clases"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.client = APIClient()
        
        # Crear usuario y autenticarlo
        self.user = UserAccount.objects.create_user(
            email='admin@test.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User',
            is_staff=True
        )
        
        # Autenticar usuario
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {refresh.access_token}')
        
        # Crear entrenador para las clases
        self.entrenador = Entrenador.objects.create(
            nombre='Ana García',
            telefono='555123456',
            correo='ana@gym.com',
            especialidad='Yoga'
        )
        
        # Crear clase de prueba
        self.clase = Clase.objects.create(
            nombre='Yoga Matutino',
            entrenador=self.entrenador,
            horario=timezone.make_aware(datetime(2024, 1, 15, 8, 0, 0)),
            capacidad_max=20
        )
    
    def test_get_clases_list(self):
        """Test para obtener lista de clases"""
        url = '/api/v1/clases/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
    
    def test_create_clase(self):
        """Test para crear una nueva clase"""
        url = '/api/v1/clases/'
        data = {
            'nombre': 'CrossFit Vespertino',
            'entrenador': self.entrenador.entrenador_id,
            'horario': '2024-01-15T18:00:00Z',
            'capacidad_max': 15
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Clase.objects.filter(nombre='CrossFit Vespertino').exists())
    
    def test_update_clase(self):
        """Test para actualizar una clase"""
        url = f'/api/v1/clases/{self.clase.clase_id}/'
        data = {
            'nombre': 'Yoga Matutino Avanzado',
            'entrenador': self.entrenador.entrenador_id,
            'horario': '2024-01-15T08:30:00Z',
            'capacidad_max': 25
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.clase.refresh_from_db()
        self.assertEqual(self.clase.nombre, 'Yoga Matutino Avanzado')
        self.assertEqual(self.clase.capacidad_max, 25)


class EquipoAPITestCase(APITestCase):
    """Tests para la API de Equipos"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.client = APIClient()
        
        # Crear usuario y autenticarlo
        self.user = UserAccount.objects.create_user(
            email='admin@test.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User',
            is_staff=True
        )
        
        # Autenticar usuario
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {refresh.access_token}')
        
        # Crear equipo de prueba
        self.equipo = Equipo.objects.create(
            nombre='Cinta de Correr',
            descripcion='Cinta de correr profesional',
            estado='disponible',
            fecha_adquisicion=date.today(),
            ultima_mantenimiento=date.today()
        )
    
    def test_get_equipos_list(self):
        """Test para obtener lista de equipos"""
        url = '/api/v1/equipos/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
    
    def test_create_equipo(self):
        """Test para crear un nuevo equipo"""
        url = '/api/v1/equipos/'
        data = {
            'nombre': 'Bicicleta Estática',
            'descripcion': 'Bicicleta estática profesional',
            'estado': 'disponible',
            'fecha_adquisicion': date.today(),
            'ultima_mantenimiento': date.today()
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Equipo.objects.filter(nombre='Bicicleta Estática').exists())
    
    def test_update_equipo_estado(self):
        """Test para actualizar el estado de un equipo"""
        url = f'/api/v1/equipos/{self.equipo.equipo_id}/'
        data = {
            'nombre': self.equipo.nombre,
            'descripcion': self.equipo.descripcion,
            'estado': 'mantenimiento',
            'fecha_adquisicion': self.equipo.fecha_adquisicion,
            'ultima_mantenimiento': date.today()
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        self.equipo.refresh_from_db()
        self.assertEqual(self.equipo.estado, 'mantenimiento')


class PagoAPITestCase(APITestCase):
    """Tests para la API de Pagos"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.client = APIClient()
        
        # Crear usuario y autenticarlo
        self.user = UserAccount.objects.create_user(
            email='admin@test.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User',
            is_staff=True
        )
        
        # Autenticar usuario
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {refresh.access_token}')
        
        # Crear membresía y socio para los pagos
        self.membresia = Membresia.objects.create(
            tipo='Premium',
            precio_mensual=Decimal('100.00'),
            duracion_meses=1,
            descripcion='Membresía premium'
        )
        
        self.socio = Socio.objects.create(
            nombre='Juan Test',
            telefono='123456789',
            correo='juan@test.com',
            membresia=self.membresia
        )
        
        # Crear pago de prueba
        self.pago = Pago.objects.create(
            socio=self.socio,
            monto=Decimal('100.00'),
            metodo='efectivo'
        )
    
    def test_get_pagos_list(self):
        """Test para obtener lista de pagos"""
        url = '/api/v1/pagos/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
    
    def test_create_pago(self):
        """Test para crear un nuevo pago"""
        url = '/api/v1/pagos/'
        data = {
            'socio': self.socio.socio_id,
            'monto': '100.00',
            'metodo': 'tarjeta'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Pago.objects.filter(metodo='tarjeta').count(), 1)
    
    def test_get_pagos_by_socio(self):
        """Test para obtener pagos filtrados por socio"""
        url = f'/api/v1/pagos/?socio={self.socio.socio_id}'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for pago in response.data:
            self.assertEqual(pago['socio'], self.socio.socio_id)
    
    def test_pago_validation(self):
        """Test para validación de pagos con monto negativo"""
        url = '/api/v1/pagos/'
        data = {
            'socio': self.socio.socio_id,
            'monto': '-50.00',
            'metodo': 'efectivo'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_socio_detail(self):
        """Test para obtener detalle de un socio"""
        url = f'/api/v1/socios/{self.socio.socio_id}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['nombre'], 'Juan Test')
        self.assertEqual(response.data['correo'], 'juan@test.com')
    
    def test_create_socio(self):
        """Test para crear un nuevo socio"""
        url = '/api/v1/socios/'
        data = {
            'nombre': 'María Nueva',
            'telefono': '555-5678',
            'correo': 'maria@test.com',
            'membresia': self.membresia.membresia_id
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Socio.objects.filter(correo='maria@test.com').exists())
    
    def test_update_socio(self):
        """Test para actualizar un socio"""
        url = f'/api/v1/socios/{self.socio.socio_id}/'
        data = {
            'nombre': 'Juan Actualizado',
            'telefono': '555-9999',
            'correo': 'juan@test.com',
            'membresia': self.membresia.membresia_id
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que se actualizó
        self.socio.refresh_from_db()
        self.assertEqual(self.socio.nombre, 'Juan Actualizado')
        self.assertEqual(self.socio.telefono, '555-9999')
    
    def test_delete_socio(self):
        """Test para eliminar un socio"""
        url = f'/api/v1/socios/{self.socio.socio_id}/'
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Socio.objects.filter(socio_id=self.socio.socio_id).exists())
    
    def test_unauthorized_access(self):
        """Test para acceso no autorizado"""
        # Remover credenciales
        self.client.credentials()
        
        url = '/api/v1/socios/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class MembresiaAPITestCase(APITestCase):
    """Tests para la API de Membresías"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.client = APIClient()
        
        # Crear usuario y autenticarlo
        self.user = UserAccount.objects.create_user(
            email='admin@test.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User',
            is_staff=True
        )
        
        # Obtener token JWT
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {self.access_token}')
        
        # Crear membresía de prueba
        self.membresia = Membresia.objects.create(
            tipo='Premium',
            precio_mensual=100.00,
            duracion_meses=3,
            descripcion='Membresía premium de prueba'
        )
    
    def test_get_membresias_list(self):
        """Test para obtener lista de membresías"""
        url = '/api/v1/membresias/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
    
    def test_create_membresia(self):
        """Test para crear una nueva membresía"""
        url = '/api/v1/membresias/'
        data = {
            'tipo': 'VIP',
            'precio_mensual': 200.00,
            'duracion_meses': 6,
            'descripcion': 'Membresía VIP semestral'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Membresia.objects.filter(tipo='VIP').exists())
    
    def test_update_membresia(self):
        """Test para actualizar una membresía"""
        url = f'/api/v1/membresias/{self.membresia.membresia_id}/'
        data = {
            'tipo': 'Premium Plus',
            'precio_mensual': 150.00,
            'duracion_meses': 3,
            'descripcion': 'Membresía premium plus actualizada'
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que se actualizó
        self.membresia.refresh_from_db()
        self.assertEqual(self.membresia.tipo, 'Premium Plus')
        self.assertEqual(self.membresia.precio_mensual, Decimal('150.00'))


class AsistenciaAPITestCase(APITestCase):
    """Tests para la API de Asistencia"""
    
    def setUp(self):
        """Configuración inicial para los tests"""
        self.client = APIClient()
        
        # Crear usuario y autenticarlo
        self.user = UserAccount.objects.create_user(
            email='admin@test.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        
        # Obtener token JWT
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {self.access_token}')
        
        # Crear membresía y socio de prueba
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio_mensual=50.00,
            duracion_meses=1,
            descripcion='Membresía básica'
        )
        
        self.socio = Socio.objects.create(
            nombre='Pedro Asistente',
            telefono='555-7777',
            correo='pedro@test.com',
            membresia=self.membresia
        )
    
    def test_create_asistencia(self):
        """Test para registrar asistencia"""
        url = '/api/v1/asistencias/'
        data = {
            'socio': self.socio.socio_id,
            'fecha_entrada': '2024-01-15T09:00:00Z'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Asistencia.objects.filter(socio=self.socio).exists())
    
    def test_get_asistencias_list(self):
        """Test para obtener lista de asistencias"""
        # Crear asistencia de prueba
        self.asistencia = Asistencia.objects.create(
            socio=self.socio,
            fecha_entrada=datetime(2024, 1, 15, 10, 0, 0)
        )
        
        url = '/api/v1/asistencias/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)