from django.db import models

class Membresia(models.Model):
    membresia_id = models.AutoField(primary_key=True)
    tipo = models.CharField(max_length=50)
    descripcion = models.TextField()
    precio_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    duracion_meses = models.IntegerField()

    def __str__(self):
        return self.tipo

class Entrenador(models.Model):
    entrenador_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    especialidad = models.CharField(max_length=50)
    telefono = models.CharField(max_length=15)
    correo = models.EmailField()

    def __str__(self):
        return self.nombre

class Clase(models.Model):
    clase_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    entrenador = models.ForeignKey(Entrenador, on_delete=models.CASCADE)
    horario = models.DateTimeField()
    capacidad_max = models.IntegerField()

    def __str__(self):
        return self.nombre

class Socio(models.Model):
    socio_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    telefono = models.CharField(max_length=15)
    correo = models.EmailField()
    membresia = models.ForeignKey(Membresia, on_delete=models.PROTECT)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre

class Pago(models.Model):
    METODOS_PAGO = [
        ('efectivo', 'Efectivo'),
        ('tarjeta', 'Tarjeta'),
        ('transferencia', 'Transferencia')
    ]

    pago_id = models.AutoField(primary_key=True)
    socio = models.ForeignKey(Socio, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_pago = models.DateTimeField(auto_now_add=True)
    metodo = models.CharField(max_length=20, choices=METODOS_PAGO)

    def __str__(self):
        return f'Pago {self.pago_id} - {self.socio.nombre}'

class Asistencia(models.Model):
    asistencia_id = models.AutoField(primary_key=True)
    socio = models.ForeignKey(Socio, on_delete=models.CASCADE)
    fecha_entrada = models.DateTimeField(auto_now_add=True)
    fecha_salida = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f'Asistencia {self.asistencia_id} - {self.socio.nombre}'

class SocioClase(models.Model):
    socio = models.ForeignKey(Socio, on_delete=models.CASCADE)
    clase = models.ForeignKey(Clase, on_delete=models.CASCADE)
    fecha_inscripcion = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('socio', 'clase')

    def __str__(self):
        return f'{self.socio.nombre} - {self.clase.nombre}'

class Equipo(models.Model):
    ESTADO_CHOICES = [
        ('disponible', 'Disponible'),
        ('mantenimiento', 'En Mantenimiento'),
        ('reparacion', 'En Reparación'),
        ('baja', 'Dado de Baja')
    ]

    equipo_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha_adquisicion = models.DateField()
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES)
    ultima_mantenimiento = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.nombre
