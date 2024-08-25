import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { HeaderPage } from '../components/HeaderPage.jsx';
import { getProgramarSesiones, getMateria } from '../api/tasks.api.js';
import { useNavigate } from 'react-router-dom';

export const EstudiantesSesionesReserva = () => {

    const [sesiones, setSesiones] = useState([]); // Estado para almacenar las sesiones
    const [showModal, setShowModal] = useState(false); // Estado para controlar el popup
    const [selectedSesion, setSelectedSesion] = useState(null); // Estado para almacenar la sesión seleccionada
    const navigate = useNavigate();

    const [departamentos, setDepartamentos] = useState([]); // Estado para los departamentos
    const [materias, setMaterias] = useState([]); // Estado para las materias
    const [selectedDepartamento, setSelectedDepartamento] = useState(''); // Estado para el departamento seleccionado
    const [selectedMateria, setSelectedMateria] = useState(''); // Estado para la materia seleccionada

    // Estado para manejar la fecha seleccionada
    const [selectedFecha, setSelectedFecha] = useState(''); // Estado para la fecha seleccionada

    useEffect(() => {
        const fetchSesiones = async () => {
            try {
                const res = await getProgramarSesiones(); // Obtener datos de sesiones desde la base de datos
                setSesiones(res.data);
            } catch (error) {
                console.error('Error al obtener sesiones:', error);
            }
        };
        const fetchMaterias = async () => {
            try {
                const res = await getMateria(); // Obtener datos de materias desde la base de datos
                const materiasData = res.data;
                const departamentosData = [...new Set(materiasData.map(m => m.departamento))];
                setDepartamentos(departamentosData);
                setMaterias(materiasData);
            } catch (error) {
                console.error('Error al obtener materias:', error);
            }
        };

        fetchSesiones();
        fetchMaterias();
    }, []);

    // Filtrar sesiones según los filtros seleccionados
    const sesionesFiltradas = sesiones.filter(sesion => {
        return (
            (selectedDepartamento ? sesion.departamento === selectedDepartamento : true) &&
            (selectedMateria ? sesion.materia === selectedMateria : true) &&
            (selectedFecha ? sesion.fecha === selectedFecha : true) &&
            sesion.estado === 'Aceptado'
        );
    });



    // Generar contenido de la columna Descripción
    const generarDescripcion = (sesion) => {
        const { modalidad, plataforma, ambiente, detalleambiente } = sesion;
        let descripcion = '';

        if (modalidad === 'Virtual') {
            if (plataforma === 'Otro') {
                descripcion = `La sesión es <b>virtual</b> cuyo medio es definido por el docente, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
            } else {
                descripcion = `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
            }
        } else if (modalidad === 'Presencial') {
            if (ambiente === 'Otro') {
                descripcion = `La sesión es <b>presencial</b> cuyo ambiente es definido por el docente con la siguiente descripción previa: <b>${detalleambiente}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
            } else {
                descripcion = detalleambiente === 'none'
                    ? `La sesión es <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`
                    : `La sesión es <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b> - <b>${detalleambiente}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
            }
        } else if (modalidad === 'Ambos') {
            if (plataforma === 'Otro' && ambiente === 'Otro') {
                descripcion = `La sesión es <b>virtual</b> cuyo medio es definido por el docente y <b>presencial</b> cuyo ambiente es definido por el docente con la siguiente descripción previa: <b>${detalleambiente}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
            } else if (plataforma === 'Otro') {
                descripcion = `La sesión es <b>virtual</b> cuyo medio es definido por el docente y <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
            } else if (ambiente === 'Otro') {
                descripcion = `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b> y <b>presencial</b> cuyo ambiente es definido por el docente con la siguiente descripción previa: <b>${detalleambiente}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
            } else {
                descripcion = detalleambiente === 'none'
                    ? `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b> y <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`
                    : `La sesión es <b>virtual</b> mediante la plataforma de <b>${plataforma}</b> y <b>presencial</b> en el siguiente ambiente: <b>${ambiente}</b> - <b>${detalleambiente}</b>, si reserva la sesión recibirá un mensaje de confirmación y detalles una vez se confirme la misma.`;
            }
        }

        return descripcion;
    };

    // Función para formatear la hora y quitar los segundos
    const formatearHora = (hora) => {
        return hora.slice(0, 5); // Quita los segundos de la hora
    };

    // Función para abrir el modal
    const handleReservaClick = (sesion) => {
        setSelectedSesion(sesion);
        setShowModal(true);
    };

    // Función para cerrar el modal
    const handleClose = () => {
        setShowModal(false);
        setSelectedSesion(null);
    };

    // Función para confirmar la reserva y redirigir
    const handleConfirmar = () => {
        // Redirigir a la página de formulario de sesiones
        navigate('/formulariosesionesimt', {
            state: { docente: selectedSesion.docente, fecha: selectedSesion.fecha, materia: selectedSesion.materia, horaInicio: selectedSesion.horaInicio, horaFin: selectedSesion.horaFin, modalidad: selectedSesion.modalidad } // Pasar datos de fecha y materia
        });
    };

    // Manejar el cambio en el filtro de departamento
    const handleDepartamentoChange = (event) => {
        setSelectedDepartamento(event.target.value);
        setSelectedMateria(''); // Limpiar materia cuando se cambia el departamento
    };

    // Manejar el cambio en el filtro de materia
    const handleMateriaChange = (event) => {
        setSelectedMateria(event.target.value);
    };

    // Manejar el cambio en el filtro de fecha
    const handleFechaChange = (event) => { // Manejar el cambio en el filtro de fecha
        setSelectedFecha(event.target.value);
    };

    return (
        <>
            {/* Header */}
            <HeaderPage
                header1="Reserva de Sesiones"
                paragraph="Bienvenido al Panel para Reservar Sesiones"
            />

            <Container fluid style={{ padding: '20px' }}>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group controlId="formDepartamento">
                                <Form.Label>Departamento</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedDepartamento}
                                    onChange={handleDepartamentoChange}
                                >
                                    <option value="">Todos los departamentos</option>
                                    {departamentos.map(departamento => (
                                        <option key={departamento} value={departamento}>{departamento}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formMateria">
                                <Form.Label>Materia</Form.Label>
                                <Form.Control
                                    as="select"
                                    value={selectedMateria}
                                    onChange={handleMateriaChange}
                                    disabled={!selectedDepartamento} // Habilitar solo si hay un departamento seleccionado
                                >
                                    <option value="">Todas las materias</option>
                                    {materias.filter(materia => materia.departamento === selectedDepartamento).map(materia => (
                                        <option key={materia.materia} value={materia.materia}>{materia.materia}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>

                            <Form.Group controlId="formFecha">
                                <Form.Label>Fecha</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={selectedFecha}
                                    onChange={handleFechaChange}
                                />
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>

            {/* Container for table */}
            <Container fluid style={{ padding: '20px' }}>
                <Row>
                    <Col>
                        {/* Tabla de sesiones */}
                        <Table striped bordered hover responsive="sm" className="table-fixed" style={{ textAlign: 'justify' }}>
                            <thead>
                                <tr>
                                    <th>Docente</th>
                                    <th>Materia</th>
                                    <th>Día</th>
                                    <th style={{ width: '100px' }}>Fecha</th>
                                    <th style={{ width: '108px' }}>Horario</th>
                                    <th>Modalidad</th>
                                    <th>Descripción</th>
                                    <th>Reservación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sesionesFiltradas.map(sesion => (
                                    <tr key={sesion.id}>
                                        <td>{sesion.docente}</td>
                                        <td>{sesion.materia}</td>
                                        <td>{sesion.dia}</td>
                                        <td>{sesion.fecha}</td>
                                        <td>{`${formatearHora(sesion.horaInicio)} - ${formatearHora(sesion.horaFin)}`}</td>
                                        <td>{sesion.modalidad}</td>
                                        <td dangerouslySetInnerHTML={{ __html: generarDescripcion(sesion) }}></td>
                                        <td>
                                            {sesion.nombreestudiante === 'none' && sesion.carreraestudiante === 'none' && sesion.semestreestudiante === 'none' && sesion.atencion === 'none' && sesion.temaconsulta === 'none' ? (
                                                <Button variant="primary" onClick={() => handleReservaClick(sesion)}>Reserva Aquí</Button>
                                            ) : (
                                                <i style={{ textAlign: 'center' }}><strong>Reservado</strong></i>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
            {/* Modal de confirmación */}
            {selectedSesion && (
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmar Reserva</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Confirme que desea realizar la reserva de sesión en fecha: {selectedSesion.fecha} con horario: {formatearHora(selectedSesion.horaInicio)} - {formatearHora(selectedSesion.horaFin)} con el docente: {selectedSesion.docente}.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleConfirmar}>
                            Confirmar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    )
}