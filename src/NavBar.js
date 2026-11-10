
import React from "react";
import { NavLink } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const NavBar = (props) => {

  let m1 = null;
  let m2 = null;
  let m3 = null;
  let m4 = null;

  if (props.vprofile === "user") {
    m1 = <Dropdown.Item as={NavLink} to="/pacientes">Pacientes</Dropdown.Item>;
    m3 = <Dropdown.Item as={NavLink} to="/intervnueva">Nueva</Dropdown.Item>;
    m4 = <Dropdown.Item as={NavLink} to="/intervbuscar">Buscar</Dropdown.Item>;
  } else {
    m1 = <Dropdown.Item as={NavLink} to="/organos">Órganos</Dropdown.Item>;
    m2 = <Dropdown.Item as={NavLink} to="/doctores">Doctores</Dropdown.Item>;
    m3 = <Dropdown.Item as={NavLink} to="/intervbuscar">Buscar</Dropdown.Item>;
  }

  return (
    <Navbar bg="light" expand="md" className="border-bottom mb-2">
      <Container fluid>

        <Navbar.Brand as={NavLink} to="/" className="text-info fs-4">
          R O B I O T I C S
        </Navbar.Brand>

        {/* Botón hamburguesa — aparece solo en mobile */}
        <Navbar.Toggle aria-controls="navbar-menu" />

        <Navbar.Collapse id="navbar-menu">
          <Nav className="me-auto">

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link}>Datos</Dropdown.Toggle>
              <Dropdown.Menu>
                {m1}
                {m2}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link}>Intervenciones</Dropdown.Toggle>
              <Dropdown.Menu>
                {m3}
                {m4}
              </Dropdown.Menu>
            </Dropdown>

          </Nav>

          {/* Usuario alineado a la derecha */}
          <Nav>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link}>Usuario</Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item as={NavLink} to="/passchange">Cambiar contraseña</Dropdown.Item>
                <Dropdown.Item as={NavLink} to="/home">Cerrar sesión</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
























// import { React, useState } from "react"
// import { NavLink } from "react-router-dom";
// import Dropdown from 'react-bootstrap/Dropdown';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import Container from 'react-bootstrap/Container';

// const NavBar = (props) => {

 
//   var m1;
//   var m2;
//   var m3;
//   var m4;
//   if(props.vprofile === "user")
//   {
//     //m1 = <NavLink to="/pacientes">Pacientes</NavLink>
//     //m2 = <NavLink to="/intervenciones">Intervenciones</NavLink>
//     m1 = <Dropdown.Item to="/pacientes"> <NavLink to="/pacientes">Pacientes</NavLink></Dropdown.Item>
//     m2 = ""
//     m3 = <Dropdown.Item><NavLink to="/intervnueva">Nueva</NavLink></Dropdown.Item>
//     m4 = <Dropdown.Item><NavLink to="/intervbuscar">Buscar</NavLink></Dropdown.Item>
    
//   }
//   else
//   {
//    // m1 = <NavLink to="/organos">Órganos</NavLink>
//    // m2 = <NavLink to="/doctores">Doctores</NavLink>
//    m1 = <Dropdown.Item><NavLink to="/organos">Órganos</NavLink></Dropdown.Item> 
//    m2 = <Dropdown.Item><NavLink to="/doctores">Doctores</NavLink></Dropdown.Item>
//    m3 = <Dropdown.Item to="/intervbuscar">Buscar</Dropdown.Item>
//    m4 = ""
//   }
//   return (
//     <Navbar bg="light" expand="md" className="border-bottom mb-2">
//       <Container fluid>

//         <Navbar.Brand href="/" className="text-info fs-4">
//           R O B I O T I C S
//         </Navbar.Brand>

//         {/* Botón hamburguesa — aparece solo en mobile */}
//         <Navbar.Toggle aria-controls="navbar-menu" />

//         <Navbar.Collapse id="navbar-menu">
//           <Nav className="me-auto">

//             <Dropdown as={Nav.Item}>
//               <Dropdown.Toggle as={Nav.Link} variant="info">
//                 Datos
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 {m1}
//                 {m2}
//               </Dropdown.Menu>
//             </Dropdown>

//             <Dropdown as={Nav.Item}>
//               <Dropdown.Toggle as={Nav.Link} variant="info">
//                 Intervenciones
//               </Dropdown.Toggle>
//               <Dropdown.Menu>
//                 {m3}
//                 {m4}
//               </Dropdown.Menu>
//             </Dropdown>

//           </Nav>

//           {/* Usuario alineado a la derecha */}
//           <Nav>
//             <Dropdown as={Nav.Item}>
//               <Dropdown.Toggle as={Nav.Link} variant="info">
//                 Usuario
//               </Dropdown.Toggle>
//               <Dropdown.Menu align="end">
//                 <Dropdown.Item as={NavLink} to="/passchange">Cambiar contraseña</Dropdown.Item>
//                 <Dropdown.Item as={NavLink} to="/home">Cerrar sesión</Dropdown.Item>
//               </Dropdown.Menu>
//             </Dropdown>
//           </Nav>

//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default NavBar;