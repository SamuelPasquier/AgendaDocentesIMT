from django.urls import path, include
from rest_framework import routers
from .views import DocenteView, SesionesView, ProgramarSesionesView, HistorialView, MarketingView, MateriaView
router = routers.DefaultRouter()
router.register(r'docente', DocenteView)
router.register(r'sesion', SesionesView)
router.register(r'programarsesiones', ProgramarSesionesView)
router.register(r'historial', HistorialView)
router.register(r'marketing', MarketingView)
router.register(r'materia', MateriaView)
urlpatterns = [
    path('', include(router.urls))
]
