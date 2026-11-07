// component/NavBar.js

import { NavLink } from "react-router-dom";

const NavBar = () => {
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
          <div class="col-1"> 
            <NavLink to="/pacientes">Pacientes</NavLink>
          </div>
          <div class="col-1">
            <NavLink to="/intervenciones">Intervenciones</NavLink>
          </div>
          <div class="col-4">

          </div>
          <div class="col-4">
            <div class="dropdown text-end color1" id="per">
                <a href="#" class="d-block link-body-emphasis text-decoration-none dropdown-toggle color1" data-bs-toggle="dropdown" aria-expanded="false">
                  Usuario
                </a>         
                <ul class="dropdown-menu text-small">
                  <li><a class="dropdown-item" href="./chglogin" >Cambio contraseña</a></li>
                  <li><hr class="dropdown-divider"/></li>
                  <li><a class="dropdown-item" onclick="logout()"><i class="" onclick="logout()"></i> Cerrar sesión</a></li>
                </ul>
            </div>
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