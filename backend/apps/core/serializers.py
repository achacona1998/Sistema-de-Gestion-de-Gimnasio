from rest_framework import serializers
from .models import *

class MembresiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membresia
        fields = '__all__'

class EntrenadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrenador
        fields = '__all__'

class ClaseSerializer(serializers.ModelSerializer):
    entrenador_nombre = serializers.CharField(source='entrenador.nombre', read_only=True)

    class Meta:
        model = Clase
        fields = ['clase_id', 'nombre', 'entrenador', 'entrenador_nombre', 'horario', 'capacidad_max']

class SocioSerializer(serializers.ModelSerializer):
    membresia_tipo = serializers.CharField(source='membresia.tipo', read_only=True)

    class Meta:
        model = Socio
        fields = ['socio_id', 'nombre', 'telefono', 'correo', 'membresia', 'membresia_tipo', 'fecha_registro']

class PagoSerializer(serializers.ModelSerializer):
    socio_nombre = serializers.CharField(source='socio.nombre', read_only=True)

    class Meta:
        model = Pago
        fields = ['pago_id', 'socio', 'socio_nombre', 'monto', 'fecha_pago', 'metodo']

class AsistenciaSerializer(serializers.ModelSerializer):
    socio_nombre = serializers.CharField(source='socio.nombre', read_only=True)

    class Meta:
        model = Asistencia
        fields = ['asistencia_id', 'socio', 'socio_nombre', 'fecha_entrada', 'fecha_salida']

class SocioClaseSerializer(serializers.ModelSerializer):
    socio_nombre = serializers.CharField(source='socio.nombre', read_only=True)
    clase_nombre = serializers.CharField(source='clase.nombre', read_only=True)

    class Meta:
        model = SocioClase
        fields = ['socio', 'socio_nombre', 'clase', 'clase_nombre', 'fecha_inscripcion']

class EquipoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipo
        fields = ['equipo_id', 'nombre', 'descripcion', 'fecha_adquisicion', 'estado', 'ultima_mantenimiento']