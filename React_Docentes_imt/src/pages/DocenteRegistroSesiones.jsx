import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { HeaderPage } from '../components/HeaderPage.jsx';
import { useForm } from 'react-hook-form';
import { crearSesiones, getMateria } from '../api/tasks.api.js';
import { useNavigate } from 'react-router-dom';
import { Marketing } from './Marketing.jsx';
export const DocentesRegistroSesiones = () => {
    const navigate = useNavigate();

    const [nombreDocente, setNombreDocente] = useState('');
    const [tipoDocente, setTipoDocente] = useState('');
    const [materiasFiltradas, setMateriasFiltradas] = useState([]);
    const [departamentosMaterias, setDepartamentosMaterias] = useState({}); // Nueva variable para almacenar los departamentos y materias obtenidos desde la base de datos

    useEffect(() => {
        const usuarioLogueado = localStorage.getItem('usuario');
        if (!usuarioLogueado) {
            navigate('/login');
        } else {
            const usuariologin = JSON.parse(usuarioLogueado)
            setNombreDocente(usuariologin.nombre);
            setTipoDocente(usuariologin.tipodocente);
        }
    }, [navigate]);

    // Nueva función para cargar los departamentos y materias desde la base de datos
    const cargarMaterias = async () => {
        try {
            const datafirst = await getMateria(); // getMateria debería devolver los departamentos y materias desde la base de datos
            const data = datafirst.data;
            const departamentos = {};
            data.forEach(item => {
                if (!departamentos[item.departamento]) {
                    departamentos[item.departamento] = [];
                }
                departamentos[item.departamento].push(item.materia);
            });
            setDepartamentosMaterias(departamentos);
        } catch (error) {
            console.error("Error al cargar las materias:", error);
        }
    };

    useEffect(() => {
        cargarMaterias(); // Llamada para cargar los departamentos y materias al montar el componente
    }, []);
    //Envio de datos a DJango
    const { register, handleSubmit, watch } = useForm();
    const departamentoSeleccionado = watch('departamento');

    const [mostrarDivision, setMostrarDivision] = useState(false); // Nueva variable de estado
    const horaInicio = watch('horaInicio');
    const horaFin = watch('horaFin');
    const intervalo = watch('intervalo');
    const [mensajeTiempoSobrante, setMensajeTiempoSobrante] = useState('');

    useEffect(() => {
        if (departamentoSeleccionado) {
            setMateriasFiltradas(departamentosMaterias[departamentoSeleccionado] || []);
        }
    }, [departamentoSeleccionado, departamentosMaterias]);

    useEffect(() => {
        if (horaInicio && horaFin) {
            setMostrarDivision(true);
        } else {
            setMostrarDivision(false);
        }
    }, [horaInicio, horaFin]);
    //const location = useLocation();
    //const { nombre } = location.state || {};

    //Variable para abrir apartados Presencial/Virtual
    const [modalidad, setModalidad] = useState('');

    const handleModalidadChange = (event) => {
        setModalidad(event.target.value);
    };
    //Variable para abrir apartado de detalle de sesión presencial
    const [ambiente, setAmbiente] = useState('');

    const handleAmbienteChange = (event) => {
        setAmbiente(event.target.value)
    };
    //Mensaje de Alerta
    const [alerta, setAlerta] = useState('');
    const handleGuardar = (event) => {
        const form = event.target.form;
        const camposRequeridos = form.querySelectorAll('[required]');
        let formularioCompleto = true;

        camposRequeridos.forEach(campo => {
            // Verifica si el campo está vacío o si tiene un valor predeterminado
            if (!campo.value || campo.value === "Seleccione un Departamento" ||
                campo.value === "Seleccione una Materia" ||
                campo.value === "Seleccione la Modalidad" ||
                campo.value === "Seleccione la Plataforma para la Sesión Virtual" ||
                campo.value === "Seleccione el Ambiente para la Sesión Presencial") {
                formularioCompleto = false;
            }
        });

        // Nueva validación para semestre
        const semestreSeleccionado = form.querySelector('select[name="semestre"]');
        if (!semestreSeleccionado.value) {
            formularioCompleto = false;
        }

        // Verificar si al menos un día ha sido seleccionado
        const diasSeleccionados = form.querySelectorAll('input[name="dia"]:checked');
        if (diasSeleccionados.length === 0) {
            formularioCompleto = false;
        }

        if (formularioCompleto) {
            console.log('Espacios llenos');
            setAlerta('');
        } else {
            setAlerta('Complete todos los espacios requeridos por favor.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    const handleReuniones = () => {
        navigate('/sesiones');
    };

    const handleGestionSesiones = () => {
        navigate('/gestionsesiones');
    };
    const handleHistorial = () => {
        navigate('/historialsesionesimt');
    };

    // Verificación del tipo de docente y renderizado condicional
    if (tipoDocente === 'Marketing') {
        return <Marketing />;
    };

    // Lógica para calcular las fechas según el semestre seleccionado
    const calcularFechas = (semestre, diasSeleccionados) => {
        const fechas = [];
        let startDate, endDate;

        // Configurar las fechas de inicio y fin según el semestre seleccionado
        switch (semestre) {
            case "SEMESTRE 2-2024":
                startDate = new Date("2024-08-01");
                endDate = new Date("2024-12-07");
                break;
            case "SEMESTRE 1-2025":
                startDate = new Date("2025-02-01");
                endDate = new Date("2025-07-05");
                break;
            case "SEMESTRE 2-2025":
                startDate = new Date("2025-08-01");
                endDate = new Date("2025-12-06");
                break;
            case "SEMESTRE 1-2026":
                startDate = new Date("2026-02-01");
                endDate = new Date("2026-07-04");
                break;
            case "SEMESTRE 2-2026":
                startDate = new Date("2026-08-01");
                endDate = new Date("2026-12-05");
                break;
            case "SEMESTRE 1-2027":
                startDate = new Date("2027-02-01");
                endDate = new Date("2027-07-03");
                break;
            case "SEMESTRE 2-2027":
                startDate = new Date("2027-08-01");
                endDate = new Date("2027-12-04");
                break;
            case "SEMESTRE 1-2028":
                startDate = new Date("2028-02-01");
                endDate = new Date("2028-07-01");
                break;
            case "SEMESTRE 2-2028":
                startDate = new Date("2028-08-01");
                endDate = new Date("2028-12-03");
                break;
            // Agregar más casos según sea necesario
            default:
                return fechas;
        }

        // Generar las fechas para los días seleccionados dentro del rango del semestre
        const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const dias = diasSeleccionados.map(dia => dayNames.indexOf(dia));

        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            if (dias.includes(date.getDay())) {
                fechas.push(new Date(date));
            }
        }

        return fechas;
    };


    // Nueva función para dividir las horas en intervalos
    const dividirHoras = (horaInicio, horaFin, intervalo) => {
        const sesiones = [];
        let horaActual = new Date(`1970-01-01T${horaInicio}:00`);
        const horaFinDate = new Date(`1970-01-01T${horaFin}:00`);

        while (horaActual < horaFinDate) {
            const siguienteHora = new Date(horaActual.getTime() + intervalo * 60000);
            if (siguienteHora <= horaFinDate) {
                sesiones.push({
                    horaInicio: horaActual.toTimeString().slice(0, 5),
                    horaFin: siguienteHora.toTimeString().slice(0, 5)
                });
            }
            horaActual = siguienteHora;
        }

        // Verificar si sobra tiempo
        const tiempoSobrante = horaFinDate - horaActual;
        if (tiempoSobrante > 0) {
            sesiones.push({
                horaInicio: horaActual.toTimeString().slice(0, 5),
                horaFin: horaFinDate.toTimeString().slice(0, 5),
                sobrante: true,
            });
        }

        return sesiones;
    };


    const onSubmit = handleSubmit(async data => {
        console.log(data);
        try {
            const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'));
            const nombreDocente = usuarioLogueado?.nombre || ''; // Obtener el nombre del docente del localStorage

            // Validación adicional en onSubmit para semestre y días
            if (!data.semestre) {
                setAlerta('Seleccione un semestre.');
                return;
            }

            const diasSeleccionados = [];
            if (data.lunes) diasSeleccionados.push('Lunes');
            if (data.martes) diasSeleccionados.push('Martes');
            if (data.miercoles) diasSeleccionados.push('Miércoles');
            if (data.jueves) diasSeleccionados.push('Jueves');
            if (data.viernes) diasSeleccionados.push('Viernes');
            if (data.sabado) diasSeleccionados.push('Sábado');

            if (diasSeleccionados.length === 0) {
                setAlerta('Seleccione al menos un día.');
                return;
            }

            const fechas = calcularFechas(data.semestre, diasSeleccionados);
            console.log(data.departamento);

            const sesiones = [];

            if (intervalo === 'No dividir') {
                // Si no se selecciona ningún intervalo, se utiliza la horaInicio y horaFin originales
                fechas.forEach(fecha => {
                    sesiones.push({
                        nombre: nombreDocente,
                        departamento: data.departamento,
                        materia: data.materia,
                        plataforma: data.plataforma || 'none',
                        ambiente: data.ambiente || 'none',
                        link: data.link || 'none',
                        modalidad: data.modalidad,
                        dia: fecha.toLocaleDateString('es-ES', { weekday: 'long' }),
                        fecha: fecha.toISOString().split('T')[0],
                        horaInicio: data.horaInicio,
                        horaFin: data.horaFin,
                        detalle: data.detalle,
                    });
                });
            } else {
                // Si se selecciona un intervalo, dividir las horas
                const sesionesDivididas = dividirHoras(data.horaInicio, data.horaFin, parseInt(intervalo));
                //const hayTiempoSobrante = sesionesDivididas.some(sesion => sesion.sobrante);

                fechas.forEach(fecha => {
                    sesionesDivididas.forEach(sesion => {
                        sesiones.push({
                            nombre: nombreDocente,
                            departamento: data.departamento,
                            materia: data.materia,
                            dia: fecha.toLocaleDateString('es-ES', { weekday: 'long' }),
                            fecha: fecha.toISOString().split('T')[0],
                            horaInicio: sesion.horaInicio,
                            horaFin: sesion.horaFin,
                            plataforma: data.plataforma || 'none',
                            modalidad: data.modalidad,
                            ambiente: data.ambiente || 'none',
                            detalle: data.detalle,
                            link: data.link || 'none',
                        });
                    });
                });
                // if (hayTiempoSobrante) {
                //     setMensajeTiempoSobrante('Hay un pequeño intervalo de tiempo sobrante.');
                // } else {
                //     setMensajeTiempoSobrante('');
                // }
            }

            console.log(sesiones);
            for (const sesion of sesiones) {
                await crearSesiones(sesion); // Enviar cada sesión individualmente
            }
            window.location.reload();


        } catch (error) {
            console.error("Error al enviar los datos:", error);
        }
    });

    return (
        <>
            {/* Header */}
            <HeaderPage
                header1="Registro de Sesiones"
                paragraph="Bienvenido al Panel para Registrar las Sesiones con sus Estudiantes"
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
                            <Dropdown.Item onClick={handleReuniones}>Sesiones</Dropdown.Item>
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
            <h1 className='text-center display-4 mt-4'
                style={{
                    fontFamily: 'Arial, sans-serif',
                    fontWeight: 'bold', color: 'rgb(0,0,0)'
                }}>
                CREAR HORARIOS DE CONSULTA</h1>
            <Container className="my-4">
                <Form onSubmit={onSubmit}>
                    <Row className='mb-4'>
                        <Col className='text-center'>
                            <Form.Group controlId="formDepartamentos">
                                <Form.Label style={{
                                    fontSize: '1.3rem',
                                    fontWeight: '750'
                                }}>Listado de Departamentos</Form.Label>
                                <Form.Select as="select"
                                    className="form-control-lg"
                                    required
                                    style={{
                                        borderRadius: '20px',
                                        boxShadow: '0 10px 10px rgba(0,0,0,0.35)'
                                    }} {...register("departamento", { required: true })}>
                                    <option value="">Seleccione un Departamento</option>
                                    {Object.keys(departamentosMaterias).map((departamento, index) => (
                                        <option key={index} value={departamento}>
                                            {departamento}
                                        </option>
                                    ))}
                                    {/* Agrega más opciones según sea necesario */}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col className='text-center'>
                            <Form.Group controlId="formMaterias">
                                <Form.Label style={{
                                    fontSize: '1.3rem',
                                    fontWeight: '750'
                                }}>
                                    Listado de Materias</Form.Label>
                                <Form.Select as="select"
                                    className="form-control-lg"
                                    required
                                    style={{
                                        borderRadius: '20px',
                                        boxShadow: '0 10px 10px rgba(0,0,0,0.35)'
                                    }} {...register("materia", { required: true })}>
                                    <option value="">Seleccione una Materia</option>
                                    {materiasFiltradas.map((materia, index) => (
                                        <option key={index} value={materia}>
                                            {materia}
                                        </option>
                                    ))}
                                    {/* Agrega más opciones según sea necesario */}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mb-4 text-center">
                        {/* Nueva columna para la fecha */}
                        <Col className='text-center'>
                            <Form.Group controlId="semestre">
                                <Form.Label style={{
                                    fontSize: '1.3rem',
                                    fontWeight: '750'
                                }}>Seleccione el Semestre</Form.Label>
                                <Form.Control style={{
                                    borderRadius: '20px',
                                    boxShadow: '0 10px 10px rgba(0,0,0,0.35)'
                                }} as="select" {...register('semestre', { required: true })}>
                                    <option value="">Seleccione un Semestre</option>
                                    <option value="SEMESTRE 2-2024">SEMESTRE 2-2024</option>
                                    <option value="SEMESTRE 1-2025">SEMESTRE 1-2025</option>
                                    <option value="SEMESTRE 2-2025">SEMESTRE 2-2025</option>
                                    <option value="SEMESTRE 1-2026">SEMESTRE 1-2026</option>
                                    <option value="SEMESTRE 2-2026">SEMESTRE 2-2026</option>
                                    <option value="SEMESTRE 1-2027">SEMESTRE 1-2027</option>
                                    <option value="SEMESTRE 2-2027">SEMESTRE 2-2027</option>
                                    <option value="SEMESTRE 1-2028">SEMESTRE 1-2028</option>
                                    <option value="SEMESTRE 2-2028">SEMESTRE 2-2028</option>
                                    {/* Agregar más opciones de semestre según sea necesario */}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="dia" >
                                <Form.Label style={{
                                    fontSize: '1.3rem',
                                    fontWeight: '750'
                                }}>Seleccione el/los dia(s) de consulta</Form.Label>
                                <div>
                                    <Form.Check inline type="checkbox" label="Lunes" {...register('lunes')} />
                                    <Form.Check inline type="checkbox" label="Martes" {...register('martes')} />
                                    <Form.Check inline type="checkbox" label="Miércoles" {...register('miercoles')} />
                                    <Form.Check inline type="checkbox" label="Jueves" {...register('jueves')} />
                                    <Form.Check inline type="checkbox" label="Viernes" {...register('viernes')} />
                                    <Form.Check inline type="checkbox" label="Sábado" {...register('sabado')} />
                                </div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className='mb-4'>
                        {/* Columna para las horas */}
                        <Col className='text-center'>
                            <Form.Group controlId="formHoras">
                                <Form.Label style={{
                                    fontSize: '1.3rem',
                                    fontWeight: '750'
                                }}>Horas</Form.Label>
                                <Row>
                                    <Col>
                                        <Form.Label style={{ fontSize: '1.1rem', fontWeight: '600' }}>Hora Inicio</Form.Label>
                                        <Form.Control type="time"
                                            className="form-control"
                                            required
                                            {...register("horaInicio", { required: true })}
                                            style={{
                                                borderRadius: '10px',
                                                boxShadow: '0 10px 10px rgba(0,0,0,0.35)'
                                            }} />
                                    </Col>
                                    <Col>
                                        <Form.Label style={{ fontSize: '1.1rem', fontWeight: '600' }}>Hora Fin</Form.Label>
                                        <Form.Control type="time"
                                            className="form-control"
                                            required
                                            {...register("horaFin", { required: true })}
                                            style={{
                                                borderRadius: '10px',
                                                boxShadow: '0 10px 10px rgba(0,0,0,0.35)'
                                            }} />
                                    </Col>
                                </Row>
                                {mostrarDivision && (
                                    <>
                                        <Form.Group controlId="intervalo">
                                            <Form.Label>¿Desea dividir el horario de la sesión?</Form.Label>
                                            <Form.Control as="select" {...register('intervalo')}>
                                                <option value="No dividir">No dividir</option>
                                                <option value="10">10 minutos</option>
                                                <option value="15">15 minutos</option>
                                                <option value="20">20 minutos</option>
                                                <option value="30">30 minutos</option>
                                                <option value="45">45 minutos</option>
                                                <option value="60">1 hora</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </>
                                )}
                            </Form.Group>
                        </Col>

                        {/* Columna para la modalidad */}
                        <Col className='text-center'>
                            <Form.Label style={{
                                fontSize: '1.3rem',
                                fontWeight: '750'
                            }}>Modalidad de la Sesión</Form.Label>
                            <Form.Group controlId="formModalidad">
                                <Form.Label style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600'
                                }}>Seleccione la Modalidad de la Sesión</Form.Label>
                                <Form.Control as="select"
                                    className="form-control"
                                    required
                                    {...register("modalidad", { required: true })}
                                    style={{
                                        borderRadius: '10px',
                                        boxShadow: '0 10px 10px rgba(0,0,0,0.35)'
                                    }} onChange={handleModalidadChange}
                                    value={modalidad}>
                                    <option value="">Seleccione la Modalidad</option>
                                    <option value="Virtual">Virtual</option>
                                    <option value="Presencial">Presencial</option>
                                    <option value="Ambos">Ambos</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                    {/* Sección dinámica para Virtual y Presencial */}
                    <Row className='mb-4'>
                        {modalidad === 'Virtual' || modalidad === 'Ambos' ? (
                            <Col className={`text-center ${modalidad === 'Ambos' ? 'col-md-6' : 'col-12'}`}>
                                <Form.Group controlId="formVirtual">
                                    <Form.Label style={{ fontSize: '1.3rem', fontWeight: '750' }}>Detalles de la Sesión Virtual</Form.Label>
                                    <Form.Control as="select" className="form-control"
                                        required
                                        {...register("plataforma", { required: true })}
                                        style={{
                                            borderRadius: '10px',
                                            boxShadow: '0 10px 10px rgba(0,0,0,0.35)',
                                            marginBottom: '15px'
                                        }}>
                                        <option value="">Seleccione la Plataforma para la Sesión Virtual</option>
                                        <option value="Zoom">Zoom</option>
                                        <option value="Meet">Meet</option>
                                        <option value="Teams">Teams</option>
                                        <option value="Otro">Otro</option>
                                    </Form.Control>
                                    <Form.Control type="text" placeholder="Ingrese el Link para la Sesión Virtual" className="form-control"
                                        required
                                        {...register("link", { required: true })}
                                        style={{
                                            borderRadius: '10px',
                                            boxShadow: '0 10px 10px rgba(0,0,0,0.35)',
                                            marginBottom: '15px'
                                        }}
                                    />
                                </Form.Group>
                            </Col>
                        ) : null}

                        {modalidad === 'Presencial' || modalidad === 'Ambos' ? (
                            <Col className={`text-center ${modalidad === 'Ambos' ? 'col-md-6' : 'col-12'}`}>
                                <Form.Group controlId="formPresencial">
                                    <Form.Label style={{ fontSize: '1.3rem', fontWeight: '750' }}>Detalles de la Sesión Presencial</Form.Label>
                                    <Form.Control as="select" className="form-control"
                                        required
                                        {...register("ambiente", { required: true })}
                                        style={{
                                            borderRadius: '10px',
                                            boxShadow: '0 10px 10px rgba(0,0,0,0.35)',
                                            marginBottom: '15px'
                                        }} onChange={handleAmbienteChange}
                                        value={ambiente}>
                                        <option value="">Seleccione el Ambiente para la Sesión Presencial</option>
                                        <option value="Aula">Aula</option>
                                        <option value="Laboratorio">Laboratorio</option>
                                        <option value="Oficina del Docente">Oficina del Docente</option>
                                        <option value="Ágora">Ágora</option>
                                        <option value="Otro">Otro</option>
                                    </Form.Control>
                                    {ambiente === 'Aula' || ambiente === 'Laboratorio'
                                        || ambiente === 'Otro' ? (
                                        <Form.Control type="text" placeholder="Ingrese el Número de Aula/Laboratorio y/o detalles para la Sesión" className="form-control"
                                            required
                                            {...register("detalle", { required: true })}
                                            style={{
                                                borderRadius: '10px',
                                                boxShadow: '0 10px 10px rgba(0,0,0,0.35)',
                                                marginBottom: '15px'
                                            }} />
                                    ) : null}
                                </Form.Group>
                            </Col>
                        ) : null}
                    </Row>
                    <Row className='mb-4'>
                        <Col className='text-center'>
                            {alerta && (
                                <div className="alert alert-danger mt-3" role="alert">
                                    {alerta}
                                </div>
                            )}
                            <Button
                                onClick={handleGuardar}
                                type="submit"
                                className="btn btn-lg btn-primary"
                                style={{ borderRadius: '20px', boxShadow: '0 10px 10px rgba(0,0,0,0.35)' }}
                            >
                                Guardar
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </>
    );
};

