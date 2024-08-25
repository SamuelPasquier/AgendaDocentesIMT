from rest_framework import viewsets
from .serializer import DocenteSerializer, SesionSerializer, ProgramarSesionesSerializer, HistorialSerializer, MarketingSerializer, MateriaSerializer
from .models import Docente, Sesiones, ProgramarSesiones, Historial, Marketing, Materia
# Create your views here.
class DocenteView(viewsets.ModelViewSet):
    serializer_class = DocenteSerializer
    queryset = Docente.objects.all()
    
class SesionesView(viewsets.ModelViewSet):
    serializer_class = SesionSerializer
    queryset = Sesiones.objects.all()

class ProgramarSesionesView(viewsets.ModelViewSet):
    serializer_class = ProgramarSesionesSerializer
    queryset = ProgramarSesiones.objects.all()

class HistorialView(viewsets.ModelViewSet):
    serializer_class = HistorialSerializer
    queryset = Historial.objects.all()
    
class MarketingView(viewsets.ModelViewSet):
    serializer_class = MarketingSerializer
    queryset = Marketing.objects.all()

class MateriaView(viewsets.ModelViewSet):
    serializer_class = MateriaSerializer
    queryset = Materia.objects.all()