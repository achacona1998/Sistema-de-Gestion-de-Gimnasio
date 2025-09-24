from django.contrib import admin
from .models import Membresia, Entrenador, Clase, Socio, Pago, Asistencia, SocioClase, Equipo

@admin.register(Membresia)
class MembresiaAdmin(admin.ModelAdmin):
    list_display = ('tipo', 'precio_mensual', 'duracion_meses')
    search_fields = ('tipo',)

@admin.register(Entrenador)
class EntrenadorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'especialidad', 'telefono', 'correo')
    search_fields = ('nombre', 'especialidad')

@admin.register(Clase)
class ClaseAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'entrenador', 'horario', 'capacidad_max')
    list_filter = ('entrenador',)
    search_fields = ('nombre', 'entrenador__nombre')

@admin.register(Socio)
class SocioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'telefono', 'correo', 'membresia', 'fecha_registro')
    list_filter = ('membresia',)
    search_fields = ('nombre', 'correo')

@admin.register(Pago)
class PagoAdmin(admin.ModelAdmin):
    list_display = ('socio', 'monto', 'fecha_pago', 'metodo')
    list_filter = ('metodo', 'fecha_pago')
    search_fields = ('socio__nombre',)

@admin.register(Asistencia)
class AsistenciaAdmin(admin.ModelAdmin):
    list_display = ('socio', 'fecha_entrada', 'fecha_salida')
    list_filter = ('fecha_entrada',)
    search_fields = ('socio__nombre',)

@admin.register(SocioClase)
class SocioClaseAdmin(admin.ModelAdmin):
    list_display = ('socio', 'clase', 'fecha_inscripcion')
    list_filter = ('clase',)
    search_fields = ('socio__nombre', 'clase__nombre')

@admin.register(Equipo)
class EquipoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'estado', 'fecha_adquisicion', 'ultima_mantenimiento')
    list_filter = ('estado',)
    search_fields = ('nombre',)
