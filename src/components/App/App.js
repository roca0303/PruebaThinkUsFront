import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
// import Login from '../Login/login';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
// import useToken from './useToken';
import Dashboard from '../Dashboard/Dashboard';
import Alumno from '../Alumno/Alumno';
import Profesor from '../Profesor/Profesor';
import Grado from '../Grado/Grado';
import AlumnoGrado from '../AlumnoGrado/AlumnoGrado';

function App() {
  return (
    <div className="wrapper">
      <Ppal />
      <BrowserRouter basename="/">
        <Switch>
          <Route exact path="/">
            <Alumno />
          </Route>
          <Route path="/alumnos">
            <Alumno />
          </Route>
          <Route path="/profesores">
            <Profesor />
          </Route>
          <Route path="/grados">
            <Grado />
          </Route>
          <Route path="/alumnosgrados">
            <AlumnoGrado />
          </Route>

        </Switch>
      </BrowserRouter>
    </div>
  );
}


export default App;

function Ppal(  ) {
  return (
    <Navbar bg="primary" variant="light" expand="lg"  >
      <Container>
        <Navbar.Brand href="/">PRUEBA VIARO - Roberth Campeon</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end flex-grow-1 pe-3" variant="pills"  >
              <Nav.Link href="/alumnos">Alumnos</Nav.Link>
              <Nav.Link href="/profesores">Profesores</Nav.Link>
              <Nav.Link href="/grados">Grados</Nav.Link>
              <Nav.Link href="/alumnosgrados">Alumnos Grados</Nav.Link>
              <NavDropdown title="Otros" id="basic-nav-dropdown">
                <NavDropdown.Item href="/prueba/otros1">Otros 1</NavDropdown.Item>
                <NavDropdown.Item href="/prueba/otros2">Otros 1</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/salir">Salir</NavDropdown.Item>
              </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

  );
}
