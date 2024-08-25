import React, { useState, useEffect } from 'react';
import { HeaderPage } from '../components/HeaderPage.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProgramarSesiones, editarProgramarSesiones } from '../api/tasks.api.js';
export const FormularioReserva = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { docente, fecha, materia, horaInicio, horaFin, modalidad } = location.state || {}; // Obtener datos de fecha y materia desde la navegación

    const [participacion, setParticipacion] = useState('Individual');
    const [temaConsulta, setTemaConsulta] = useState('Tema específico de la materia');

    const [nombreEstudiante, setNombreEstudiante] = useState('');
    const [carrera, setCarrera] = useState('Ingeniería Mecatrónica'); // Añadir estado para la carrera
    const [correoEstudiante, setCorreoEstudiante] = useState('');
    const [semestreEstudiante, setSemestreEstudiante] = useState(1); // Añadir estado para el semestre
    const [detalleTema, setDetalleTema] = useState('');

    const [cantidadParticipantes, setCantidadParticipantes] = useState(2); // Estado para manejar la cantidad de participantes
    const [errorCantidadParticipantes, setErrorCantidadParticipantes] = useState(''); // Estado para manejar el mensaje de error de cantidad de participantes
    const [errorMensaje, setErrorMensaje] = useState(''); // Estado para manejar el mensaje de error

    const [showPopup, setShowPopup] = useState(false); // Estado para manejar la visibilidad del popup
    const [showConfirmPopup, setShowConfirmPopup] = useState(false); // Estado para manejar la visibilidad del popup de confirmación
    const [registroId, setRegistroId] = useState(null); // Estado para almacenar el ID del registro de marketing

    const [correoValido, setCorreoValido] = useState(true);

    // Función para validar el correo
    const validarCorreo = (correo) => {
        const regex = /^[a-zA-Z0-9._-]+@ucb\.edu\.bo$/;
        return regex.test(correo);
    };

    // Manejar cambio de correo
    const handleCorreoChange = (e) => {
        const correo = e.target.value;
        if (validarCorreo(correo)) {
            setCorreoEstudiante(correo);
            setCorreoValido(true);
        } else {
            setCorreoEstudiante(correo);
            setCorreoValido(false);
        }
    };

    // Función para buscar un registro de marketing con las variables proporcionadas
    const buscarRegistroProgramarSesiones = async () => {
        try {
            const obtenerregistros = await getProgramarSesiones(); // Obtener todos los registros de marketing
            const registros = obtenerregistros.data;
            // Buscar un registro que coincida con todas las variables
            const registroCoincidente = registros.find(
                (registro) =>
                    registro.docente === docente &&
                    registro.fecha === fecha &&
                    registro.materia === materia &&
                    registro.horaInicio === horaInicio &&
                    registro.horaFin === horaFin &&
                    registro.modalidad === modalidad
            );
            if (registroCoincidente) {
                console.log('ID del registro:', registroCoincidente.id); // Imprimir el ID del registro coincidente
                setRegistroId(registroCoincidente.id)
            } else {
                console.log('No se encontró un registro coincidente.');
            }
        } catch (error) {
            console.error('Error al buscar el registro de programación de sesiones:', error);
        }
    };

    // Invocar la búsqueda en useEffect cuando las variables cambien
    useEffect(() => {
        if (docente && fecha && materia && horaInicio && horaFin && modalidad) {
            buscarRegistroProgramarSesiones();
        }
    }, [docente, fecha, materia, horaInicio, horaFin, modalidad]); // Agregar dependencias para el useEffect


    const handleCantidadParticipantesChange = (e) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value < 2) {
            setErrorCantidadParticipantes('La cantidad debe ser mínimamente de 2 personas');
        } else {
            setErrorCantidadParticipantes('');
        }
        setCantidadParticipantes(isNaN(value) ? '' : value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            nombreEstudiante && correoEstudiante && correoValido &&
            (participacion !== 'Grupal' || (participacion === 'Grupal' && cantidadParticipantes >= 2)) &&
            (temaConsulta !== 'Otro' || (temaConsulta === 'Otro' && detalleTema))
        ) {
            setShowConfirmPopup(true);
        } else {
            setErrorMensaje('Todos los espacios deben ser llenados correctamente');
            setShowPopup(true); // Mostrar el popup en caso de error
        }
    };

    const confirmarReserva = async () => {
        console.log("Formulario listo.")
        if (registroId) {
            try {
                console.log("El id es:", registroId);
                const datosActualizados = {
                    nombreestudiante: nombreEstudiante,
                    carreraestudiante: carrera,
                    semestreestudiante: semestreEstudiante,
                    correoestudiante: correoEstudiante,
                    atencion: participacion,
                    cantidad: participacion === 'Individual' ? 1 : cantidadParticipantes,
                    temaconsulta: temaConsulta,
                    detalletemaconsulta: temaConsulta === 'Otro' ? detalleTema : 'none',
                };
                await editarProgramarSesiones(registroId, datosActualizados); // Llamar a la función para actualizar marketing
                console.log('Registro actualizado exitosamente');
                navigate('/reservasesionesimt');
            } catch (error) {
                console.error('Error al actualizar el registro de programación de sesiones:', error);
            }
        }
    };

    const cerrarPopup = () => {
        setShowPopup(false); // Cerrar el popup
        setErrorMensaje(''); //Limpiar el mensaje de error
    };

    const cancelarConfirmacion = () => {
        setShowConfirmPopup(false); // Cerrar el popup de confirmación
    };

    const formatearHora = (hora) => {
        return hora.slice(0, 5); // Quita los segundos de la hora
    };


    return (
        <>
            {/* Header */}
            <HeaderPage
                header1="Formulario"
                paragraph="Bienvenido al Panel para Agendar su Sesión"
            />

            {/* Formulario de Reserva */}
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1 style={{ fontWeight: 'bold' }}>Formulario</h1>
                <h2>Ingrese sus datos para completar la reserva</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        {/* Nombre del Estudiante */}
                        <div className="form-group" style={{ flex: 1, marginRight: '10px', fontSize: '1.3rem' }}>
                            <label htmlFor="nombreEstudiante">Nombre del Estudiante</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ej: Samuel Jonathan Pasquier Rios"
                                id="nombreEstudiante"
                                value={nombreEstudiante}
                                onChange={(e) => setNombreEstudiante(e.target.value)}
                            />
                        </div>

                        {/* Fecha */}
                        <div className="form-group" style={{ flex: 1, marginLeft: '10px', fontSize: '1.3rem' }}>
                            <label htmlFor="fecha">Fecha</label>
                            <input
                                type="text"
                                className="form-control"
                                id="fecha"
                                value={fecha}
                                readOnly
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        {/* Carrera */}
                        <div className="form-group" style={{ flex: 1, marginRight: '10px', fontSize: '1.3rem' }}>
                            <label htmlFor="carrera">Carrera del Estudiante</label>
                            <select
                                className="form-control"
                                id="carrera"
                                value={carrera}
                                onChange={(e) => setCarrera(e.target.value)}
                            >
                                <option value="[ADM] ADMINISTRACIÓN DE EMPRESAS">[ADM] ADMINISTRACIÓN DE EMPRESAS</option>
                                <option value="[ADT] ADMINISTRACIÓN TURÍSTICA">[ADT] ADMINISTRACIÓN TURÍSTICA</option>
                                <option value="[ARI] ARQUITECTURA DE INTERIORES">[ARI] ARQUITECTURA DE INTERIORES</option>
                                <option value="[ARQ] ARQUITECTURA">[ARQ] ARQUITECTURA</option>
                                <option value="[COM] COMUNICACIÓN SOCIAL">[COM] COMUNICACIÓN SOCIAL</option>
                                <option value="[CPA] CONTADURÍA PÚBLICA">[CPA] CONTADURÍA PÚBLICA</option>
                                <option value="[CPR] CIENCIAS POLÍTICAS Y RELACIONES INTERNACIONALES">[CPR] CIENCIAS POLÍTICAS Y RELACIONES INTERNACIONALES</option>
                                <option value="[DER] DERECHO">[DER] DERECHO</option>
                                <option value="[DGR] DISEÑO GRÁFICO Y COMUNICACIÓN VISUAL">[DGR] DISEÑO GRÁFICO Y COMUNICACIÓN VISUAL</option>
                                <option value="[DIG] DISEÑO DIGITAL">[DIG] DISEÑO DIGITAL</option>
                                <option value="[ECO] ECONOMÍA">[ECO] ECONOMÍA</option>
                                <option value="[EIN] ECONOMÍA E INTELIGENCIA DE NEGOCIOS">[EIN] ECONOMÍA E INTELIGENCIA DE NEGOCIOS</option>
                                <option value="[FYL] FILOSOFÍA Y LETRAS">[FYL] FILOSOFÍA Y LETRAS</option>
                                <option value="[IBB] INGENIERÍA BIOQUÍMICA Y DE BIOPROCESOS">[IBB] INGENIERÍA BIOQUÍMICA Y DE BIOPROCESOS</option>
                                <option value="[ICO] INGENIERÍA COMERCIAL">[ICO] INGENIERÍA COMERCIAL</option>
                                <option value="[IIE] INGENIERÍA EN INNOVACIÓN EMPRESARIAL">[IIE] INGENIERÍA EN INNOVACIÓN EMPRESARIAL</option>
                                <option value="[IMA] INGENIERÍA AMBIENTAL">[IMA] INGENIERÍA AMBIENTAL</option>
                                <option value="[IMT] INGENIERÍA MECATRÓNICA">[IMT] INGENIERÍA MECATRÓNICA</option>
                                <option value="[INB] INGENIERÍA BIOMÉDICA">[INB] INGENIERÍA BIOMÉDICA</option>
                                <option value="[INC] INGENIERÍA CIVIL">[INC] INGENIERÍA CIVIL</option>
                                <option value="[IND] INGENIERÍA INDUSTRIAL">[IND] INGENIERÍA INDUSTRIAL</option>
                                <option value="[INS] INGENIERÍA DE SISTEMAS">[INS] INGENIERÍA DE SISTEMAS</option>
                                <option value="[INT] INGENIERÍA EN TELECOMUNICACIONES">[INT] INGENIERÍA EN TELECOMUNICACIONES</option>
                                <option value="[IMQ] INGENIERÍA QUÍMICA">[IMQ] INGENIERÍA QUÍMICA</option>
                                <option value="[ISE] INTERSEDES">[ISE] INTERSEDES</option>
                                <option value="[MKD] MARKETING Y MEDIOS DIGITALES">[MKD] MARKETING Y MEDIOS DIGITALES</option>
                                <option value="[PSI] PSICOLOGÍA">[PSI] PSICOLOGÍA</option>
                                <option value="[PSP] PSICOPEDAGOGÍA">[PSP] PSICOPEDAGOGÍA</option>
                                <option value="[MED] MEDICINA">[MED] MEDICINA</option>
                            </select>
                        </div>

                        {/* Asignatura */}
                        <div className="form-group" style={{ flex: 1, marginLeft: '10px', fontSize: '1.3rem' }}>
                            <label htmlFor="asignatura">Asignatura</label>
                            <input
                                type="text"
                                className="form-control"
                                id="asignatura"
                                value={materia}
                                readOnly
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        {/* Correo del Estudiante */}
                        <div className="form-group" style={{ flex: 1, marginRight: '10px', fontSize: '1.3rem' }}>
                            <label htmlFor="correoEstudiante">Correo del Estudiante</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Ingrese su correo institucional: example@ucb.edu.bo"
                                id="correoEstudiante"
                                value={correoEstudiante}
                                onChange={handleCorreoChange}
                            />
                            {!correoValido && (
                                <div style={{ color: 'red', fontSize: '1rem' }}>Correo no válido. Debe ser example@ucb.edu.bo</div>
                            )}
                        </div>

                        {/* Horario */}
                        <div className="form-group" style={{ flex: 1, marginLeft: '10px', fontSize: '1.3rem' }}>
                            <label htmlFor="horario">Horario</label>
                            <input
                                type="text"
                                className="form-control"
                                id="horario"
                                value={`${formatearHora(horaInicio)} - ${formatearHora(horaFin)}`}
                                readOnly
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        {/* Semestre del Estudiante */}
                        <div className="form-group" style={{ flex: 1, marginRight: '10px', fontSize: '1.3rem' }}>
                            <label htmlFor="semestreEstudiante">Semestre del Estudiante</label>
                            <select
                                className="form-control"
                                id="semestre"
                                value={semestreEstudiante}
                                onChange={(e) => setSemestreEstudiante(e.target.value)}
                            >
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
                            </select>
                        </div>

                        {/* Docente */}
                        <div className="form-group" style={{ flex: 1, marginLeft: '10px', fontSize: '1.3rem' }}>
                            <label htmlFor="docente">Docente</label>
                            <input
                                type="text"
                                className="form-control"
                                id="docente"
                                value={docente}
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Participación */}
                    <div className="form-group" style={{ marginBottom: '20px', fontSize: '1.3rem' }}>
                        <label htmlFor="participantes">Cantidad de Participantes</label>
                        <select
                            className="form-control"
                            id="participantes"
                            value={participacion}
                            onChange={(e) => setParticipacion(e.target.value)}
                        >
                            <option value="Individual">Individual</option>
                            <option value="Grupal">Grupal</option>
                        </select>
                        {participacion === 'Grupal' && (
                            <>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="cantidadParticipantes"
                                    value={cantidadParticipantes}
                                    onChange={handleCantidadParticipantesChange}
                                    placeholder="Ingrese la cantidad de participantes que asistirán a la sesión (Mínimamente 2 personas)"
                                    style={{ marginTop: '10px' }}
                                />
                                {errorCantidadParticipantes && (
                                    <div style={{ color: 'red', marginTop: '5px' }}>
                                        {errorCantidadParticipantes}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Tema de Consulta */}
                    <div className="form-group" style={{ marginBottom: '20px', fontSize: '1.3rem' }}>
                        <label htmlFor="temaConsulta">Tema de Consulta</label>
                        <select
                            className="form-control"
                            id="temaConsulta"
                            value={temaConsulta}
                            onChange={(e) => setTemaConsulta(e.target.value)}
                        >
                            <option value="Tema específico de la materia">Tema específico de la materia</option>
                            <option value="Tema particular">Tema particular</option>
                            <option value="Tema personal">Tema personal</option>
                            <option value="Otro">Otro</option>
                        </select>
                        {temaConsulta === 'Otro' && (
                            <textarea
                                className="form-control"
                                id="detalleTema"
                                placeholder="Ingrese los detalles respecto al tema de consulta"
                                rows="3"
                                value={detalleTema}
                                onChange={(e) => setDetalleTema(e.target.value)}
                                style={{ marginTop: '10px' }}
                            />
                        )}
                    </div>

                    {/* Botón para Reservar */}
                    <div style={{ textAlign: 'center' }}>
                        <button type="submit" className="btn btn-primary">
                            Reservar
                        </button>
                    </div>
                </form>
            </div>
            {/* Popup de error */}
            {showPopup && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '5px',
                            textAlign: 'center',
                        }}
                    >
                        <p>{errorMensaje}</p>
                        <button onClick={cerrarPopup} className="btn btn-secondary">
                            Entendido
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmación */}
            {showConfirmPopup && (
                <div
                    style={{
                        position: 'fixed',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '20px',
                            borderRadius: '5px',
                            textAlign: 'center',
                        }}
                    >
                        <h2>Confirmar Reserva</h2>
                        <p>¿Está seguro que desea confirmar la reserva?</p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                            <button onClick={confirmarReserva} style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
                                Confirmar
                            </button>
                            <button onClick={cancelarConfirmacion} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}