from django.contrib import admin
from .models import Docente, Sesiones, ProgramarSesiones, Marketing
# Register your models here.
admin.site.register(Docente)
admin.site.register(Sesiones)
admin.site.register(ProgramarSesiones)
admin.site.register(Marketing)