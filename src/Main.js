function Main() {
  return (
<div>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
  <script src="public/functions/jquery.js"></script>
	<script src="public/functions/jquery-ui.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
  <title>Robiotics</title>

  <link rel="stylesheet" href="./public/css/styleMain.css"/>
  <link rel="icon" href="./public/images/fotologo.jpg"/> 
  </head>

<body>
  <script src="https://kit.fontawesome.com/e7616adc48.js" crossorigin="anonymous"></script>


  <header class="d-flex flex-wrap justify-content-center py-3 mb-1 border-bottom">
    <a href="/" class="d-flex align-items-center mb-1 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
     
      <span class="fs-4 text-info">R O B I O T I C S</span>
    </a>

  </header>
  

{vermodallogin && <div className="modal-backdrop fade show"></div>}

<div className={vermodallogin ? 'modal fade show d-block' : 'modal fade'}
  id="loginModal" tabIndex="-1" role="dialog"
  aria-labelledby="loginModalLabel" aria-hidden={!vermodallogin}>

  <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down" role="document">
    <div className="modal-content">

      <form onSubmit={e => { e.preventDefault(); handleLogin(); }}>

        <div className="modal-header">
          <h5 className="modal-title" id="loginModalLabel">Ingreso al sistema</h5>
          <button type="button" className="btn-close" aria-label="Cerrar"
            onClick={handleLoginClose}></button>
        </div>

        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="inpUser" className="form-label">Usuario</label>
            <input type="text" className="form-control" id="inpUser"
              placeholder="Ingrese su usuario" autoComplete="username"
              value={usuario}
              onChange={e => { setUsuario(e.target.value); setLoginMessage(""); }} />
          </div>
          <div className="mb-3">
            <label htmlFor="inpPwd" className="form-label">Contraseña</label>
            <input type="password" className="form-control" id="inpPwd"
              placeholder="Contraseña" autoComplete="current-password"
              value={password}
              onChange={e => { setPassword(e.target.value); setLoginMessage(""); }} />
          </div>
          {loginMessage && (
            <div className="text-danger small">{loginMessage}</div>
          )}
        </div>

        <div className="modal-footer">
          <div className="row g-2 w-100 justify-content-end m-0">
            <div className="col-6 col-md-auto">
              <button type="button" className="btn btn-secondary w-100"
                onClick={handleLoginClose}>Cancelar</button>
            </div>
            <div className="col-6 col-md-auto">
              <button type="submit" className="btn btn-primary w-100">Ingresar</button>
            </div>
          </div>
        </div>

      </form>
    </div>
  </div>
</div>





</body>

 

</div>    


  );
}

export default Main;
