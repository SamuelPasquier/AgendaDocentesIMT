import React, { useState, useEffect } from 'react';
import { Nav, Navbar, Dropdown, Table, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { HeaderPage } from '../components/HeaderPage.jsx';
import { getProgramarSesiones, editarProgramarSesiones, deleteProgramarSesiones, crearHistorial } from '../api/tasks.api.js';
import emailjs from '@emailjs/browser';
import { Marketing } from './Marketing.jsx';

export const Sesiones = () => {
  const navigate = useNavigate();

  const [nombreDocente, setNombreDocente] = useState('');
  const [tipoDocente, setTipoDocente] = useState('');
  const [sesiones, setSesiones] = useState([]);

  // Estados para manejar la visibilidad y funcionalidad del input y el checkbox
  const [comentarios, setComentarios] = useState('');
  const [mostrarInput, setMostrarInput] = useState(false);
  const [mostrarInputRechazo, setMostrarInputRechazo] = useState(false);
  const [esSoloLectura, setEsSoloLectura] = useState(false);
  const [sesionSeleccionada, setSesionSeleccionada] = useState(null);

  useEffect(() => {
    const usuarioLogueado = localStorage.getItem('usuario');
    if (!usuarioLogueado) {
      navigate('/login');
    } else {
      const usuariologin = JSON.parse(usuarioLogueado)
      setNombreDocente(usuariologin.nombre);
      setTipoDocente(usuariologin.tipodocente);
      // Redirigir a /Marketing si el tipoDocente es Marketing
      if (usuariologin.tipodocente === 'Marketing') {
        navigate('/marketing');
      }
    }
  }, [navigate]);

  useEffect(() => {
    // Función para obtener los registros utilizando getProgramarSesiones
    const fetchSesiones = async () => {
      try {
        const response = await getProgramarSesiones(); // Llamada a la API para obtener los registros
        const data = response.data;

        // Filtramos los registros según los criterios especificados
        const filteredData = data.filter(item =>
          item.estado === 'Aceptado' &&
          item.nombreestudiante !== 'none' &&
          item.carreraestudiante !== 'none' &&
          item.semestreestudiante !== 'none' &&
          item.temaconsulta !== 'none' &&
          item.atencion !== 'none' &&
          item.docente === nombreDocente
        );

        setSesiones(filteredData);
      } catch (error) {
        console.error('Error al obtener los registros:', error);
      }
    };

    fetchSesiones();
  }, [nombreDocente]); // Se ejecuta solo una vez al montar el componente


  const generarDescripcion = (sesion) => {
    const { modalidad, plataforma, link, ambiente, detalleambiente } = sesion;
    let descripcion = '';

    const generarLink = (url) => {
      return `<a href="${url}" target="_blank">${url}</a>`;
    };

    if (modalidad === 'Virtual') {
      if (plataforma === 'Otro') {
        descripcion = `La sesión es <b>virtual</b> cuyo medio es definido por el docente, cuyo link es el siguiente: ${generarLink(link)}`;
      } else {
        descripcion = `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b>, cuyo link es el siguiente: ${generarLink(link)}`;
      }
    } else if (modalidad === 'Presencial') {
      if (ambiente === 'Otro') {
        descripcion = `La sesión es <b>presencial</b> cuyo ambiente es definido por el docente con la siguiente descripción previa: <b>${detalleambiente}</b>.`;
      } else {
        descripcion = detalleambiente === 'none'
          ? `La sesión es <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b>.`
          : `La sesión es <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b> - <b>${detalleambiente}</b>.`;
      }
    } else if (modalidad === 'Ambos') {
      if (plataforma === 'Otro' && ambiente === 'Otro') {
        descripcion = `La sesión es <b>virtual</b> cuyo medio es definido por el docente con el siguiente link: ${generarLink(link)} y <b>presencial</b> cuyo ambiente es definido por el docente con la siguiente descripción previa: <b>${detalleambiente}</b>.`;
      } else if (plataforma === 'Otro') {
        descripcion = `La sesión es <b>virtual</b> cuyo medio es definido por el docente con el siguiente link: ${generarLink(link)} y <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b>.`;
      } else if (ambiente === 'Otro') {
        descripcion = `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b> con el siguiente link: ${generarLink(link)} y <b>presencial</b> cuyo ambiente es definido por el docente con la siguiente descripción previa: <b>${detalleambiente}</b>.`;
      } else {
        descripcion = detalleambiente === 'none'
          ? `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b> cuyo link es: ${generarLink(link)} y <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b>.`
          : `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b> cuyo link es: ${generarLink(link)} y <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b> - <b>${detalleambiente}</b>.`;
      }
    }

    return descripcion;
  };

  // Función para formatear la hora y quitar los segundos
  const formatearHora = (hora) => {
    return hora.slice(0, 5); // Quita los segundos de la hora
  };

  const handleRegistro = () => {
    navigate('/docentes_registro_sesiones');
  };

  const handleGestionSesiones = () => {
    navigate('/gestionsesiones');
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const handleAceptarSesion = (id) => {
    setMostrarInput(true); // Mostrar el input al aceptar la sesión
    setMostrarInputRechazo(false);
    setSesionSeleccionada(id); // Establecer la sesión seleccionada
  };

  const handleRechazarSesion = (id) => {
    setMostrarInputRechazo(true); // Mostrar el input al rechazar la sesión
    setMostrarInput(false); // Asegurarse de que el input de aceptar esté cerrado
    setSesionSeleccionada(id); // Establecer la sesión seleccionada
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setComentarios('Sin detalle');
      setEsSoloLectura(true);
    } else {
      setComentarios('');
      setEsSoloLectura(false);
    }
  };

  const enviar_email = (email, nombredelestudiante, docente, materia, fecha, horaInicio, horaFin, confirmacion, message) => {
    const templateParams = {
      to_email: email,
      to_name: nombredelestudiante,
      docente: docente,
      materia: materia,
      fecha: fecha,
      horaInicio: horaInicio,
      horaFin: horaFin,
      confirmacion: confirmacion,
      message: message,
    };

    emailjs.send('service_j9sn34j', 'template_v04eibu', templateParams, 'dUaV50NFvylrR7xn1')
      .then(() => {
        console.log('SUCCESS!');
      }, (error) => {
        console.log('FAILED...', error.text);
      });
  };

  const removeHtmlTags = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };


  // Nueva función para manejar el envío y agendamiento de la sesión
  const handleEnviarYAgendarSesion = async () => {
    if (sesionSeleccionada) {
      const sesion = sesiones.find(s => s.id === sesionSeleccionada);
      if (sesion) {
        console.log(sesion);
        // Generar la descripción utilizando la función existente
        let message = generarDescripcion(sesion);

        message = removeHtmlTags(message);

        // Añadir los comentarios si no son "Sin detalle"
        if (comentarios !== 'Sin detalle') {
          message += `    Comentarios adicionales por parte del docente: ${comentarios}`;
        }

        // Llamar a la función de enviar correo con los datos necesarios
        enviar_email(
          sesion.correoestudiante,
          sesion.nombreestudiante,
          nombreDocente,
          sesion.materia,
          sesion.fecha,
          formatearHora(sesion.horaInicio),
          formatearHora(sesion.horaFin),
          'Confirmada', // Confirmación fija como solicitaste
          message
        );

        // **Crear registro en marketing**
        const marketingData = {
          docente: sesion.docente,
          tipodocente: sesion.tipodocente,
          departamento: sesion.departamento,
          materia: sesion.materia,
          dia: sesion.dia,
          fecha: sesion.fecha,
          horaInicio: sesion.horaInicio,
          horaFin: sesion.horaFin,
          modalidad: sesion.modalidad,
          plataforma: sesion.plataforma,
          link: sesion.link,
          ambiente: sesion.ambiente,
          detalleambiente: sesion.detalleambiente,
          estado: sesion.estado,
          nombreestudiante: sesion.nombreestudiante,
          carreraestudiante: sesion.carreraestudiante,
          correoestudiante: sesion.correoestudiante,
          semestreestudiante: sesion.semestreestudiante,
          atencion: sesion.atencion,
          cantidad: sesion.cantidad,
          temaconsulta: sesion.temaconsulta,
          detalletemaconsulta: sesion.detalletemaconsulta,
          confirmacion: 'Confirmada',
          comentariosdocentesesion: comentarios,
        };
        try {
          await crearHistorial(marketingData);
          console.log('Marketing data sent successfully');
        } catch (error) {
          console.error('Error al enviar los datos de marketing:', error);
        }


        // Actualizar el estado de la sesión a 'Aceptado'
        await editarProgramarSesiones(sesionSeleccionada, { confirmacion: 'Confirmada' });

        // Actualizar la lista de sesiones
        const updatedSesiones = sesiones.map(s =>
          s.id === sesionSeleccionada ? { ...s, confirmacion: 'Confirmada' } : s
        );
        setSesiones(updatedSesiones);

        // Ocultar el input después de aceptar la sesión
        setMostrarInput(false);
        setComentarios('');
        setEsSoloLectura(false);
      }
    }
  };

  const handleRechazarYEliminar = async () => {
    if (sesionSeleccionada) {
      const sesion = sesiones.find(s => s.id === sesionSeleccionada);
      if (sesion) {
        let message = "Se ha rechazado la sesión. ";

        // Añadir los comentarios de rechazo
        if (comentarios !== 'Sin detalle') {
          message += `    Comentarios adicionales por parte del docente: ${comentarios}`;
        }
        // Llamar a la función de enviar correo con los datos necesarios
        enviar_email(
          sesion.correoestudiante,
          sesion.nombreestudiante,
          nombreDocente,
          sesion.materia,
          sesion.fecha,
          formatearHora(sesion.horaInicio),
          formatearHora(sesion.horaFin),
          'Rechazada',
          message
        );

        const marketingData = {
          docente: sesion.docente,
          tipodocente: sesion.tipodocente,
          departamento: sesion.departamento,
          materia: sesion.materia,
          dia: sesion.dia,
          fecha: sesion.fecha,
          horaInicio: sesion.horaInicio,
          horaFin: sesion.horaFin,
          modalidad: sesion.modalidad,
          plataforma: sesion.plataforma,
          link: sesion.link,
          ambiente: sesion.ambiente,
          detalleambiente: sesion.detalleambiente,
          estado: sesion.estado,
          nombreestudiante: sesion.nombreestudiante,
          carreraestudiante: sesion.carreraestudiante,
          correoestudiante: sesion.correoestudiante,
          semestreestudiante: sesion.semestreestudiante,
          atencion: sesion.atencion,
          cantidad: sesion.cantidad,
          temaconsulta: sesion.temaconsulta,
          detalletemaconsulta: sesion.detalletemaconsulta,
          confirmacion: 'Rechazada',
          comentariosdocentesesion: comentarios,
        };
        try {
          await crearHistorial(marketingData);
          console.log('Marketing data sent successfully');
        } catch (error) {
          console.error('Error al enviar los datos de marketing:', error);
        }

        await deleteProgramarSesiones(sesionSeleccionada);

        // Ocultar el input y limpiar la selección de sesión después de enviar el correo
        setMostrarInputRechazo(false);
        setEsSoloLectura(false);
        setComentarios('');
        // Recargar la página
        setTimeout(() => {
          window.location.reload();
        }, 950);
      }
    }
  };

  const handleEliminar = async (idregistro) => {
    if (idregistro) {
      const sesion = sesiones.find(s => s.id === idregistro);
      if (sesion) {
        await deleteProgramarSesiones(idregistro);
        // Recargar la página
        setTimeout(() => {
          window.location.reload();
        }, 800);
      }
    }
  };
  // Nueva función para manejar la redirección al componente Marketing
  const handleHistorial = () => {
    navigate('/historialsesionesimt');
  };


  return (
    <>
      {/* Header */}
      <HeaderPage
        header1="Programar Sesiones"
        paragraph="Bienvenido al Panel para Programar las Sesiones"
      />
      {/* Navbar */}
      <Navbar variant="light" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <Nav className="me-auto">
          <Navbar.Text style={{ color: 'rgba(0,0,0,1)', fontSize: '1.2rem', fontWeight: '700', paddingLeft: '40px' }}>
            Bienvenido(a) {nombreDocente}
          </Navbar.Text>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Link onClick={handleLogout} style={{ color: 'rgba(0,0,0,1)', fontSize: '1.2rem', fontWeight: '700', paddingRight: '30px' }}>
            Cerrar Sesión
          </Nav.Link>
          <Dropdown drop="start" style={{ paddingRight: '15px' }}>
            <Dropdown.Toggle variant="link" style={{ color: 'rgba(0,0,0,1)', fontSize: '1.2rem', fontWeight: '700' }} />
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleRegistro}>Registro Sesiones</Dropdown.Item>
              {tipoDocente === 'Director de Carrera' && (
                <>
                  <Dropdown.Item onClick={handleGestionSesiones}>Gestionar Sesiones</Dropdown.Item>
                  <Dropdown.Item onClick={handleHistorial}>Historial</Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>
      {/* Tabla de Sesiones */}
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontWeight: 'bold' }}>Gestione las Sesiones Solicitadas por los Estudiantes</h1>
        <Table striped bordered hover responsive="sm" className="table-fixed" style={{ textAlign: 'justify' }}>
          <thead>
            <tr>
              <th>Nº</th>
              <th>Nombre del Estudiante</th>
              <th>Carrera del Estudiante</th>
              <th>Materia</th>
              <th style={{ width: '100px' }}>Fecha</th>
              <th style={{ width: '108px' }}>Horario</th>
              <th>Modalidad</th>
              <th>Tipo de Atención</th>
              <th>Cantidad de Asistentes</th>
              <th>Tema de Consulta</th>
              <th>Detalle de Consulta</th>
              <th style={{ width: '300px' }}>Descripción de Sesión</th>
              <th style={{ width: mostrarInput || mostrarInputRechazo && sesionSeleccionada ? '400px' : '120px' }}>Gestión</th>
            </tr>
          </thead>
          <tbody>
            {sesiones.map((sesion, index) => (
              <tr key={index}>
                <td>{sesion.id}</td>
                <td>{sesion.nombreestudiante}</td>
                <td>{sesion.carreraestudiante}</td>
                <td>{sesion.materia}</td>
                <td>{sesion.fecha}</td>
                <td>{`${formatearHora(sesion.horaInicio)} - ${formatearHora(sesion.horaFin)}`}</td>
                <td>{sesion.modalidad}</td>
                <td>{sesion.atencion}</td>
                <td>{sesion.cantidad}</td>
                <td>{sesion.temaconsulta}</td>
                <td>{sesion.detalletemaconsulta === 'none' ? 'Sin detalle' : sesion.detalletemaconsulta}</td>
                <td dangerouslySetInnerHTML={{ __html: generarDescripcion(sesion) }}></td>
                <td>
                  {sesion.confirmacion === 'none' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <Button variant="success" style={{ marginBottom: '10px' }} onClick={() => handleAceptarSesion(sesion.id)}>Aceptar Sesión</Button>
                      <Button variant="danger" onClick={() => handleRechazarSesion(sesion.id)}>Rechazar Sesión</Button>
                      {/* Input y checkbox para los comentarios */}
                      {mostrarInput && sesionSeleccionada === sesion.id && (
                        <div style={{ textAlign: 'center' }}>
                          <h3 style={{ fontWeight: 'bold' }}>Aceptar Solicitud</h3>
                          <Form.Group controlId="formComentarios">
                            <Form.Label>Comentarios para el Estudiante:</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={comentarios}
                              onChange={(e) => setComentarios(e.target.value)}
                              readOnly={esSoloLectura}
                              placeholder="Ingrese sus comentarios"
                              style={{ maxWidth: '600px', margin: '0 auto' }}
                            />
                            <Form.Check
                              type="checkbox"
                              label="No deseo ingresar comentarios"
                              checked={esSoloLectura}
                              onChange={handleCheckboxChange}
                              style={{ marginTop: '10px' }}
                            />
                          </Form.Group>
                          <Button variant="primary" onClick={handleEnviarYAgendarSesion} style={{ marginTop: '10px', width: '100%' }}>Enviar y Agendar Sesión</Button>
                          <Button onClick={() => setMostrarInput(false)} style={{ marginTop: '10px', backgroundColor: '#555555', borderColor: '#555555', width: '100%' }}>Cancelar</Button>
                        </div>
                      )}
                      {/* Input para rechazar sesión */}
                      {mostrarInputRechazo && sesionSeleccionada === sesion.id && (
                        <div style={{ textAlign: 'center' }}>
                          <h3 style={{ fontWeight: 'bold' }}>Rechazar Solicitud</h3>
                          <Form.Group controlId="formComentariosRechazo">
                            <Form.Label>Comentarios para el Estudiante:</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={3}
                              value={comentarios}
                              onChange={(e) => setComentarios(e.target.value)}
                              readOnly={esSoloLectura}
                              placeholder="Ingrese sus comentarios"
                              style={{ maxWidth: '600px', margin: '0 auto' }}
                            />
                            <Form.Check
                              type="checkbox"
                              label="No deseo ingresar comentarios"
                              checked={esSoloLectura}
                              onChange={handleCheckboxChange}
                              style={{ marginTop: '10px' }}
                            />
                          </Form.Group>
                          <Button variant="primary" onClick={handleRechazarYEliminar} style={{ marginTop: '10px', width: '100%', backgroundColor: '#000099', borderWidth: '#000099' }}>Enviar</Button>
                          <Button onClick={() => setMostrarInputRechazo(false)} style={{ marginTop: '10px', backgroundColor: '#555555', borderColor: '#555555', width: '100%' }}>Cancelar</Button>
                        </div>
                      )}
                    </div>
                  )}
                  {sesion.confirmacion === 'Confirmada' && (
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ fontStyle: 'italic', fontWeight: 'bold', fontSize: '1.3rem' }}>Confirmada</span>
                      <Button variant="primary" onClick={() => handleEliminar(sesion.id)} style={{ marginTop: '10px', width: '100%', backgroundColor: '#000099', borderWidth: '#000099' }}>Sesión Finalizada Exitosamente</Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="primary" onClick={() => navigate('/docentes_registro_sesiones')} style={{
          marginTop: '10px',
          width: '30%',
          backgroundColor: '#000099',
          borderWidth: '#000099',
          borderRadius: '10px'
        }}>Crear Horario de Consulta</Button>
      </div>
    </>
  );
};
