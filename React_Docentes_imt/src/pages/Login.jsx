import React, { useState } from "react";
import { Container, Form, Button, Card, Alert, Navbar, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { HeaderPage } from "../components/HeaderPage.jsx";
import { getUsersDocentes } from "../api/tasks.api.js"
export const Login = () => {
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await getUsersDocentes();
            const docentes = res.data;
            const docente = docentes.find(d => d.correo === correo && d.password === password);
            if (docente) {
                // Almacenar los datos del usuario en localStorage
                localStorage.setItem('usuario', JSON.stringify(docente));
                // Redirigir a la página de registro de sesiones
                navigate("/sesiones", { state: { nombre: docente.nombre } });
            } else {
                setError("Credenciales Incorrectas, por favor verificar y reintentar");
            }
        } catch (error) {
            console.error("Error al obtener usuarios:", error);
            setError("Ocurrió un error al intentar iniciar sesión. Por favor, inténtelo de nuevo más tarde.");
        }
    };
    return (
        <>
            {/* Header */}
            <HeaderPage
                header1="Iniciar Sesión"
                paragraph="Bienvenido, ingrese sus credenciales para ingresar."
            />
            {/* Formulario */}
            <Container className="d-flex justify-content-center mt-4">
                <Card style={{ width: '30rem', padding: '1rem', boxShadow: '0 4px 8px rgba(0,0,0,0.8)', borderRadius: '30px' }}>
                    <Card.Body>
                        <h1 className="mb-4">Login Docentes</h1>
                        {error && <Alert variant="danger">{error}</Alert>}
                        <Form onSubmit={handleLogin}>
                            <Form.Group controlId="formCorreo" className="mb-3">
                                <Form.Label>Correo Institucional</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingrese su correo institucional"
                                    value={correo}
                                    onChange={(e) => setCorreo(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <Button type="submit" className="w-100" variant="success">Iniciar Sesión</Button>
                        </Form>
                        <div className="mt-3 text-center">
                            <p>Si no tienes cuenta, <a href="/createusers" style={{ color: 'blue', textDecoration: 'underline' }}>crea una</a></p>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </>
    )
}
