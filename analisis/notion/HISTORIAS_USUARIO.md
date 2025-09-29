---
title: "Historias de Usuario - Sistema de Gestión de Gimnasio"
description: "Historias de usuario para el desarrollo de un sistema de gestión de gimnasio completo"
project_type: "user_stories"
start_date: "2024-12-01"
end_date: "2025-02-28"
---

## Historia de Usuario 1: Registro de Usuario

**Descripción:**
El administrador del gimnasio necesita registrar nuevos usuarios del sistema con diferentes roles para controlar el acceso y permisos según las responsabilidades de cada persona.

**Criterios de Aceptación:**

- El sistema debe validar que el email sea único
- La contraseña debe cumplir con políticas de seguridad
- Se debe asignar un rol específico (admin, staff, entrenador)
- El usuario debe recibir confirmación por email
- Los datos personales deben ser obligatorios (nombre, apellido)

**Etiquetas:** autenticación, usuarios, seguridad  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-15

---

## Historia de Usuario 2: Inicio de Sesión

**Descripción:**
Los usuarios del sistema necesitan autenticarse con su email y contraseña para acceder a las funcionalidades según su rol asignado.

**Criterios de Aceptación:**

- El sistema debe validar credenciales contra la base de datos
- Se debe generar un token JWT válido por tiempo limitado
- El sistema debe redirigir según el rol del usuario
- Debe mostrar mensaje de error para credenciales inválidas
- Se debe registrar la fecha y hora del último acceso

**Etiquetas:** autenticación, login, jwt  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-15

---

## Historia de Usuario 3: Recuperación de Contraseña

**Descripción:**
Los usuarios del sistema necesitan recuperar su contraseña cuando la olviden para poder acceder nuevamente al sistema.

**Criterios de Aceptación:**

- El sistema debe enviar un enlace de recuperación por email
- El enlace debe tener una expiración de 24 horas
- Se debe permitir establecer una nueva contraseña
- La nueva contraseña debe cumplir políticas de seguridad
- Se debe invalidar el enlace después de su uso

**Etiquetas:** autenticación, recuperación, email  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-20

---

## Historia de Usuario 4: Cierre de Sesión Automático

**Descripción:**
El administrador del sistema necesita que las sesiones se cierren automáticamente por inactividad para mantener la seguridad del sistema.

**Criterios de Aceptación:**

- El sistema debe detectar inactividad después de 30 minutos
- Se debe mostrar una advertencia antes del cierre automático
- El token JWT debe invalidarse automáticamente
- Se debe redirigir al login después del cierre
- Se debe registrar el evento en los logs de seguridad

**Etiquetas:** seguridad, sesión, timeout  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-25

---

## Historia de Usuario 5: Registro de Nuevo Socio

**Descripción:**
El personal del gimnasio necesita registrar nuevos socios con toda su información personal para gestionar las membresías y servicios del gimnasio.

**Criterios de Aceptación:**

- Se deben capturar datos personales completos (nombre, apellido, email, teléfono)
- Se debe validar que el email y teléfono sean únicos
- Se debe asignar un número de membresía automáticamente
- Se debe permitir subir una foto del socio
- Se debe registrar la fecha de inscripción

**Etiquetas:** socios, registro, membresía  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-10

---

## Historia de Usuario 6: Búsqueda de Socios

**Descripción:**
El personal del gimnasio necesita buscar socios por nombre, email o número de membresía para acceder rápidamente a su información.

**Criterios de Aceptación:**

- Se debe permitir búsqueda por nombre completo o parcial
- Se debe permitir búsqueda por email exacto
- Se debe permitir búsqueda por número de membresía
- Los resultados deben mostrarse en tiempo real
- Se debe mostrar información básica en los resultados

**Etiquetas:** socios, búsqueda, gestión  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-12

---

## Historia de Usuario 7: Actualización de Información Personal

**Descripción:**
Los socios del gimnasio necesitan actualizar su información personal básica para mantener sus datos actualizados en el sistema.

**Criterios de Aceptación:**

- Se debe permitir editar nombre, apellido, teléfono y dirección
- No se debe permitir cambiar el email sin verificación
- Se debe validar el formato de los datos ingresados
- Se debe registrar la fecha de la última actualización
- Se debe notificar al socio sobre los cambios realizados

**Etiquetas:** socios, perfil, actualización  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-18

---

## Historia de Usuario 8: Visualización de Estado de Membresía

**Descripción:**
Los socios del gimnasio necesitan ver el estado actual de su membresía para conocer su vigencia y servicios incluidos.

**Criterios de Aceptación:**

- Se debe mostrar el tipo de membresía actual
- Se debe mostrar la fecha de vencimiento
- Se debe indicar si la membresía está activa, vencida o suspendida
- Se debe mostrar los servicios incluidos en la membresía
- Se debe mostrar el historial de renovaciones

**Etiquetas:** membresía, estado, consulta  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-14

---

## Historia de Usuario 9: Suspensión Temporal de Membresía

**Descripción:**
El administrador del gimnasio necesita suspender temporalmente membresías para casos especiales como vacaciones o problemas médicos.

**Criterios de Aceptación:**

- Se debe permitir establecer fechas de inicio y fin de suspensión
- Se debe extender automáticamente la fecha de vencimiento
- Se debe registrar el motivo de la suspensión
- Se debe notificar al socio sobre la suspensión
- Se debe permitir reactivar antes del tiempo establecido

**Etiquetas:** membresía, suspensión, gestión  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-22

---

## Historia de Usuario 10: Creación de Tipos de Membresía

**Descripción:**
El administrador del gimnasio necesita crear diferentes tipos de membresías con precios y duraciones para ofrecer opciones variadas a los socios.

**Criterios de Aceptación:**

- Se debe permitir definir nombre y descripción del tipo
- Se debe establecer precio y duración en días
- Se debe definir qué servicios incluye cada tipo
- Se debe permitir activar/desactivar tipos de membresía
- Se debe validar que no existan nombres duplicados

**Etiquetas:** membresía, tipos, configuración  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-08

---

## Historia de Usuario 11: Cálculo Automático de Vencimientos

**Descripción:**
El sistema necesita calcular automáticamente las fechas de vencimiento para mantener actualizado el estado de las membresías.

**Criterios de Aceptación:**

- Se debe calcular la fecha de vencimiento al crear una membresía
- Se debe recalcular al renovar una membresía
- Se debe considerar suspensiones temporales en el cálculo
- Se debe actualizar el estado automáticamente al vencer
- Se debe ejecutar el proceso diariamente

**Etiquetas:** membresía, vencimiento, automatización  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-16

---

## Historia de Usuario 12: Alertas de Vencimiento

**Descripción:**
El personal del gimnasio necesita recibir alertas de membresías próximas a vencer para gestionar renovaciones proactivamente.

**Criterios de Aceptación:**

- Se deben generar alertas 7 días antes del vencimiento
- Se debe mostrar una lista de membresías por vencer
- Se debe permitir filtrar por fecha de vencimiento
- Se debe incluir información de contacto del socio
- Se debe marcar como procesada cada alerta

**Etiquetas:** membresía, alertas, vencimiento  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-17

---

## Historia de Usuario 13: Renovación de Membresías

**Descripción:**
El personal del gimnasio necesita renovar membresías de socios existentes para mantener la continuidad del servicio.

**Criterios de Aceptación:**

- Se debe permitir renovar con el mismo tipo o cambiar
- Se debe calcular automáticamente la nueva fecha de vencimiento
- Se debe registrar el pago de la renovación
- Se debe generar un recibo de renovación
- Se debe notificar al socio sobre la renovación

**Etiquetas:** membresía, renovación, pagos  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-13

---

## Historia de Usuario 14: Upgrade de Membresías

**Descripción:**
Los socios del gimnasio necesitan mejorar su tipo de membresía para acceder a servicios adicionales.

**Criterios de Aceptación:**

- Se debe mostrar las opciones de upgrade disponibles
- Se debe calcular el costo adicional prorrateado
- Se debe actualizar inmediatamente los servicios disponibles
- Se debe registrar el pago del upgrade
- Se debe notificar sobre los nuevos beneficios

**Etiquetas:** membresía, upgrade, servicios  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-20

---

## Historia de Usuario 15: Registro de Entrenadores

**Descripción:**
El administrador del gimnasio necesita registrar entrenadores con sus especialidades para gestionar las clases y servicios de entrenamiento.

**Criterios de Aceptación:**

- Se deben capturar datos personales y profesionales
- Se debe registrar especialidades y certificaciones
- Se debe asignar horarios de disponibilidad
- Se debe permitir subir foto y CV
- Se debe validar que el email sea único

**Etiquetas:** entrenadores, registro, especialidades  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-11

---

## Historia de Usuario 16: Gestión de Horarios de Entrenadores

**Descripción:**
Los entrenadores necesitan gestionar sus horarios de disponibilidad para organizar sus clases y entrenamientos personales.

**Criterios de Aceptación:**

- Se debe permitir definir horarios por día de la semana
- Se debe permitir marcar días no disponibles
- Se debe validar que no haya conflictos de horarios
- Se debe permitir modificar horarios con anticipación
- Se debe notificar cambios a los socios afectados

**Etiquetas:** entrenadores, horarios, disponibilidad  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-15

---

## Historia de Usuario 17: Visualización de Clases Asignadas

**Descripción:**
Los entrenadores necesitan ver todas las clases que tienen asignadas para planificar su trabajo y preparar las sesiones.

**Criterios de Aceptación:**

- Se debe mostrar un calendario con todas las clases asignadas
- Se debe incluir información de horario, tipo de clase y ubicación
- Se debe mostrar la cantidad de socios inscritos
- Se debe permitir ver detalles de cada clase
- Se debe actualizar en tiempo real

**Etiquetas:** entrenadores, clases, calendario  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-16

---

## Historia de Usuario 18: Lista de Socios en Clases

**Descripción:**
Los entrenadores necesitan ver la lista de socios inscritos en sus clases para conocer a los participantes y preparar la sesión.

**Criterios de Aceptación:**

- Se debe mostrar la lista completa de inscritos
- Se debe incluir foto y nombre de cada socio
- Se debe indicar si es la primera vez del socio en la clase
- Se debe permitir marcar asistencia durante la clase
- Se debe mostrar información médica relevante si existe

**Etiquetas:** entrenadores, clases, participantes  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-18

---

## Historia de Usuario 19: Historial de Clases Impartidas

**Descripción:**
Los entrenadores necesitan ver el historial de todas las clases que han impartido para llevar un registro de su trabajo.

**Criterios de Aceptación:**

- Se debe mostrar un historial cronológico de clases
- Se debe incluir fecha, tipo de clase y asistencia
- Se debe permitir filtrar por rango de fechas
- Se debe mostrar estadísticas de asistencia promedio
- Se debe permitir agregar notas sobre cada clase

**Etiquetas:** entrenadores, historial, estadísticas  
**Prioridad:** Baja  
**Fecha Límite:** 2024-02-25

---

## Historia de Usuario 20: Creación de Clases

**Descripción:**
El administrador del gimnasio necesita crear nuevas clases con horarios y entrenadores para ofrecer variedad de servicios a los socios.

**Criterios de Aceptación:**

- Se debe definir nombre, descripción y tipo de clase
- Se debe asignar entrenador, horario y capacidad máxima
- Se debe validar disponibilidad del entrenador
- Se debe permitir establecer requisitos especiales
- Se debe publicar automáticamente para inscripciones

**Etiquetas:** clases, creación, horarios  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-12

---

## Historia de Usuario 21: Inscripción a Clases

**Descripción:**
Los socios del gimnasio necesitan inscribirse a las clases que les interesan para participar en las actividades grupales.

**Criterios de Aceptación:**

- Se debe mostrar todas las clases disponibles
- Se debe validar que el socio tenga membresía activa
- Se debe verificar que haya cupos disponibles
- Se debe confirmar la inscripción inmediatamente
- Se debe enviar recordatorio antes de la clase

**Etiquetas:** clases, inscripción, socios  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-14

---

## Historia de Usuario 22: Cancelación de Inscripción

**Descripción:**
Los socios del gimnasio necesitan cancelar su inscripción a una clase cuando no puedan asistir para liberar el cupo.

**Criterios de Aceptación:**

- Se debe permitir cancelar hasta 2 horas antes de la clase
- Se debe liberar automáticamente el cupo
- Se debe notificar al socio sobre la cancelación
- Se debe permitir ver el historial de cancelaciones
- Se debe aplicar políticas de cancelación si existen

**Etiquetas:** clases, cancelación, cupos  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-19

---

## Historia de Usuario 23: Control de Capacidad de Clases

**Descripción:**
El sistema necesita controlar automáticamente la capacidad de las clases para evitar sobrecupos y mantener la calidad del servicio.

**Criterios de Aceptación:**

- Se debe validar capacidad máxima al inscribir socios
- Se debe mostrar cupos disponibles en tiempo real
- Se debe crear lista de espera cuando esté llena
- Se debe notificar automáticamente cuando se libere un cupo
- Se debe registrar todas las transacciones de cupos

**Etiquetas:** clases, capacidad, automatización  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-15

---

## Historia de Usuario 24: Lista de Asistencia

**Descripción:**
Los entrenadores necesitan generar listas de asistencia para sus clases para llevar control de la participación de los socios.

**Criterios de Aceptación:**

- Se debe generar lista con todos los inscritos
- Se debe permitir marcar presente/ausente durante la clase
- Se debe calcular automáticamente el porcentaje de asistencia
- Se debe guardar el registro para estadísticas
- Se debe permitir agregar socios que lleguen sin inscripción

**Etiquetas:** clases, asistencia, control  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-17

---

## Historia de Usuario 25: Clases Recurrentes

**Descripción:**
El administrador del gimnasio necesita programar clases recurrentes automáticamente para mantener una oferta constante de servicios.

**Criterios de Aceptación:**

- Se debe permitir definir patrones de recurrencia (diario, semanal, mensual)
- Se debe crear automáticamente las instancias de clase
- Se debe validar disponibilidad del entrenador para cada instancia
- Se debe permitir modificar o cancelar instancias específicas
- Se debe notificar cambios a los socios inscritos

**Etiquetas:** clases, recurrencia, automatización  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-21

---

## Historia de Usuario 26: Check-in Rápido de Socios

**Descripción:**
El personal del gimnasio necesita realizar check-in rápido de socios para registrar su entrada al gimnasio de manera eficiente.

**Criterios de Aceptación:**

- Se debe permitir búsqueda rápida por número de membresía o nombre
- Se debe validar automáticamente el estado de la membresía
- Se debe registrar fecha y hora de entrada
- Se debe mostrar información básica del socio
- Se debe completar el proceso en menos de 10 segundos

**Etiquetas:** check-in, acceso, validación  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-10

---

## Historia de Usuario 27: Validación de Estado de Membresía

**Descripción:**
El sistema necesita validar automáticamente el estado de membresía en el check-in para controlar el acceso al gimnasio.

**Criterios de Aceptación:**

- Se debe verificar que la membresía esté activa
- Se debe validar que no esté vencida
- Se debe verificar que no esté suspendida
- Se debe mostrar alertas claras para estados inválidos
- Se debe registrar intentos de acceso denegados

**Etiquetas:** membresía, validación, acceso  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-11

---

## Historia de Usuario 28: Registro de Entrada y Salida

**Descripción:**
El administrador del gimnasio necesita registrar automáticamente las horas de entrada y salida para controlar la ocupación y generar estadísticas.

**Criterios de Aceptación:**

- Se debe registrar automáticamente la hora de entrada en el check-in
- Se debe permitir registrar la salida opcionalmente
- Se debe calcular el tiempo de permanencia
- Se debe generar reportes de ocupación por horarios
- Se debe mantener historial de visitas por socio

**Etiquetas:** acceso, registro, estadísticas  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-18

---

## Historia de Usuario 29: Visualización de Ocupación Actual

**Descripción:**
El personal del gimnasio necesita ver la ocupación actual del gimnasio para gestionar el flujo de personas y mantener la calidad del servicio.

**Criterios de Aceptación:**

- Se debe mostrar el número actual de personas en el gimnasio
- Se debe actualizar automáticamente con cada check-in/out
- Se debe mostrar distribución por áreas del gimnasio
- Se debe incluir gráfico de ocupación del día
- Se debe alertar cuando se acerque a la capacidad máxima

**Etiquetas:** ocupación, tiempo-real, gestión  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-18

---

## Historia de Usuario 30: Reportes de Asistencia

**Descripción:**
El administrador del gimnasio necesita generar reportes de asistencia por períodos para analizar patrones de uso y tomar decisiones operativas.

**Criterios de Aceptación:**

- Se debe permitir generar reportes por día, semana, mes
- Se debe incluir gráficos de asistencia por horarios
- Se debe mostrar estadísticas de socios más activos
- Se debe permitir filtrar por tipo de membresía
- Se debe exportar en formatos PDF y Excel

**Etiquetas:** reportes, asistencia, análisis  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-22

---

## Historia de Usuario 31: Registro de Pagos

**Descripción:**
El personal del gimnasio necesita registrar pagos de membresías con diferentes métodos para mantener actualizada la información financiera.

**Criterios de Aceptación:**

- Se debe permitir registrar pagos en efectivo, tarjeta y transferencia
- Se debe generar automáticamente un número de recibo
- Se debe actualizar el estado de la membresía inmediatamente
- Se debe registrar fecha, monto y método de pago
- Se debe validar que el monto coincida con el tipo de membresía

**Etiquetas:** pagos, membresía, finanzas  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-09

---

## Historia de Usuario 32: Generación de Recibos

**Descripción:**
Los socios del gimnasio necesitan recibir recibos automáticos por sus pagos para tener comprobantes de sus transacciones.

**Criterios de Aceptación:**

- Se debe generar recibo automáticamente al registrar un pago
- Se debe incluir información completa del socio y pago
- Se debe permitir reimprimir recibos anteriores
- Se debe enviar copia por email automáticamente
- Se debe mantener numeración consecutiva de recibos

**Etiquetas:** recibos, pagos, comprobantes  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-12

---

## Historia de Usuario 33: Historial de Pagos

**Descripción:**
Los socios del gimnasio necesitan ver el historial completo de sus pagos para llevar control de sus transacciones.

**Criterios de Aceptación:**

- Se debe mostrar todos los pagos realizados cronológicamente
- Se debe incluir fecha, monto, método y concepto de cada pago
- Se debe permitir filtrar por rango de fechas
- Se debe mostrar el estado actual de la cuenta
- Se debe permitir descargar el historial en PDF

**Etiquetas:** pagos, historial, consulta  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-19

---

## Historia de Usuario 34: Alertas de Pagos Vencidos

**Descripción:**
El administrador del gimnasio necesita recibir alertas de pagos vencidos para gestionar la cobranza y mantener al día las cuentas.

**Criterios de Aceptación:**

- Se deben generar alertas automáticamente al vencer un pago
- Se debe mostrar lista de socios con pagos pendientes
- Se debe incluir días de atraso y monto adeudado
- Se debe permitir enviar recordatorios automáticos
- Se debe registrar todas las gestiones de cobranza

**Etiquetas:** pagos, vencidos, cobranza  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-16

---

## Historia de Usuario 35: Planes de Pago y Cuotas

**Descripción:**
El administrador del gimnasio necesita ofrecer planes de pago en cuotas para facilitar el acceso a membresías de mayor valor.

**Criterios de Aceptación:**

- Se debe permitir dividir el pago en cuotas mensuales
- Se debe calcular automáticamente fechas de vencimiento
- Se debe generar alertas para cada cuota vencida
- Se debe permitir pagos anticipados de cuotas
- Se debe registrar el estado de cada cuota

**Etiquetas:** pagos, cuotas, planes  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-23

---

## Historia de Usuario 36: Descuentos y Promociones

**Descripción:**
El administrador del gimnasio necesita aplicar descuentos y promociones automáticamente para incentivar ventas y fidelizar socios.

**Criterios de Aceptación:**

- Se debe permitir crear descuentos por porcentaje o monto fijo
- Se debe definir fechas de vigencia para promociones
- Se debe aplicar automáticamente al registrar pagos
- Se debe validar condiciones de elegibilidad
- Se debe registrar todas las promociones aplicadas

**Etiquetas:** descuentos, promociones, ventas  
**Prioridad:** Baja  
**Fecha Límite:** 2024-02-26

---

## Historia de Usuario 37: Inventario de Equipos

**Descripción:**
El administrador del gimnasio necesita mantener un inventario completo de equipos para gestionar el mantenimiento y reposiciones.

**Criterios de Aceptación:**

- Se debe registrar cada equipo con código único
- Se debe incluir marca, modelo, fecha de compra y ubicación
- Se debe registrar el estado actual de cada equipo
- Se debe permitir búsqueda y filtrado de equipos
- Se debe mantener historial de cambios de estado

**Etiquetas:** equipos, inventario, gestión  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-20

---

## Historia de Usuario 38: Programación de Mantenimientos

**Descripción:**
El administrador del gimnasio necesita programar mantenimientos preventivos para asegurar el buen funcionamiento de los equipos.

**Criterios de Aceptación:**

- Se debe permitir programar mantenimientos por fecha o uso
- Se debe generar alertas antes de la fecha programada
- Se debe registrar el tipo de mantenimiento requerido
- Se debe asignar responsables del mantenimiento
- Se debe actualizar automáticamente el próximo mantenimiento

**Etiquetas:** equipos, mantenimiento, programación  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-21

---

## Historia de Usuario 39: Reporte de Averías

**Descripción:**
El personal del gimnasio necesita reportar averías de equipos rápidamente para minimizar el tiempo de inactividad.

**Criterios de Aceptación:**

- Se debe permitir reportar averías desde cualquier dispositivo
- Se debe incluir descripción del problema y nivel de urgencia
- Se debe notificar automáticamente al personal de mantenimiento
- Se debe cambiar el estado del equipo a "fuera de servicio"
- Se debe registrar fecha y hora del reporte

**Etiquetas:** equipos, averías, reportes  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-13

---

## Historia de Usuario 40: Estado de Equipos en Tiempo Real

**Descripción:**
Los socios del gimnasio necesitan ver qué equipos están disponibles para planificar mejor su rutina de ejercicios.

**Criterios de Aceptación:**

- Se debe mostrar el estado actual de todos los equipos
- Se debe indicar si están disponibles, en uso o fuera de servicio
- Se debe actualizar en tiempo real
- Se debe permitir filtrar por tipo de equipo
- Se debe mostrar tiempo estimado de disponibilidad

**Etiquetas:** equipos, disponibilidad, tiempo-real  
**Prioridad:** Baja  
**Fecha Límite:** 2024-02-27

---

## Historia de Usuario 41: Alertas de Mantenimiento Vencido

**Descripción:**
El administrador del gimnasio necesita recibir alertas de mantenimientos vencidos para evitar deterioro de equipos y posibles accidentes.

**Criterios de Aceptación:**

- Se deben generar alertas automáticamente al vencer un mantenimiento
- Se debe mostrar lista de equipos con mantenimiento pendiente
- Se debe incluir días de atraso y tipo de mantenimiento
- Se debe escalar alertas según la criticidad del equipo
- Se debe registrar todas las acciones tomadas

**Etiquetas:** mantenimiento, alertas, equipos  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-17

---

## Historia de Usuario 42: Notificaciones de Vencimiento de Membresía

**Descripción:**
Los socios del gimnasio necesitan recibir notificaciones antes de que venza su membresía para renovarla a tiempo.

**Criterios de Aceptación:**

- Se deben enviar notificaciones 7 y 3 días antes del vencimiento
- Se debe incluir información sobre opciones de renovación
- Se debe permitir renovar directamente desde la notificación
- Se debe enviar por email y mostrar en la app
- Se debe registrar si la notificación fue vista

**Etiquetas:** notificaciones, membresía, vencimiento  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-14

---

## Historia de Usuario 43: Recordatorios de Clases

**Descripción:**
Los socios del gimnasio necesitan recibir recordatorios de las clases en las que se inscribieron para no olvidar asistir.

**Criterios de Aceptación:**

- Se deben enviar recordatorios 2 horas antes de la clase
- Se debe incluir información de horario, ubicación y entrenador
- Se debe permitir cancelar desde el recordatorio
- Se debe enviar por email y notificación push
- Se debe registrar si el recordatorio fue efectivo

**Etiquetas:** notificaciones, clases, recordatorios  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-18

---

## Historia de Usuario 44: Notificaciones de Cambios en Clases

**Descripción:**
Los socios del gimnasio necesitan ser notificados sobre cambios en sus clases para ajustar su agenda.

**Criterios de Aceptación:**

- Se debe notificar inmediatamente cualquier cambio de horario
- Se debe incluir información del cambio y nuevos detalles
- Se debe permitir confirmar asistencia con el nuevo horario
- Se debe ofrecer opciones alternativas si no puede asistir
- Se debe registrar la respuesta del socio

**Etiquetas:** notificaciones, clases, cambios  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-15

---

## Historia de Usuario 45: Gestión de Estado de Notificaciones

**Descripción:**
Los usuarios del sistema necesitan marcar notificaciones como leídas/no leídas para organizar su información.

**Criterios de Aceptación:**

- Se debe permitir marcar notificaciones individuales como leídas
- Se debe permitir marcar todas como leídas
- Se debe mostrar contador de notificaciones no leídas
- Se debe permitir filtrar por estado de lectura
- Se debe mantener historial de notificaciones por 30 días

**Etiquetas:** notificaciones, gestión, estado  
**Prioridad:** Baja  
**Fecha Límite:** 2024-02-24

---

## Historia de Usuario 46: Configuración de Preferencias de Notificación

**Descripción:**
Los usuarios del sistema necesitan configurar sus preferencias de notificación para recibir solo la información que les interesa.

**Criterios de Aceptación:**

- Se debe permitir activar/desactivar tipos de notificaciones
- Se debe permitir elegir canales de notificación (email, push, SMS)
- Se debe permitir configurar horarios de no molestar
- Se debe permitir configurar frecuencia de recordatorios
- Se debe aplicar las preferencias inmediatamente

**Etiquetas:** notificaciones, preferencias, configuración  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-21

---

## Historia de Usuario 47: Reportes de Ingresos

**Descripción:**
El administrador del gimnasio necesita generar reportes de ingresos por períodos para analizar el desempeño financiero.

**Criterios de Aceptación:**

- Se debe permitir generar reportes por día, semana, mes, año
- Se debe incluir desglose por tipo de membresía y servicios
- Se debe mostrar comparaciones con períodos anteriores
- Se debe incluir gráficos de tendencias
- Se debe exportar en formatos PDF y Excel

**Etiquetas:** reportes, ingresos, finanzas  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-16

---

## Historia de Usuario 48: Estadísticas de Asistencia

**Descripción:**
El administrador del gimnasio necesita ver estadísticas de asistencia y ocupación para optimizar horarios y recursos.

**Criterios de Aceptación:**

- Se debe mostrar asistencia promedio por día y horario
- Se debe incluir picos de ocupación y horarios valle
- Se debe mostrar tendencias de asistencia por mes
- Se debe permitir filtrar por tipo de socio
- Se debe incluir proyecciones basadas en tendencias

**Etiquetas:** estadísticas, asistencia, ocupación  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-19

---

## Historia de Usuario 49: Reportes de Popularidad de Clases

**Descripción:**
El administrador del gimnasio necesita ver qué clases son más populares para optimizar la oferta de servicios.

**Criterios de Aceptación:**

- Se debe mostrar ranking de clases por asistencia
- Se debe incluir porcentaje de ocupación por clase
- Se debe mostrar tendencias de popularidad en el tiempo
- Se debe permitir filtrar por entrenador y horario
- Se debe incluir sugerencias de optimización

**Etiquetas:** reportes, clases, popularidad  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-22

---

## Historia de Usuario 50: Gráficos de Crecimiento de Socios

**Descripción:**
El administrador del gimnasio necesita ver gráficos de crecimiento de la base de socios para evaluar estrategias de marketing.

**Criterios de Aceptación:**

- Se debe mostrar crecimiento mensual de nuevos socios
- Se debe incluir tasa de retención y cancelaciones
- Se debe mostrar distribución por tipo de membresía
- Se debe incluir proyecciones de crecimiento
- Se debe permitir comparar con objetivos establecidos

**Etiquetas:** gráficos, crecimiento, socios  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-23

---

## Historia de Usuario 51: Exportación de Reportes

**Descripción:**
El administrador del gimnasio necesita exportar reportes en diferentes formatos para compartir con stakeholders y análisis externos.

**Criterios de Aceptación:**

- Se debe permitir exportar en PDF, Excel y CSV
- Se debe mantener el formato y gráficos en PDF
- Se debe incluir datos raw en Excel para análisis
- Se debe permitir programar exportaciones automáticas
- Se debe enviar por email los reportes programados

**Etiquetas:** reportes, exportación, formatos  
**Prioridad:** Baja  
**Fecha Límite:** 2024-02-25

---

## Historia de Usuario 52: Dashboard con Métricas Clave

**Descripción:**
El administrador del gimnasio necesita ver un dashboard con las métricas más importantes para tomar decisiones rápidas.

**Criterios de Aceptación:**

- Se debe mostrar ocupación actual y socios activos
- Se debe incluir ingresos del día/mes y comparaciones
- Se debe mostrar alertas importantes pendientes
- Se debe actualizar en tiempo real
- Se debe permitir personalizar las métricas mostradas

**Etiquetas:** dashboard, métricas, tiempo-real  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-12

---

## Historia de Usuario 53: Ocupación en Tiempo Real

**Descripción:**
El personal del gimnasio necesita ver la ocupación actual en tiempo real para gestionar el flujo de personas.

**Criterios de Aceptación:**

- Se debe mostrar número actual de personas en el gimnasio
- Se debe actualizar automáticamente con cada check-in/out
- Se debe mostrar distribución por áreas del gimnasio
- Se debe incluir gráfico de ocupación del día
- Se debe alertar cuando se acerque a la capacidad máxima

**Etiquetas:** ocupación, tiempo-real, gestión  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-18

---

## Historia de Usuario 54: Gráficos de Ingresos y Tendencias

**Descripción:**
El administrador del gimnasio necesita ver gráficos visuales de ingresos y tendencias para análisis financiero.

**Criterios de Aceptación:**

- Se deben mostrar gráficos de líneas para tendencias mensuales
- Se debe incluir gráficos de barras para comparaciones
- Se debe permitir filtrar por tipo de ingreso
- Se debe mostrar proyecciones basadas en tendencias
- Se debe permitir drill-down para ver detalles

**Etiquetas:** gráficos, ingresos, tendencias  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-20

---

## Historia de Usuario 55: Alertas y Notificaciones Importantes

**Descripción:**
El administrador del gimnasio necesita ver alertas importantes en el dashboard para atender situaciones críticas.

**Criterios de Aceptación:**

- Se deben mostrar alertas de equipos fuera de servicio
- Se debe incluir alertas de pagos vencidos importantes
- Se debe mostrar alertas de capacidad del gimnasio
- Se debe permitir marcar alertas como atendidas
- Se debe priorizar alertas por nivel de importancia

**Etiquetas:** alertas, dashboard, críticas  
**Prioridad:** Alta  
**Fecha Límite:** 2024-02-14

---

## Historia de Usuario 56: Visualización Responsiva

**Descripción:**
Los usuarios del sistema necesitan que las visualizaciones se adapten a su dispositivo para acceder desde cualquier lugar.

**Criterios de Aceptación:**

- Se debe adaptar automáticamente a pantallas móviles y tablets
- Se debe mantener funcionalidad completa en todos los dispositivos
- Se debe optimizar la velocidad de carga en móviles
- Se debe usar gestos táctiles apropiados
- Se debe mantener la usabilidad en pantallas pequeñas

**Etiquetas:** responsivo, móvil, usabilidad  
**Prioridad:** Media  
**Fecha Límite:** 2024-02-24
