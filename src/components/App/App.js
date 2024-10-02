import React from 'react';
// import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Login from '../Login/login';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import useToken from './useToken';
import Dashboard from '../Dashboard/Dashboard';


function App() {
  return (
    <div className="wrapper">
      <Ppal />
      <BrowserRouter basename="/">
        <Switch>
          <Route exact path="/">
            <Dashboard />
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
        <Navbar.Brand href="/">PRUEBA THINK US - Roberth Campeon</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="justify-content-end flex-grow-1 pe-3" variant="pills"  >
              <Nav.Link href="/prueba/users">Empleados</Nav.Link>
              <Nav.Link href="/prueba/teams">Sucursales</Nav.Link>
              <Nav.Link href="/prueba/matchs">Equipos</Nav.Link>
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
