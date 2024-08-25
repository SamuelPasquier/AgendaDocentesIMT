import React from 'react';
import { Container, Form, Button, Card, Alert, Navbar, Nav } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { HeaderPage } from '../components/HeaderPage.jsx';
import { crearUsersDocentes } from '../api/tasks.api.js';
import { useNavigate } from 'react-router-dom';
export const CrearUsuarios = () => {
    const { register, handleSubmit, formState: {
        errors
    } } = useForm();
    const navigate = useNavigate();
    const onSubmit = handleSubmit(async data => {
        try {
            const res = await crearUsersDocentes(data);
            console.log("Usuario creado:", res);
            navigate('/login');
            // Refrescar la página después de crear el usuario
        } catch (error) {
            console.error("Error al crear usuario:", error);
        }
    })
    return (
        <>
            {/* Header */}
            <HeaderPage
                header1="Creación de Usuarios"
                paragraph="Bienvenido al Panel para Crear su Usuario"
            />
            {/* Navbar */}
            <Navbar variant="light" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        <Nav.Link href="/login" style={{ color: 'rgba(0,0,0,1)', fontSize: '600', fontWeight: '700', paddingRight: '100px' }}>Iniciar Sesión</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {/* Formulario */}
            <Container className="d-flex justify-content-center mt-4">
                <Card style={{ width: '35rem', padding: '1rem', boxShadow: '0 4px 8px rgba(0,0,0,0.8)', borderRadius: '30px' }}>
                    <Card.Body>
                        <Form onSubmit={onSubmit}>
                            <Form.Group controlId="formNombre" className="mb-3">
                                <Form.Label>Nombre del Docente</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese su Nombre Completo"
                                    {...register("nombre", { required: true })}
                                />
                                {errors.nombre && <Alert style={{ color: 'red', backgroundColor: 'rgba(255,0,0,0.2)', borderColor: 'red' }}>Este campo es requerido</Alert>}
                            </Form.Group>
                            <Form.Group controlId="formCelular" className="mb-3">
                                <Form.Label>Celular</Form.Label>
                                <Form.Control
                                    type="tel"
                                    placeholder="Ingrese el número de celular"
                                    {...register("celular", { required: true })}
                                />
                                {errors.celular && <Alert style={{ color: 'red', backgroundColor: 'rgba(255,0,0,0.2)', borderColor: 'red' }}>Este campo es requerido</Alert>}
                            </Form.Group>
                            <Form.Group controlId="formCorreo" className="mb-3">
                                <Form.Label>Correo Institucional</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingrese el correo institucional"
                                    {...register("correo", { required: true })}
                                />
                                {errors.correo && <Alert style={{ color: 'red', backgroundColor: 'rgba(255,0,0,0.2)', borderColor: 'red' }}>Este campo es requerido</Alert>}
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Ingrese una contraseña"
                                    {...register("password", { required: true })}
                                />
                                {errors.password && <Alert style={{ color: 'red', backgroundColor: 'rgba(255,0,0,0.2)', borderColor: 'red' }}>Este campo es requerido</Alert>}
                            </Form.Group>
                            <Form.Group controlId="formTipoDocente" className="mb-3">
                                <Form.Label>Categoría</Form.Label>
                                <Form.Control
                                    as="select"
                                    {...register("tipodocente", { required: true })}
                                >
                                    <option value="">Seleccione una Categoría</option>
                                    <option value="Director de Carrera">Director de Carrera</option>
                                    <option value="Docente Tiempo Completo">Docente Tiempo Completo</option>
                                    <option value="Docente Tiempo Horario">Docente Tiempo Horario</option>
                                    <option value="Marketing">Marketing</option>
                                </Form.Control>
                                {errors.tipodocente && <Alert style={{ color: 'red', backgroundColor: 'rgba(255,0,0,0.2)', borderColor: 'red' }}>Debe seleccionar una opción válida</Alert>}
                            </Form.Group>
                            <Button type="submit" className="w-100" variant="success">Crear Usuario</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}
