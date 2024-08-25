from django.db import models

# Create your models here.
class Materia(models.Model):
    departamento = models.CharField(max_length=200)
    materia = models.CharField(max_length=200)

class Docente(models.Model):
    nombre = models.CharField(max_length=200)
    celular = models.CharField(max_length=200)
    correo = models.CharField(max_length=200)
    tipodocente = models.CharField(max_length=200)
    password = models.CharField(max_length=200, default='password')
    def __str__(self):
        return self.nombre+"-"+self.tipodocente
    
class Sesiones(models.Model):
    nombre = models.CharField(max_length=200, default='none')
    departamento = models.CharField(max_length=200)
    materia = models.CharField(max_length=200)
    dia = models.CharField(max_length=200)
    fecha = models.DateField()
    horaInicio = models.TimeField(max_length=200)
    horaFin = models.TimeField(max_length=200)
    modalidad = models.CharField(max_length=200)
    plataforma = models.CharField(max_length=200, default='none')
    link = models.CharField(max_length=200, default='none')
    ambiente = models.CharField(max_length=200, default='none')
    detalle = models.CharField(max_length=200, default='none')
    def __str__(self):
        return self.departamento+'-'+self.materia
    
class ProgramarSesiones(models.Model):
    docente = models.CharField(max_length=200, default='none')
    tipodocente = models.CharField(max_length=200, default='none')
    departamento = models.CharField(max_length=200, default='none')
    materia = models.CharField(max_length=200, default='none')
    dia = models.CharField(max_length=200, default='none')
    fecha = models.DateField()
    horaInicio = models.TimeField(max_length=200)
    horaFin = models.TimeField(max_length=200)
    modalidad = models.CharField(max_length=200, default='none')
    plataforma = models.CharField(max_length=200, default='none') 
    link = models.CharField(max_length=200, default='none')
    ambiente = models.CharField(max_length=200, default='none')
    detalleambiente = models.CharField(max_length=500, default='none')
    estado = models.CharField(max_length=200)
    #Estudiante
    nombreestudiante = models.CharField(max_length=200, default='none')
    carreraestudiante = models.CharField(max_length=200, default='none') 
    semestreestudiante = models.CharField(max_length=200, default='none')
    correoestudiante = models.CharField(max_length=200, default='none')
    atencion = models.CharField(max_length=200, default='none') 
    cantidad = models.CharField(max_length=200, default='none')
    temaconsulta = models.CharField(max_length=200, default='none')
    detalletemaconsulta = models.CharField(max_length=400, default='none')
    #Confirmación
    confirmacion = models.CharField(max_length=200, default='none')
    def __str__(self):
        return self.docente+'-'+self.departamento+'-'+self.materia+'-'+self.nombreestudiante

class Historial(models.Model):
    docente = models.CharField(max_length=200, default='none')
    tipodocente = models.CharField(max_length=200, default='none')
    departamento = models.CharField(max_length=200, default='none')
    materia = models.CharField(max_length=200, default='none')
    dia = models.CharField(max_length=200, default='none')
    fecha = models.DateField()
    horaInicio = models.TimeField(max_length=200)
    horaFin = models.TimeField(max_length=200)
    modalidad = models.CharField(max_length=200, default='none')
    plataforma = models.CharField(max_length=200, default='none') 
    link = models.CharField(max_length=200, default='none')
    ambiente = models.CharField(max_length=200, default='none')
    detalleambiente = models.CharField(max_length=500, default='none')
    estado = models.CharField(max_length=200)
    #Estudiante
    nombreestudiante = models.CharField(max_length=200, default='none')
    carreraestudiante = models.CharField(max_length=200, default='none') 
    semestreestudiante = models.CharField(max_length=200, default='none')
    correoestudiante = models.CharField(max_length=200, default='none')
    atencion = models.CharField(max_length=200, default='none') 
    cantidad = models.CharField(max_length=200, default='none')
    temaconsulta = models.CharField(max_length=200, default='none')
    detalletemaconsulta = models.CharField(max_length=400, default='none')
    #Programación docente (Confirmación)
    confirmacion = models.CharField(max_length=200, default='none')
    comentariosdocentesesion = models.CharField(max_length=500, default='none')
    def __str__(self):
        return self.docente+'-'+self.departamento+'-'+self.materia+'-'+self.nombreestudiante
    
class Marketing(models.Model):
    docente = models.CharField(max_length=200, default='none')
    tipodocente = models.CharField(max_length=200, default='none')
    departamento = models.CharField(max_length=200, default='none')
    materia = models.CharField(max_length=200, default='none')
    dia = models.CharField(max_length=200, default='none')
    horaInicio = models.TimeField(max_length=200)
    horaFin = models.TimeField(max_length=200)
    def __str__(self):
        return self.docente+'-'+self.materia