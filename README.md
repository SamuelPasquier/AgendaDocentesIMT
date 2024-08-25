Front-end (React js)

CrearUsuarios.jsx

Resumen General
El componente CrearUsuarios.jsx es una página destinada a la creación de cuentas de usuario para docentes. Utiliza un formulario con varios campos obligatorios como nombre, celular, correo, contraseña y categoría del docente. La validación de estos campos se maneja mediante react-hook-form, y los datos se envían a una API para crear el usuario en la base de datos.

Descripción Detallada 
CrearUsuarios.jsx Este componente permite la creación de usuarios para docentes dentro de la aplicación. Utiliza la biblioteca react-hook-form para gestionar y validar el formulario. El formulario incluye los siguientes campos:

Nombre del Docente: Campo de texto para ingresar el nombre completo del docente. Este campo es obligatorio.
Celular: Campo de tipo teléfono para ingresar el número de celular del docente. Este campo es obligatorio.
Correo Institucional: Campo de tipo correo electrónico para ingresar el correo institucional del docente. Este campo es obligatorio.
Contraseña: Campo de tipo contraseña para establecer la contraseña del docente. Este campo es obligatorio.
Categoría: Un campo de selección (dropdown) donde el usuario debe elegir la categoría del docente, que puede ser "Director de Carrera", "Docente Tiempo Completo", "Docente Tiempo Horario" o "Marketing". Este campo también es obligatorio.
El formulario se envía a través del método onSubmit, que utiliza la función handleSubmit de react-hook-form para validar y manejar el envío de datos. Una vez que los datos son validados, se envían a la función crearUsersDocentes, que realiza la llamada a la API para crear el usuario en la base de datos.

Estructura del Componente:

Header: Un encabezado con un título y una breve descripción de la página.
Navbar: Barra de navegación con un enlace para iniciar sesión.
Formulario: Un formulario centrado dentro de un contenedor, estilizado con react-bootstrap, que incluye campos obligatorios con validación en el cliente. Si un campo no es llenado correctamente, se muestra un mensaje de error en rojo.
Funcionamiento:

El usuario ingresa la información requerida en el formulario.
Al enviar el formulario, se validan los datos. Si hay errores, se muestran alertas específicas para cada campo.
Si los datos son válidos, se realiza una solicitud a la API para crear el usuario.
Si la creación es exitosa, el usuario es redirigido a la página de inicio de sesión.



DocenteRegistroSesiones.jsx:

Resumen General:
El componente DocentesRegistroSesiones es una página para que los docentes puedan registrar sus sesiones con los estudiantes. Permite a los docentes seleccionar un departamento, materia, modalidad de la sesión (presencial o virtual), días de la semana, horarios, y otros detalles relacionados con las sesiones. La información se envía a una API para crear sesiones en la base de datos. Además, incluye lógica para la validación de formularios, manejo de sesiones basadas en intervalos de tiempo, y cálculos de fechas basados en el semestre seleccionado. También cuenta con redirección condicional según el tipo de docente, y ofrece un menú de navegación y opciones de cierre de sesión.

Descripción Detallada:
Estado y Variables:

Estados Principales:
nombreDocente y tipoDocente: Almacenan el nombre y el tipo del docente actualmente logueado.
materiasFiltradas y departamentosMaterias: Manejan la lista de materias filtradas por departamento.
mostrarDivision, modalidad, ambiente, y alerta: Controlan la visibilidad de elementos de la UI, selección de modalidades, y mensajes de alerta.
horaInicio, horaFin, intervalo, mensajeTiempoSobrante: Manejan y calculan las sesiones basadas en horarios e intervalos.
Ciclo de Vida:

useEffect: Se usa para:
Cargar el usuario logueado desde el localStorage y setear los estados nombreDocente y tipoDocente.
Llamar a la función cargarMaterias para obtener los departamentos y materias desde la base de datos.
Filtrar materias según el departamento seleccionado.
Mostrar u ocultar la división de horarios basada en la selección de horas.
Funciones Principales:

cargarMaterias: Obtiene departamentos y materias desde la base de datos y los organiza en un objeto de departamentos que se almacena en departamentosMaterias.
dividirHoras: Divide el tiempo entre horaInicio y horaFin en intervalos específicos, generando sesiones múltiples si es necesario.
calcularFechas: Calcula y retorna una lista de fechas dentro del semestre seleccionado para los días de la semana que el docente ha elegido.
onSubmit: Envía los datos del formulario para crear las sesiones en la base de datos. Realiza validaciones adicionales para asegurarse de que todos los campos necesarios están completos y calcula las fechas y horarios de las sesiones.
Interfaz de Usuario:

Formulario de Registro: Incluye selección de departamentos, materias, modalidad (presencial o virtual), horarios, y otros detalles relevantes para las sesiones.
Navbar y Dropdown: Proveen navegación y opciones de gestión según el tipo de docente. Incluye un botón para cerrar sesión.
Validación y Alerta:

handleGuardar: Verifica que todos los campos obligatorios del formulario estén completos antes de permitir que el formulario se envíe. Muestra un mensaje de alerta si faltan campos.
Condicionales:

Redirección según el tipo de docente: Si el tipo de docente es "Marketing", el componente renderiza el componente Marketing. Si es otro tipo, muestra las opciones de registro de sesiones.



EstudiantesSesionesReserva.jsx:

El componente EstudiantesSesionesReserva.jsx permite a los estudiantes reservar sesiones con docentes en base a ciertos criterios de filtrado como departamento, materia y fecha. Utiliza React Bootstrap para el diseño de la interfaz y React Router para la navegación. El componente gestiona el estado de las sesiones, los departamentos, las materias, y la interacción con un modal para confirmar reservas. Además, filtra y muestra las sesiones disponibles en una tabla, proporcionando opciones para que los estudiantes seleccionen y reserven sesiones específicas.

Descripción Detallada:
Importaciones y Configuración Inicial:

Importa varias bibliotecas y componentes, como React, useState, useEffect, Table, Button, Container, Row, Col, Modal, y Form de react-bootstrap, así como HeaderPage y funciones de la API (getProgramarSesiones, getMateria).
Inicializa estados para manejar sesiones, departamentos, materias, el departamento y la materia seleccionados, la fecha seleccionada, y el control del modal.
Carga de Datos (useEffect):

Utiliza useEffect para cargar las sesiones y materias desde la base de datos al montar el componente. Los datos de las materias se usan para derivar los departamentos disponibles.
Filtrado de Sesiones:

Filtra las sesiones en base a los departamentos, materias y fechas seleccionados por el usuario, asegurando que solo las sesiones aceptadas se muestren en la tabla.
Generación de Descripciones:

La función generarDescripcion crea una descripción detallada para cada sesión, dependiendo de su modalidad (virtual, presencial, ambos) y otros detalles como la plataforma y el ambiente, utilizando etiquetas HTML para formatear el texto.
Manejo de Eventos:

Varias funciones manejan eventos de interacción del usuario, como handleReservaClick para abrir el modal de confirmación de reserva, handleClose para cerrar el modal, handleConfirmar para confirmar la reserva y redirigir al formulario de sesión, y funciones para manejar cambios en los filtros (departamento, materia, fecha).



FormularioReserva.jsx:
Resumen General
El componente FormularioReserva es un formulario que permite a los estudiantes reservar sesiones con docentes. Recoge detalles como el nombre del estudiante, carrera, semestre, correo, materia, y horario. El formulario incluye validaciones para campos como el correo electrónico institucional y la cantidad de participantes, mostrando mensajes de error si los datos no cumplen con los criterios. Además, interactúa con una API para buscar y editar registros de sesiones programadas basándose en la información proporcionada.

Descripción Detallada
Importaciones y Dependencias:

Se importan módulos como React, useState, useEffect, HeaderPage, y herramientas de navegación (useLocation, useNavigate).
Se importan funciones de la API (getProgramarSesiones, editarProgramarSesiones) para manejar la obtención y edición de datos.
Estados Iniciales:

participacion, temaConsulta, nombreEstudiante, carrera, correoEstudiante, semestreEstudiante, detalleTema, cantidadParticipantes, errorCantidadParticipantes, errorMensaje, showPopup, showConfirmPopup, registroId, correoValido: Múltiples estados para manejar los valores y validaciones de los campos del formulario, la visibilidad de popups y errores.
Funciones Principales:

validarCorreo: Valida que el correo del estudiante siga el formato institucional requerido (@ucb.edu.bo).
handleCorreoChange: Actualiza el estado del correo electrónico y valida si cumple con el formato correcto.
buscarRegistroProgramarSesiones: Busca en la API un registro de sesión programada que coincida con los datos del docente, fecha, materia, hora de inicio y fin, y modalidad.
handleCantidadParticipantesChange: Maneja la validación y actualización del número de participantes en la sesión.
handleSubmit: Maneja el envío del formulario, verificando que todos los campos sean válidos antes de permitir la reserva.
confirmarReserva: Si se encuentra un registroId, actualiza el registro con los datos del formulario en la API.
cerrarPopup y cancelarConfirmacion: Cierran los popups de error y confirmación respectivamente.
formatearHora: Formatea las horas de inicio y fin para quitar los segundos.
Ciclo de Vida (useEffect):

El useEffect se utiliza para buscar el registro de programación de sesiones al montar el componente, o cuando cambian las dependencias (docente, fecha, materia, horaInicio, horaFin, modalidad).
Renderización:

Se utiliza HeaderPage para mostrar un encabezado en la parte superior del formulario.
El formulario contiene múltiples entradas (input, select) para recoger los datos necesarios.
El diseño utiliza CSS en línea para la disposición de los elementos del formulario, asegurando un diseño limpio y estructurado.
Mensajes de error y popups son mostrados cuando los datos ingresados no cumplen con las validaciones necesarias.



GestionSesiones.jsx:
Resumen General:
El archivo GestionSesiones.jsx se encarga de gestionar sesiones programadas por docentes en una plataforma educativa. Este componente permite a los administradores o coordinadores ver las sesiones programadas, aceptarlas o rechazarlas, y proporcionar comentarios. También incluye funcionalidades para redirigir a otras partes de la aplicación, como el registro de sesiones, las sesiones existentes y el historial de sesiones.

Descripción Detallada:
Importaciones y Hooks:

Se importan varios módulos de React, Bootstrap, y otros componentes específicos como HeaderPage y funciones API para gestionar las sesiones.
Se utilizan hooks como useState y useEffect para manejar estados y efectos secundarios en el componente, como la obtención de datos de las sesiones y la gestión de redireccionamientos.
Estados:

nombreDocente: Almacena el nombre del docente actualmente logueado.
sesiones: Almacena las sesiones obtenidas de la base de datos, organizadas y resumidas.
mostrarComentarios: Controla la visualización de la sección de comentarios para una sesión específica.
comentarios: Almacena los comentarios ingresados por el usuario cuando rechaza una sesión.
Efecto Principal:

Se ejecuta al montar el componente para verificar si un usuario está logueado. Si no lo está, redirige a la página de login.
Si el usuario está logueado, se obtiene su nombre y se recuperan las sesiones desde la base de datos, agrupándolas y resumiéndolas.
Funciones Principales:

resumirSesiones: Agrupa sesiones similares en una sola entrada, basándose en varias propiedades como nombre, departamento, materia, día, hora, modalidad, plataforma, ambiente y detalle.
generarDescripcion: Crea descripciones detalladas para cada sesión según la modalidad (virtual, presencial o ambos) y otras características.
formatearHora: Elimina los segundos de las horas para mostrarlas de forma simplificada.
handleAceptarSesion: Acepta una sesión, crea un registro en la base de datos y elimina la sesión original.
handleRechazar: Muestra el campo de comentarios para la sesión seleccionada.
handleEnviarComentarios: Rechaza una sesión, crea un registro en la base de datos, elimina la sesión original y envía un email con los comentarios ingresados.
enviar_email: Envía un correo electrónico con detalles de la sesión rechazada.
Renderización:

El componente renderiza un encabezado y una barra de navegación.
Muestra una tabla donde se listan las sesiones, con columnas para docente, departamento, materia, día, modalidad, horario, descripción, y gestión.
Cada fila de la tabla incluye botones para aceptar o rechazar la sesión, y si se rechaza, se muestra un campo para ingresar comentarios.

NOTA: SE RECOMIENDA IMPLEMENTAR UNA NUEVA CUENTA (CAMBIAR LA CUENTA YA ESTABLECIDA EN EL CÓDIGO CON SUS CREDENCIALES) PARA EL ENVÍO DE CORREOS MASIVO, DEBIDO A QUE ESTÁ ES UNA CUENTA PERSONAL Y NO ASÍ UNA CUENTA DE LA EMPRESA.

Vídeo guía para la implementación de cuenta:
https://youtu.be/SscmIl9IqDc?si=276PpqAfIv-yGoKz

Zona de cambio: 
emailjs.send('service_j9sn34j', 'template_wagxyje', templateParams, 'dUaV50NFvylrR7xn1')
      .then(() => {
        console.log('SUCCESS!');
      }, (error) => {
        console.log('FAILED...', error.text);
      });


HistorialSesiones.jsx:
Resumen General
HistorialSesiones.jsx permite a los docentes ver y gestionar el historial de sesiones. Los usuarios pueden filtrar las sesiones por departamento y materia, visualizar los datos en una tabla y descargar un informe en formato PDF con la información de las sesiones. El componente maneja la autenticación del usuario, muestra un encabezado personalizado y permite la navegación entre diferentes secciones de la aplicación.

Descripción Detallada
Importaciones:

Se importan componentes y funciones necesarias desde bibliotecas como React, react-bootstrap, y otras utilidades (por ejemplo, jsPDF y html-to-text).
Estado y Efectos:

useState se utiliza para manejar el estado de los filtros y los datos de sesiones.
useEffect se emplea para autenticar al usuario al cargar el componente y para obtener los datos del historial de sesiones. También extrae los departamentos y materias únicos para los filtros.
Funcionalidades Principales:

Autenticación y Datos del Usuario:

El componente verifica si el usuario está logueado y, si no lo está, redirige a la página de login.
Extrae la información del usuario del localStorage para mostrar el nombre y tipo de docente en el encabezado.
Generación de Descripciones:

La función generarDescripcion crea una descripción detallada para cada sesión basada en su modalidad, plataforma y ambiente. Usa HTML para formatear el texto.
Generación de PDF:

La función downloadPDF crea un archivo PDF usando jsPDF y autoTable. La tabla en el PDF se divide en dos partes: la primera con información general de las sesiones y la segunda con detalles específicos sobre los estudiantes.
Manejo de Horario:

La función formatearHora ajusta el formato de la hora eliminando los segundos.
Navegación y Logout:

Funciones como handleLogout, handleRegistro, handleSesiones, y handleGestionSesiones permiten al usuario navegar entre diferentes páginas de la aplicación y cerrar sesión.
Interfaz de Usuario:

Encabezado y Navbar:

Se utiliza un encabezado personalizado (HeaderPage) y una barra de navegación (Navbar) que muestra el nombre del docente y opciones adicionales dependiendo del tipo de usuario.
Filtros:

Se proporciona un formulario con filtros para seleccionar el departamento y la materia. Estos filtros afectan la visualización de los datos en la tabla.
Tabla de Datos:

La tabla muestra información sobre las sesiones y estudiantes. Se aplica un filtro para mostrar solo los datos relevantes según las selecciones de filtro.
Botón de Descargar PDF:

Un botón permite al usuario descargar la información filtrada como un archivo PDF.



Login.jsx:
Resumen General
Login.jsx presenta una interfaz de inicio de sesión para docentes. Utiliza react-bootstrap para los estilos y la estructura, y react-router-dom para la navegación. El formulario permite a los usuarios ingresar su correo y contraseña para autenticarse. En caso de éxito, redirige al usuario a la página de sesiones; en caso contrario, muestra un mensaje de error.

Descripción Detallada
Importaciones:

Importa varios componentes de react-bootstrap como Container, Form, Button, Card, Alert, Navbar, y Nav.
Importa useNavigate desde react-router-dom para manejar la navegación.
Importa HeaderPage para mostrar un encabezado personalizado.
Importa getUsersDocentes desde ../api/tasks.api.js para obtener los datos de los usuarios docentes.
Estado:

correo: Almacena el correo electrónico ingresado por el usuario.
password: Almacena la contraseña ingresada por el usuario.
error: Almacena mensajes de error relacionados con el inicio de sesión.
Funciones:

handleLogin: Maneja el evento de envío del formulario. Verifica las credenciales del usuario contra los datos obtenidos de getUsersDocentes. Si las credenciales son correctas, almacena los datos del usuario en localStorage y redirige a la página de sesiones. Si son incorrectas o hay un error, muestra un mensaje adecuado.
Renderizado:

Encabezado: Muestra un encabezado con el componente HeaderPage que da la bienvenida al usuario y le solicita ingresar sus credenciales.
Formulario de Inicio de Sesión:
Card: Utiliza un Card de Bootstrap para mostrar el formulario de inicio de sesión de manera estilizada.
Form: Contiene dos campos, uno para el correo (correo) y otro para la contraseña (password). Ambos campos son requeridos.
Alert: Muestra un mensaje de error si las credenciales son incorrectas o si ocurre un error durante la autenticación.
Button: Un botón para enviar el formulario y realizar el inicio de sesión.
Enlace de Registro: Ofrece un enlace para crear una cuenta si el usuario no tiene una.



Marketing.jsx:
Resumen General
Marketing.jsx muestra una tabla con información de horarios de docentes y proporciona opciones para filtrar los datos por departamento y materia. Permite descargar la tabla en formato PDF. Utiliza react-bootstrap para el diseño y estilo, jsPDF para generar PDFs, y react-router-dom para la navegación. El componente también gestiona el estado de autenticación del usuario y proporciona una opción para cerrar sesión.

Descripción Detallada
Importaciones:

Importa varios componentes de react-bootstrap como Nav, Navbar, Dropdown, Table, Button, y Form.
Importa HeaderPage para mostrar el encabezado de la página.
Importa useNavigate desde react-router-dom para la navegación.
Importa getMarketing desde ../api/tasks.api.js para obtener datos de marketing.
Importa jsPDF y jspdf-autotable para la generación de PDFs.
Importa htmlToText desde html-to-text (aunque no se utiliza en este componente).
Estado:

nombreDocente: Almacena el nombre del docente logueado.
marketingData: Almacena los datos de marketing obtenidos de la API.
departamentoFiltro: Almacena el valor seleccionado para filtrar por departamento.
materiaFiltro: Almacena el valor seleccionado para filtrar por materia.
departamentos: Almacena una lista única de departamentos para los filtros.
materias: Almacena una lista única de materias para los filtros.
Efectos:

useEffect: Verifica si hay un usuario logueado. Si no hay, redirige al login. Si hay, obtiene los datos de marketing y configura los filtros para departamentos y materias.
Funciones:

downloadPDF: Genera un archivo PDF con los datos filtrados. Utiliza jsPDF y autoTable para crear la tabla en el PDF. Configura las columnas y el formato de la tabla, y guarda el archivo PDF.
formatearHora: Formatea la hora para que solo muestre los primeros cinco caracteres (hora
).
handleLogout: Elimina la información del usuario del localStorage y redirige a la página de login.
Renderizado:

Header: Muestra el encabezado de la página usando HeaderPage.
Navbar: Muestra una barra de navegación con el nombre del docente y un enlace para cerrar sesión.
Filtros: Permite seleccionar filtros para departamento y materia. Actualiza los estados correspondientes para aplicar los filtros a la tabla.
Table: Muestra una tabla con los datos de marketing filtrados por departamento y materia. Incluye columnas para ID, docente, tipo de docente, departamento, materia, día y horario.
Button: Proporciona un botón para descargar la tabla en formato PDF.



Sesiones.jsx:
Resumen General
El componente Sesiones.jsx es una interfaz para gestionar las sesiones programadas por estudiantes. Permite a los docentes aceptar o rechazar sesiones, agregar comentarios, y enviar notificaciones por correo electrónico. También se encarga de mostrar las sesiones en una tabla y manejar la navegación entre diferentes vistas de la aplicación. La funcionalidad principal incluye la visualización de sesiones, la gestión de comentarios, el envío de correos electrónicos de confirmación o rechazo, y la actualización de la base de datos correspondiente.

Descripción Detallada
Dependencias y Estados Iniciales:

Usa React, react-bootstrap, react-router-dom, emailjs, y funciones de una API personalizada.
Mantiene estados para los datos del docente, la lista de sesiones, y la visibilidad de formularios de aceptación/rechazo.
Efectos (useEffect):

Primer useEffect: Verifica si el usuario está logueado y redirige según el tipo de docente (si es Marketing, se redirige a /marketing).
Segundo useEffect: Obtiene las sesiones programadas y filtra según el estado y el docente logueado.
Funciones Auxiliares:

generarDescripcion: Crea una descripción HTML para cada sesión dependiendo de su modalidad (virtual, presencial, o ambos) y otros detalles.
formatearHora: Formatea la hora para eliminar los segundos.
enviar_email: Envía un correo electrónico con detalles sobre la sesión utilizando emailjs.
removeHtmlTags: Elimina etiquetas HTML de una cadena de texto.
handleEnviarYAgendarSesion y handleRechazarYEliminar: Manejan la confirmación y rechazo de sesiones, respectivamente. Actualizan el estado de la sesión y envían correos electrónicos con los comentarios del docente. También actualizan la base de datos y realizan otras acciones como actualizar el historial y recargar la página.
handleEliminar: Elimina una sesión específica de la base de datos y recarga la página.
Manejo de Eventos:

Navegación: Funciones para manejar la navegación entre vistas, incluyendo el cierre de sesión y la redirección a diferentes componentes según el tipo de docente.
Gestión de Sesiones: Funciones para aceptar o rechazar sesiones, manejar los comentarios y enviar correos electrónicos.
Renderizado:

Header y Navbar: Muestra un encabezado y una barra de navegación con enlaces para gestionar sesiones, registro de sesiones y cierre de sesión.
Tabla de Sesiones: Muestra una tabla con detalles de las sesiones programadas. Incluye botones para aceptar o rechazar sesiones. Los formularios para agregar comentarios se muestran según el estado de la sesión.
Formularios de Comentarios:

Aceptar Sesión: Muestra un formulario para ingresar comentarios adicionales y un checkbox para indicar si no se desea agregar comentarios.
Rechazar Sesión: Muestra un formulario similar para ingresar comentarios sobre el rechazo de la sesión.

NOTA: SE RECOMIENDA IMPLEMENTAR UNA NUEVA CUENTA (CAMBIAR LA CUENTA YA ESTABLECIDA EN EL CÓDIGO CON SUS CREDENCIALES) PARA EL ENVÍO DE CORREOS MASIVO, DEBIDO A QUE ESTÁ ES UNA CUENTA PERSONAL Y NO ASÍ UNA CUENTA DE LA EMPRESA.

Vídeo guía para la implementación de cuenta:
https://youtu.be/SscmIl9IqDc?si=276PpqAfIv-yGoKz

Zona de cambio: 
emailjs.send('service_j9sn34j', 'template_wagxyje', templateParams, 'dUaV50NFvylrR7xn1')
      .then(() => {
        console.log('SUCCESS!');
      }, (error) => {
        console.log('FAILED...', error.text);
      });



main.jsx:
Resumen General
El archivo main.jsx es el punto de entrada. En él, se configuran las rutas de la aplicación utilizando react-router-dom, permitiendo la navegación entre diferentes componentes basados en las URLs. Además, se incluye una ruta privada que protege ciertas páginas y redirige a los usuarios no autenticados a la página de inicio de sesión. La aplicación está envuelta en el componente BrowserRouter para gestionar la navegación y en React.StrictMode para activar advertencias adicionales durante el desarrollo.

Descripción Detallada
Importaciones:

Se importan las dependencias necesarias para el enrutamiento (BrowserRouter, Routes, Route, Navigate) y los componentes de las diferentes páginas.
Componente PrivateRoute:

Este componente es una función que toma un componente (Component) como propiedad. Verifica si el usuario está autenticado consultando localStorage. Si el usuario está autenticado, renderiza el componente correspondiente; de lo contrario, redirige al usuario a la página de inicio de sesión (/login).
Creación del Root:

ReactDOM.createRoot se utiliza para renderizar la aplicación en el elemento con el id root del DOM.
Renderizado de la Aplicación:

Se envuelve la aplicación en React.StrictMode para detectar posibles problemas en el desarrollo.
Se utiliza BrowserRouter para manejar las rutas de la aplicación.
Se definen las rutas dentro del componente Routes:
/createusers: Renderiza el componente CrearUsuarios.
/login: Renderiza el componente Login.
/docentes_registro_sesiones: Utiliza el componente PrivateRoute para proteger esta ruta y renderiza DocentesRegistroSesiones si el usuario está autenticado.
/sesiones: Utiliza el componente PrivateRoute para proteger esta ruta y renderiza Sesiones si el usuario está autenticado.
/gestionsesiones: Utiliza el componente PrivateRoute para proteger esta ruta y renderiza GestionSesiones si el usuario está autenticado.
/reservasesionesimt: Renderiza el componente EstudiantesSesionesReserva.
/formulariosesionesimt: Renderiza el componente FormularioReserva.
/marketing: Renderiza el componente Marketing.
/historialsesionesimt: Renderiza el componente HistorialSesiones.



COMPONENTS
HeaderPage.jsx:
Resumen General
HeaderPage.jsx define un componente funcional en React llamado HeaderPage que se encarga de renderizar una cabecera (header) de la página con un logo y un título. Utiliza react-bootstrap para el diseño y la disposición de los elementos. Los props header1 y paragraph se pasan al componente para personalizar el contenido del título y el párrafo en la cabecera.

Descripción Detallada
Importaciones:

Container, Row, y Col se importan de react-bootstrap para la disposición del diseño en la cabecera.
PropTypes se importa para la validación de los props que recibe el componente.
Componente HeaderPage:

Props:
header1: Título principal que se mostrará en la cabecera.
paragraph: Texto adicional que se mostrará en la cabecera.
Estructura:
El componente retorna un header con clases para el estilo: bg-dark (fondo oscuro), text-white (texto blanco), y py-3 (espaciado vertical).
Dentro del header, se utiliza Container de react-bootstrap para establecer un contenedor fluido.
Dentro del Container, un Row se usa para organizar el contenido horizontalmente:
El primer Col contiene una imagen (logo) con una altura específica de 180px.
El segundo Col contiene un título (h1) y un párrafo (p), ambos centrados (center).
Validación de Props:

Se utilizan PropTypes para asegurar que ambos header1 y paragraph sean cadenas de texto (string) y sean requeridos (isRequired). Esto ayuda a garantizar que el componente reciba las propiedades necesarias para su correcta renderización.



API
tasks.api.js:
Resumen General
tasks.api.js configura y exporta varias funciones para interactuar con una API de backend utilizando axios. Estas funciones están diseñadas para manejar operaciones CRUD (crear, leer, actualizar, eliminar) para diferentes recursos relacionados con docentes, sesiones, y otras entidades como historial y marketing.

Descripción Detallada
Configuración de Axios:

Se crea una instancia de axios llamada docenteApi con una baseURL configurada a 'http://localhost:8000/users/'. Esto establece la URL base para todas las solicitudes realizadas con esta instancia.
Funciones Exportadas:

Usuarios Docentes:

getUsersDocentes: Realiza una solicitud GET a /docente/ para obtener datos de los docentes.
crearUsersDocentes: Realiza una solicitud POST a /docente/ para enviar datos de un nuevo usuario docente (dataUserDocente).
Sesiones:

getSesiones: Realiza una solicitud GET a /sesion/ para obtener información sobre las sesiones.
crearSesiones: Realiza una solicitud POST a /sesion/ para enviar datos sobre una nueva sesión (dataSesiones).
deleteSesiones: Realiza una solicitud DELETE a /sesion/{id} para eliminar una sesión específica por su ID.
Programar Sesiones:

getProgramarSesiones: Realiza una solicitud GET a /programarsesiones/ para obtener información sobre las sesiones programadas.
crearProgramarSesiones: Realiza una solicitud POST a /programarsesiones/ para enviar datos sobre una nueva sesión programada (dataProgramarSesiones).
editarProgramarSesiones: Realiza una solicitud PATCH a /programarsesiones/{id}/ para actualizar los datos de una sesión programada específica.
deleteProgramarSesiones: Realiza una solicitud DELETE a /programarsesiones/{id} para eliminar una sesión programada específica.
Historial:

getHistorial: Realiza una solicitud GET a /historial/ para obtener el historial.
crearHistorial: Realiza una solicitud POST a /historial/ para enviar datos sobre un nuevo historial (dataHistorial).
Materia:

getMateria: Realiza una solicitud GET a /materia/ para obtener información sobre las materias.
Marketing:

getMarketing: Realiza una solicitud GET a /marketing/ para obtener información relacionada con marketing.
crearMarketing: Realiza una solicitud POST a /marketing/ para enviar datos relacionados con marketing (dataMarketing).