import axios from 'axios';

const docenteApi = axios.create({
    baseURL: 'http://localhost:8000/users/',
});
//Obtenemos los datos de los docentes de la base de datos de sus usuarios
export const getUsersDocentes = () => docenteApi.get("/docente/");

//Se mandan los datos de usuarios nuevos a la base de datos
export const crearUsersDocentes = (dataUserDocente) => docenteApi.post("/docente/", dataUserDocente);

export const getSesiones = () => docenteApi.get("/sesion/");

export const crearSesiones = (dataSesiones) => docenteApi.post("/sesion/", dataSesiones);

export const deleteSesiones = (id) => docenteApi.delete(`/sesion/${id}`);

export const getProgramarSesiones = () => docenteApi.get("/programarsesiones/");

export const crearProgramarSesiones = (dataProgramarSesiones) => docenteApi.post("/programarsesiones/", dataProgramarSesiones);

export const editarProgramarSesiones = (id, datosActualizados) => docenteApi.patch(`/programarsesiones/${id}/`, datosActualizados);

export const deleteProgramarSesiones = (id) => docenteApi.delete(`/programarsesiones/${id}`);

export const getHistorial = () => docenteApi.get("/historial/");

export const crearHistorial = (dataHistorial) => docenteApi.post("/historial/", dataHistorial);

export const getMateria = () => docenteApi.get("/materia/");

export const getMarketing = () => docenteApi.get("/marketing/");

export const crearMarketing = (dataMarketing) => docenteApi.post("/marketing/", dataMarketing);