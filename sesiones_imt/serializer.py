from rest_framework import serializers
from .models import Docente, Sesiones, ProgramarSesiones, Historial, Marketing, Materia
class DocenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Docente
        fields = '__all__'

class SesionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sesiones
        fields = '__all__'

class ProgramarSesionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgramarSesiones
        fields = '__all__'

class HistorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historial
        fields = '__all__'
        
class MarketingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marketing
        fields = '__all__'

class MateriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Materia
        fields = '__all__'