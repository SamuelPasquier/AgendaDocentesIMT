import React, { useState, useEffect } from 'react';
import { Nav, Navbar, Dropdown, Table, Button, Form } from 'react-bootstrap';
import { HeaderPage } from '../components/HeaderPage.jsx';
import { useNavigate } from 'react-router-dom';
import { getMarketing } from '../api/tasks.api.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { htmlToText } from 'html-to-text';

export const Marketing = () => {
  const navigate = useNavigate();

  const [nombreDocente, setNombreDocente] = useState('');
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
    }

    const fetchData = async () => {
      try {
        const response = await getMarketing();
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
      { header: 'Horario', dataKey: 'horario' },
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
        horario: `${formatearHora(item.horaInicio)} - ${formatearHora(item.horaFin)}`,
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

    doc.save('tabla-marketing.pdf');
  };



  const formatearHora = (hora) => {
    return hora.slice(0, 5); // Quita los segundos de la hora
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    navigate('/login');
  };
  return (
    <>
      {/* Header */}
      <HeaderPage
        header1="Marketing"
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
        <h1 className="text-center mt-4" style={{ fontSize: '3.3rem', fontWeight: 'bold' }}>Horarios de Docentes</h1>
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
                <th>Horario</th>
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
                    <td>{`${formatearHora(item.horaInicio)} - ${formatearHora(item.horaFin)}`}</td>
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
