import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CrearUsuarios } from './pages/CrearUsuarios.jsx';
import { Login } from './pages/Login.jsx';
import { DocentesRegistroSesiones } from './pages/DocenteRegistroSesiones.jsx';
import { Sesiones } from './pages/Sesiones.jsx';
import { GestionSesiones } from './pages/GestionSesiones.jsx';
import { EstudiantesSesionesReserva } from './pages/EstudiantesSesionesReserva.jsx';
import { FormularioReserva } from './pages/FormularioReserva.jsx';
import { Marketing } from './pages/Marketing.jsx';
import { HistorialSesiones } from './pages/HistorialSesiones.jsx';
const PrivateRoute = ({ element: Component }) => {
  const isAuthenticated = localStorage.getItem('usuario');
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/createusers' element={<CrearUsuarios />} />
        <Route path='/login' element={<Login />} />
        <Route path='/docentes_registro_sesiones' element={<PrivateRoute element={DocentesRegistroSesiones}/>} />
        <Route path='/sesiones' element={<PrivateRoute element={Sesiones}/>} />
        <Route path='/gestionsesiones' element={<PrivateRoute element={GestionSesiones}/>} />
        <Route path='/reservasesionesimt' element={<EstudiantesSesionesReserva/>}/>
        <Route path='/formulariosesionesimt' element={<FormularioReserva/>}/>
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/historialsesionesimt" element={<HistorialSesiones />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
