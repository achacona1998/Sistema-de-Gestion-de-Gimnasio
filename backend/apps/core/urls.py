from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register(r'membresias', MembresiaViewSet)
router.register(r'entrenadores', EntrenadorViewSet)
router.register(r'clases', ClaseViewSet)
router.register(r'socios', SocioViewSet)
router.register(r'pagos', PagoViewSet)
router.register(r'asistencias', AsistenciaViewSet)
router.register(r'socio-clases', SocioClaseViewSet)
router.register(r'equipos', EquipoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]