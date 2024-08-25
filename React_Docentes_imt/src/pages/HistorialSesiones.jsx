import React, { useState, useEffect } from 'react';
import { Nav, Navbar, Dropdown, Table, Button, Form } from 'react-bootstrap';
import { HeaderPage } from '../components/HeaderPage.jsx';
import { useNavigate } from 'react-router-dom';
import { getHistorial } from '../api/tasks.api.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { htmlToText } from 'html-to-text';

export const HistorialSesiones = () => {
    const navigate = useNavigate();

    const [nombreDocente, setNombreDocente] = useState('');
    const [tipoDocente, setTipoDocente] = useState('');
    const [marketingData, setMarketingData] = useState([]);
    const [departamentoFiltro, setDepartamentoFiltro] = useState('');
    const [materiaFiltro, setMateriaFiltro] = useState('');
    const [departamentos, setDepartamentos] = useState([]); // Nuevo estado para departamentos
    const [materias, setMaterias] = useState([]); // Nuevo estado para materias

    useEffect(() => {
        const usuarioLogueado = localStorage.getItem('usuario');
        if (!usuarioLogueado) {
            navigate('/login');
        } else {
            const usuariologin = JSON.parse(usuarioLogueado)
            setNombreDocente(usuariologin.nombre);
            setTipoDocente(usuariologin.tipodocente);
        }

        const fetchData = async () => {
            try {
                const response = await getHistorial();
                setMarketingData(response.data);

                // Obtener departamentos y materias para los filtros
                const uniqueDepartamentos = [...new Set(response.data.map(item => item.departamento))];
                setDepartamentos(uniqueDepartamentos);

                const uniqueMaterias = [...new Set(response.data.map(item => item.materia))];
                setMaterias(uniqueMaterias);
            } catch (error) {
                console.error("Error fetching marketing data: ", error);
            }
        };


        fetchData();
    }, [navigate]);

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

    const downloadPDF = () => {
        const doc = new jsPDF('l', 'mm', 'a4'); // 'l' para horizontal

        // Define las columnas para la primera y segunda mitad
        const columns1 = [
            { header: 'Nº', dataKey: 'id' },
            { header: 'Docente', dataKey: 'docente' },
            { header: 'Tipo de Docente', dataKey: 'tipodocente' },
            { header: 'Departamento', dataKey: 'departamento' },
            { header: 'Materia', dataKey: 'materia' },
            { header: 'Día', dataKey: 'dia' },
            { header: 'Fecha', dataKey: 'fecha' },
            { header: 'Horario', dataKey: 'horario' },
            { header: 'Modalidad', dataKey: 'modalidad' },
            { header: 'Descripción de la Sesión', dataKey: 'descripcion' }
        ];

        const columns2 = [
            { header: 'Nombre Estudiante', dataKey: 'nombreestudiante' },
            { header: 'Carrera Estudiante', dataKey: 'carreraestudiante' },
            { header: 'Semestre Estudiante', dataKey: 'semestreestudiante' },
            { header: 'Correo Estudiante', dataKey: 'correoestudiante' },
            { header: 'Atención', dataKey: 'atencion' },
            { header: 'Cantidad de Asistentes', dataKey: 'cantidad' },
            { header: 'Tema Consulta', dataKey: 'temaconsulta' },
            { header: 'Detalle Tema Consulta', dataKey: 'detalletemaconsulta' },
            { header: 'Confirmación', dataKey: 'confirmacion' },
            { header: 'Comentarios Docente Sesión', dataKey: 'comentariosdocentesesion' }
        ];

        // Convierte los datos de marketingData para el formato adecuado de autoTable
        const filteredData = marketingData.filter(item => (!departamentoFiltro || item.departamento === departamentoFiltro) &&
            (!materiaFiltro || item.materia === materiaFiltro)).map(item => ({
                id: item.id,
                docente: item.docente,
                tipodocente: item.tipodocente,
                departamento: item.departamento,
                materia: item.materia,
                dia: item.dia,
                fecha: item.fecha,
                horario: `${formatearHora(item.horaInicio)} - ${formatearHora(item.horaFin)}`,
                modalidad: item.modalidad,
                descripcion: htmlToText(generarDescripcion(item), {
                    wordwrap: 130 // Ajusta el límite de palabras por línea
                }),
                nombreestudiante: item.nombreestudiante,
                carreraestudiante: item.carreraestudiante,
                semestreestudiante: item.semestreestudiante,
                correoestudiante: item.correoestudiante,
                atencion: item.atencion,
                cantidad: item.cantidad,
                temaconsulta: item.temaconsulta,
                detalletemaconsulta: item.detalletemaconsulta,
                confirmacion: item.confirmacion,
                comentariosdocentesesion: item.comentariosdocentesesion
            }));

        // Agrega la primera mitad de la tabla
        doc.autoTable({
            columns: columns1,
            body: filteredData,
            theme: 'grid', // Puedes ajustar el tema
            margin: { top: 20 },
            styles: {
                fontSize: 12, // Ajusta el tamaño de la fuente
                cellPadding: 2, // Ajusta el espaciado en celdas
                valign: 'middle',
                overflow: 'linebreak'
            },
            columnStyles: {
                descripcion: { cellWidth: 50 } // Ajusta el ancho de la columna de descripción
            },
            pageBreak: 'auto'
        });

        // Agrega una página nueva para la segunda mitad de la tabla
        doc.addPage();

        doc.autoTable({
            columns: columns2,
            body: filteredData,
            theme: 'grid', // Puedes ajustar el tema
            margin: { top: 20 },
            styles: {
                fontSize: 12, // Ajusta el tamaño de la fuente
                cellPadding: 2, // Ajusta el espaciado en celdas
                valign: 'middle',
                overflow: 'linebreak'
            },
            pageBreak: 'auto'
        });

        doc.save('tabla-marketing.pdf');
    };



    const formatearHora = (hora) => {
        return hora.slice(0, 5); // Quita los segundos de la hora
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    const handleRegistro = () => {
        navigate('/docentes_registro_sesiones');
    };
    const handleSesiones = () => {
        navigate('/sesiones');
    };
    const handleGestionSesiones = () => {
        navigate('/gestionsesiones');
    };

    return (
        <>
            {/* Header */}
            <HeaderPage
                header1="Historial de Sesiones"
                paragraph="Bienvenido al Panel donde se Encuentra la Información de las Sesiones"
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
                    {tipoDocente === 'Director de Carrera' &&
                        <Dropdown drop="start" style={{ paddingRight: '15px' }}>
                            <Dropdown.Toggle variant="link" style={{ color: 'rgba(0,0,0,1)', fontSize: '1.2rem', fontWeight: '700' }} />
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={handleRegistro}>Registro Sesiones</Dropdown.Item>
                                <Dropdown.Item onClick={handleGestionSesiones}>Gestionar Sesiones</Dropdown.Item>
                                <Dropdown.Item onClick={handleSesiones}>Sesiones</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </Nav>
            </Navbar>
            {/* Filters */}
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Form>
                    <Form.Group controlId="formDepartamento">
                        <Form.Label>Departamento</Form.Label>
                        <Form.Control
                            as="select"
                            value={departamentoFiltro}
                            onChange={(e) => setDepartamentoFiltro(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {departamentos.map(departamento => (
                                <option key={departamento} value={departamento}>{departamento}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formMateria">
                        <Form.Label>Materia</Form.Label>
                        <Form.Control
                            as="select"
                            value={materiaFiltro}
                            onChange={(e) => setMateriaFiltro(e.target.value)}
                        >
                            <option value="">Todas</option>
                            {materias.map(materia => (
                                <option key={materia} value={materia}>{materia}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </div>
            {/* Table */}
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1 className="text-center mt-4" style={{ fontSize: '3.3rem', fontWeight: 'bold' }}>Registro de Sesiones</h1>
                <div id="tabla-marketing-wrapper">
                    <Table striped bordered hover responsive className="mt-3" id="tabla-marketing">
                        <thead>
                            <tr>
                                <th>Nº</th>
                                <th>Docente</th>
                                <th>Tipo de Docente</th>
                                <th>Departamento</th>
                                <th>Materia</th>
                                <th>Día</th>
                                <th>Fecha</th>
                                <th>Horario</th>
                                <th>Modalidad</th>
                                <th>Descripción de la Sesión</th>
                                <th>Nombre Estudiante</th>
                                <th>Carrera Estudiante</th>
                                <th>Semestre Estudiante</th>
                                <th>Correo Estudiante</th>
                                <th>Atención</th>
                                <th>Cantidad de Asistentes</th>
                                <th>Tema Consulta</th>
                                <th>Detalle Tema Consulta</th>
                                <th>Confirmación</th>
                                <th>Comentarios Docente Sesión</th>
                            </tr>
                        </thead>
                        <tbody>
                            {marketingData
                                .filter(item => (!departamentoFiltro || item.departamento === departamentoFiltro) &&
                                    (!materiaFiltro || item.materia === materiaFiltro))
                                .map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>{item.docente}</td>
                                        <td>{item.tipodocente}</td>
                                        <td>{item.departamento}</td>
                                        <td>{item.materia}</td>
                                        <td>{item.dia}</td>
                                        <td>{item.fecha}</td>
                                        <td>{`${formatearHora(item.horaInicio)} - ${formatearHora(item.horaFin)}`}</td>
                                        <td>{item.modalidad}</td>
                                        <td dangerouslySetInnerHTML={{ __html: generarDescripcion(item) }}></td>
                                        <td>{item.nombreestudiante}</td>
                                        <td>{item.carreraestudiante}</td>
                                        <td>{item.semestreestudiante}</td>
                                        <td>{item.correoestudiante}</td>
                                        <td>{item.atencion}</td>
                                        <td>{item.cantidad}</td>
                                        <td>{item.temaconsulta}</td>
                                        <td>{item.detalletemaconsulta}</td>
                                        <td>{item.confirmacion}</td>
                                        <td>{item.comentariosdocentesesion}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </Table>
                </div>
                <div className="text-center my-4">
                    <Button variant="danger" onClick={downloadPDF}>Descargar PDF</Button>
                </div>
            </div>
        </>
    )
}
