import os
import sys
import django
from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import json
from decimal import Decimal
from datetime import date

# Agregar el directorio del backend al path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gimnasio.settings')
django.setup()

from apps.core.models import Socio, Membresia, Entrenador, Asistencia, Pago
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
            last_name='User'
        )
        
        # Obtener token JWT
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {self.access_token}')
        
        # Crear membresía de prueba
        self.membresia = Membresia.objects.create(
            tipo='Básica',
            precio=50.00,
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
    
    def test_get_socio_detail(self):
        """Test para obtener detalle de un socio"""
        url = f'/api/v1/socios/{self.socio.id}/'
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
            'membresia': self.membresia.id
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Socio.objects.filter(correo='maria@test.com').exists())
    
    def test_update_socio(self):
        """Test para actualizar un socio"""
        url = f'/api/v1/socios/{self.socio.id}/'
        data = {
            'nombre': 'Juan Actualizado',
            'telefono': '555-9999',
            'correo': 'juan@test.com',
            'membresia': self.membresia.id
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que se actualizó
        self.socio.refresh_from_db()
        self.assertEqual(self.socio.nombre, 'Juan Actualizado')
        self.assertEqual(self.socio.telefono, '555-9999')
    
    def test_delete_socio(self):
        """Test para eliminar un socio"""
        url = f'/api/v1/socios/{self.socio.id}/'
        response = self.client.delete(url)
        
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Socio.objects.filter(id=self.socio.id).exists())
    
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
            last_name='User'
        )
        
        # Obtener token JWT
        refresh = RefreshToken.for_user(self.user)
        self.access_token = str(refresh.access_token)
        self.client.credentials(HTTP_AUTHORIZATION=f'JWT {self.access_token}')
        
        # Crear membresía de prueba
        self.membresia = Membresia.objects.create(
            tipo='Premium',
            precio=100.00,
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
            'precio': 200.00,
            'duracion_meses': 6,
            'descripcion': 'Membresía VIP semestral'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Membresia.objects.filter(tipo='VIP').exists())
    
    def test_update_membresia(self):
        """Test para actualizar una membresía"""
        url = f'/api/v1/membresias/{self.membresia.id}/'
        data = {
            'tipo': 'Premium Plus',
            'precio': 150.00,
            'duracion_meses': 3,
            'descripcion': 'Membresía premium plus actualizada'
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verificar que se actualizó
        self.membresia.refresh_from_db()
        self.assertEqual(self.membresia.tipo, 'Premium Plus')
        self.assertEqual(self.membresia.precio, Decimal('150.00'))


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
            precio=50.00,
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
            'socio': self.socio.id,
            'fecha': date.today().isoformat(),
            'hora_entrada': '09:00:00'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Asistencia.objects.filter(socio=self.socio).exists())
    
    def test_get_asistencias_list(self):
        """Test para obtener lista de asistencias"""
        # Crear asistencia de prueba
        Asistencia.objects.create(
            socio=self.socio,
            fecha=date.today(),
            hora_entrada='10:00:00'
        )
        
        url = '/api/v1/asistencias/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)