import React, { useState, useEffect } from 'react';
import { Nav, Navbar, Dropdown, Table, Button, Form, Container, Row, Col } from 'react-bootstrap';
import { HeaderPage } from '../components/HeaderPage.jsx';
import { useNavigate } from 'react-router-dom';
import { getSesiones, getUsersDocentes, deleteSesiones, crearProgramarSesiones, crearMarketing } from '../api/tasks.api.js';
import emailjs from '@emailjs/browser';

export const GestionSesiones = () => {
  const navigate = useNavigate();

  const [nombreDocente, setNombreDocente] = useState('');
  const [sesiones, setSesiones] = useState([]); // Estado para almacenar las sesiones
  const [mostrarComentarios, setMostrarComentarios] = useState(null); // Estado para mostrar la sección de comentarios
  const [comentarios, setComentarios] = useState(''); // Estado para almacenar los comentarios

  useEffect(() => {
    const usuarioLogueado = localStorage.getItem('usuario');
    if (!usuarioLogueado) {
      navigate('/login');
    } else {
      const usuariologin = JSON.parse(usuarioLogueado)
      setNombreDocente(usuariologin.nombre);

      const fetchSesiones = async () => {
        try {
          const res = await getSesiones();
          const sesionesResumidas = resumirSesiones(res.data);
          setSesiones(sesionesResumidas);
          //console.log('res:',res.data);
        } catch (error) {
          console.error('Error al obtener sesiones:', error);
        }
      };
      fetchSesiones();
    }
  }, [navigate]);

  const resumirSesiones = (sesiones) => {
    const sesionesAgrupadas = {};

    sesiones.forEach(sesion => {
      const key = `${sesion.nombre}-${sesion.departamento}-${sesion.materia}-${sesion.dia}-${sesion.horaInicio}-${sesion.horaFin}-${sesion.modalidad}-${sesion.plataforma}-${sesion.link}-${sesion.ambiente}-${sesion.detalle}`;
      if (!sesionesAgrupadas[key]) {
        sesionesAgrupadas[key] = { ...sesion, ids: [sesion.id] };
      } else {
        sesionesAgrupadas[key].ids.push(sesion.id);
      }
    });

    return Object.values(sesionesAgrupadas);
  };

  const handleRegistro = () => {
    navigate('/docentes_registro_sesiones');
  };

  const handleSesiones = () => {
    navigate('/sesiones');
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  // Generar contenido de la columna Descripción
  const generarDescripcion = (sesion) => {
    const { modalidad, plataforma, ambiente, detalle } = sesion;
    let descripcion = '';

    if (modalidad === 'Virtual') {
      if (plataforma === 'Otro') {
        descripcion = `La sesión es <b>virtual</b> cuyo medio es definido por el docente, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
      } else {
        descripcion = `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
      }
    } else if (modalidad === 'Presencial') {
      if (ambiente === 'Otro') {
        descripcion = `La sesión es <b>presencial</b> cuyo ambiente es definido por el docente con la siguiente descripción previa: <b>${detalle}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
      } else {
        descripcion = detalle === 'none'
          ? `La sesión es <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`
          : `La sesión es <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b> - <b>${detalle}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
      }
    } else if (modalidad === 'Ambos') {
      if (plataforma === 'Otro' && ambiente === 'Otro') {
        descripcion = `La sesión es <b>virtual</b> cuyo medio es definido por el docente y <b>presencial</b> cuyo ambiente es definido por el docente con la siguiente descripción previa: <b>${detalle}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
      } else if (plataforma === 'Otro') {
        descripcion = `La sesión es <b>virtual</b> cuyo medio es definido por el docente y <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
      } else if (ambiente === 'Otro') {
        descripcion = `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b> y <b>presencial</b> cuyo ambiente es definido por el docente con la siguiente descripción previa: <b>${detalle}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
      } else {
        descripcion = detalle === 'none'
          ? `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b> y <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`
          : `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b> y <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b> - <b>${detalle}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
      }
    }

    return descripcion;
  };

  // Función para formatear la hora y quitar los segundos
  const formatearHora = (hora) => {
    return hora.slice(0, 5); // Quita los segundos de la hora
  };

  const handleRechazar = (num) => {
    setMostrarComentarios(num); // Muestra la sección de comentarios para la sesión rechazada
  };


  const handleAceptarSesion = async (sesion) => {
    console.log(sesion);
    const { nombre, departamento, materia, dia, fecha, horaInicio, horaFin, modalidad, plataforma, link, ambiente, detalle, ids } = sesion;

    // Obtener información del docente
    const usuariosDocentes = await getUsersDocentes();
    const docenteInfo = usuariosDocentes.data.find(docente => docente.nombre === nombre);

    const dataMarketing = {
      docente: nombre,
      tipodocente: docenteInfo.tipodocente,
      departamento,
      materia,
      dia: dia,
      horaInicio: horaInicio,
      horaFin: horaFin
    };

    await crearMarketing(dataMarketing);

    if (docenteInfo) {
      for (const id of ids) {
        const sesionesDb = await getSesiones(); // Obtener las sesiones desde la base de datos
        const sesionDb = sesionesDb.data.find(s => s.id === id);
        if (sesionDb) {
          const dataProgramarSesiones = {
            docente: nombre,
            tipodocente: docenteInfo.tipodocente,
            departamento,
            materia,
            dia: sesionDb.dia,
            fecha: sesionDb.fecha,
            horaInicio,
            horaFin,
            modalidad,
            plataforma,
            link,
            ambiente,
            detalleambiente: detalle,
            estado: 'Aceptado',
            nombreestudiante: 'none',
            carreraestudiante: 'none',
            semestreestudiante: 'none',
            atencion: 'none',
            temaconsulta: 'none',
            detalletemaconsulta: 'none',
          };

          console.log(dataProgramarSesiones);

          // Crear registro en la base de datos de Sesiones
          await crearProgramarSesiones(dataProgramarSesiones);

          // Eliminar sesión de la base de datos
          await deleteSesiones(id);
        }
      }


      // Recargar la página
      setTimeout(() => {
        window.location.reload();
      }, 400);
    }
  };

  const handleEnviarComentarios = async (sesion) => {
    const { nombre, departamento, materia, dia, fecha, horaInicio, horaFin, modalidad, plataforma, link, ambiente, detalle, ids } = sesion;

    // Obtener información del docente
    const usuariosDocentes = await getUsersDocentes();
    const docenteInfo = usuariosDocentes.data.find(docente => docente.nombre === nombre);

    if (docenteInfo) {
      for (const id of ids) {
        const sesionesDb = await getSesiones(); // Obtener las sesiones desde la base de datos
        const sesionDb = sesionesDb.data.find(s => s.id === id);
        if (sesionDb) {
          const dataProgramarSesiones = {
            docente: nombre,
            tipodocente: docenteInfo.tipodocente,
            departamento,
            materia,
            dia: sesionDb.dia,  // Tomar el día de la sesión coincidente
            fecha: sesionDb.fecha,
            horaInicio,
            horaFin,
            modalidad,
            plataforma,
            link,
            ambiente,
            detalleambiente: detalle,
            estado: 'Rechazado',
            nombreestudiante: 'none',
            carreraestudiante: 'none',
            semestreestudiante: 'none',
            atencion: 'none',
            temaconsulta: 'none',
            detalletemaconsulta: 'none',
          };

          // Crear registro en la base de datos de Sesiones
          await crearProgramarSesiones(dataProgramarSesiones);

          // Eliminar sesión de la base de datos
          await deleteSesiones(id);
        }
      }
      // Enviar email
      const email = docenteInfo.correo;
      const nombreusuario = nombre;
      const message = comentarios || 'Sin detalle.';

      enviar_email(email, nombreusuario, materia, fecha, horaInicio, horaFin, message);

      // Recargar la página
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const enviar_email = (email, nombreusuario, materia, fecha, horaInicio, horaFin, message) => {
    const templateParams = {
      to_email: email,
      to_name: nombreusuario,
      materia: materia,
      fecha: fecha,
      horaInicio: horaInicio,
      horaFin: horaFin,
      message: message,
    };

    emailjs.send('service_j9sn34j', 'template_wagxyje', templateParams, 'dUaV50NFvylrR7xn1')
      .then(() => {
        console.log('SUCCESS!');
      }, (error) => {
        console.log('FAILED...', error.text);
      });
  };

  const handleHistorial = () => {
    navigate('/historialsesionesimt');
  };


  return (
    <>
      {/* Header */}
      <HeaderPage
        header1="Gestión de Sesiones"
        paragraph="Bienvenido al Panel para Gestionar las Sesiones IMT"
      />
      {/* Navbar */}
      <Navbar variant="light" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <Nav className="me-auto">
          <Navbar.Text style={{ color: 'rgba(0,0,0,1)', fontSize: '1.2rem', fontWeight: '700', paddingLeft: '40px' }}>
            Bienvenido(a) {nombreDocente}
          </Navbar.Text>
        </Nav>
        <Nav className="ms-auto">
          <Nav className="ms-auto">
            <Nav.Link onClick={handleLogout} style={{ color: 'rgba(0,0,0,1)', fontSize: '1.2rem', fontWeight: '700', paddingRight: '15px' }}>
              Cerrar Sesión
            </Nav.Link>
            <Dropdown drop="start" style={{ paddingRight: '15px' }}>
              <Dropdown.Toggle variant="link" style={{ color: 'rgba(0,0,0,1)', fontSize: '1.2rem', fontWeight: '700' }} />
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleRegistro}>Registro de Sesiones</Dropdown.Item>
                <Dropdown.Item onClick={handleSesiones}>Sesiones</Dropdown.Item>
                <Dropdown.Item onClick={handleHistorial}>Historial</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Nav>
      </Navbar>

      {/* Container for table */}
      <Container fluid style={{ padding: '20px', textAlign: 'center' }}>
        <Row>
          <Col>
            <h1 style={{ fontWeight: 'bold' }}>Gestione las Sesiones Programadas por los Docentes</h1>
            {/* Tabla de sesiones */}
            <Table striped bordered hover responsive="sm" className="table-fixed" style={{ textAlign: 'justify' }}>
              <thead>
                <tr>
                  <th>Docente</th>
                  <th>Departamento</th>
                  <th>Materia</th>
                  <th>Día</th>
                  <th>Modalidad</th>
                  <th style={{ width: '108px' }}>Horario</th>
                  <th>Descripción</th>
                  <th>Gestión</th>
                </tr>
              </thead>
              <tbody>
                {sesiones.map(sesion => (
                  <tr key={sesion.id}>
                    <td>{sesion.nombre}</td>
                    <td>{sesion.departamento}</td>
                    <td>{sesion.materia}</td>
                    <td>{sesion.dia}</td>
                    <td>{sesion.modalidad}</td>
                    <td>{`${formatearHora(sesion.horaInicio)} - ${formatearHora(sesion.horaFin)}`}</td>
                    <td dangerouslySetInnerHTML={{ __html: generarDescripcion(sesion) }}></td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Button variant="success" style={{ width: '100%' }} onClick={() => handleAceptarSesion(sesion)}>Aceptar</Button>
                        <Button variant="danger" style={{ width: '100%' }} onClick={() => handleRechazar(sesion.id)}>Rechazar</Button>
                        {mostrarComentarios === sesion.id && (
                          <div style={{ marginTop: '10px' }}>
                            <Form.Control
                              as="textarea"
                              placeholder="Ingrese comentarios"
                              rows={3}
                              value={comentarios}
                              onChange={(e) => setComentarios(e.target.value)}
                              style={{ marginBottom: '10px' }}
                            />
                            <Button variant="primary" style={{ width: '100%' }} onClick={() => handleEnviarComentarios(sesion)}>Enviar</Button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </>
  )
}
