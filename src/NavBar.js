// component/NavBar.js
import { React, useState } from "react"
import { NavLink } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';


const NavBar = (props) => {

 
  var m1;
  var m2;
  var m3;
  var m4;
  if(props.vprofile === "user")
  {
    //m1 = <NavLink to="/pacientes">Pacientes</NavLink>
    //m2 = <NavLink to="/intervenciones">Intervenciones</NavLink>
    m1 = <Dropdown.Item to="/pacientes"> <NavLink to="/pacientes">Pacientes</NavLink></Dropdown.Item>
    m2 = ""
    m3 = <Dropdown.Item><NavLink to="/intervnueva">Nueva</NavLink></Dropdown.Item>
    m4 = <Dropdown.Item><NavLink to="/intervbuscar">Buscar</NavLink></Dropdown.Item>
    
  }
  else
  {
   // m1 = <NavLink to="/organos">Órganos</NavLink>
   // m2 = <NavLink to="/doctores">Doctores</NavLink>
   m1 = <Dropdown.Item><NavLink to="/organos">Órganos</NavLink></Dropdown.Item> 
   m2 = <Dropdown.Item><NavLink to="/doctores">Doctores</NavLink></Dropdown.Item>
   m3 = <Dropdown.Item to="/intervbuscar">Buscar</Dropdown.Item>
   m4 = ""
  }

  return (
    <>
   
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
      <title>Robiotics</title>

      <link rel="stylesheet" href="./../public/css/styleMain.css"/>
      <link rel="icon" href="./../public/images/fotologo.jpg"/> 
  </head>

<body>
  <script src="https://kit.fontawesome.com/e7616adc48.js" crossorigin="anonymous"></script>
  <header class="d-flex flex-wrap justify-content-center py-3 mb-1 border-bottom">
    <a href="/" class="d-flex align-items-center mb-1 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
     
      <span class="fs-4 text-info">R O B I O T I C S</span>
    </a>

  </header>
  


  <header class="p-3 mb-1 border-bottom">
  
    <nav>
    
        <ul>
         
          <div class="row">
              <div class="col-2"> 
                  <Dropdown>
                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                      Datos
                    </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {m1}
                          {m2}                  
                        </Dropdown.Menu>
                  </Dropdown> 

              </div>
          <div class="col-2">
          <Dropdown>
                    <Dropdown.Toggle variant="info" id="dropdown-basic">
                      Intervenciones
                    </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {m3}
                          {m4}                  
                        </Dropdown.Menu>
                  </Dropdown> 
         
          </div>
          <div class="col-5">

          </div>

          <div class="col-1">
           
          <Dropdown>
      <Dropdown.Toggle variant="info" id="dropdown-basic">
        Usuario
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item to="/passchange"><NavLink to="/passchange">Cambiar contraseña</NavLink></Dropdown.Item>
        <Dropdown.Item to="/"><NavLink to="/home">Cerrar sesión</NavLink></Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown> 


          </div>
          </div>
      </ul>
    </nav>
</header>

    </body>
    </>
  );
};

export default NavBar;