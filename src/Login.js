// Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:8080/robiotics/usuarios/validar";

function Login(props) {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [verPassword, setVerPassword] = useState(false);
  const [ingresando, setIngresando] = useState(false);

  const navigate = useNavigate();

  async function handleLogin() {
    if (!user.trim() || !password) {
      setMessage("Ingrese usuario y contraseña");
      return;
    }

    setIngresando(true);
    setMessage("");

    try {
      const params = new URLSearchParams();


      params.append("user", user.trim());
      params.append("password", password.trim());

    
     fetch(`${API}?${params}`)
      .then((response) => response.json())
      .then((data) => {
            // Usuario válido
            if (data.data) {
              props.newToken(data.token);
              props.getProfile(data.profile);
              navigate("/");
            } else {
              setMessage(data.message || "Usuario o contraseña incorrectos");
            }
      })
      .catch((error) => console.error("No se pudo conectar con el servidor. Verifique que el backend esté funcionando.", error));


    } catch (error) {
      // El backend no responde (apagado o con error)
      console.error(error);
      setMessage("No se pudo conectar con el servidor. Verifique que el backend esté funcionando.");
    } finally {
      setIngresando(false);
    }
  }

  function cambiar(setter) {
    return (e) => {
      setter(e.target.value);
      if (message) setMessage("");
    };
  }

  const labelClass = "form-label text-uppercase text-secondary fw-bold small";
  const labelStyle = { fontSize: "0.75rem" };

  return (
    <div className="bg-light min-vh-100 d-flex flex-column">

      {/* Barra superior con la marca */}
      <header className="bg-white border-bottom py-3 px-4">
        <span className="fs-4 text-info" style={{ letterSpacing: "0.3em" }}>ROBIOTICS</span>
      </header>

      <main className="flex-grow-1 d-flex align-items-center justify-content-center px-3 py-5">
        <div className="card border-0 shadow-sm rounded-3 bg-white w-100" style={{ maxWidth: "420px" }}>

          <div className="card-header border-0 bg-white pt-4 px-4 pb-0">
            <div className="d-flex align-items-center">
              <div className="rounded-3 p-2 me-3 text-white d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#0284c7", width: "42px", height: "42px" }}>
                <i className="bi bi-shield-lock fs-5"></i>
              </div>
              <div>
                <h5 className="fw-bold mb-0 text-dark">Ingreso al sistema</h5>
                <small className="text-muted">Ingrese sus datos para continuar</small>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} noValidate>

              <div className="mb-3">
                <label htmlFor="inpUser" className={labelClass} style={labelStyle}>Usuario</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted"><i className="bi bi-person"></i></span>
                  <input type="text" id="inpUser" className="form-control py-2"
                    placeholder="Ingrese su usuario" autoComplete="username" autoFocus
                    value={user} onChange={cambiar(setUser)} />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="inpPwd" className={labelClass} style={labelStyle}>Contraseña</label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted"><i className="bi bi-key"></i></span>
                  <input type={verPassword ? "text" : "password"} id="inpPwd" className="form-control py-2"
                    placeholder="Ingrese su contraseña" autoComplete="current-password"
                    value={password} onChange={cambiar(setPassword)} />
                  <button type="button" className="btn btn-outline-secondary"
                    aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    title={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    onClick={() => setVerPassword(!verPassword)}>
                    <i className={verPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                  </button>
                </div>
              </div>

              {message && (
                <div className="alert alert-danger py-2 small" role="alert">
                  <i className="bi bi-exclamation-triangle me-1"></i>{message}
                </div>
              )}

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold mt-2"
                style={{ backgroundColor: "#0284c7", borderColor: "#0284c7" }} disabled={ingresando}>
                {ingresando
                  ? <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Ingresando...</>
                  : <><i className="bi bi-box-arrow-in-right me-2"></i>Ingresar</>}
              </button>

            </form>
          </div>

        </div>
      </main>

    </div>
  );
}

export default Login;




// import { useState } from "react"
// import { useNavigate } from "react-router-dom"

// function Login(props) {
//     const [user, setUser] = useState("")
//     const [password, setPassword] = useState("")  
//     const [message, setMessage] = useState("")  

//     const navigate = useNavigate()

//     async function handleLogin(e){
//       e.preventDefault()
//       try {
         
//           var options = {
//             method: 'POST',
//             headers: {
//             'Content-Type': 'application/json'
//             },
//             mode: 'cors',
//             credential : 'include',
//            //credential : 'same-origin',
//             //body : {},
//             //body: {"user":"mark", "password" : "mar1"},
//             body: JSON.stringify({"user" : user, "password" : password}),
//             };
        
//           fetch('http://localhost:8080/robiotics/usuarios/validar', options)
//           .then( response => response.json())
//           .then( data => {
//              // usuario válido
//              if(data.data)
//              {
//               props.newToken(data.token);
//               props.getProfile(data.profile);
//               navigate('/')
//              }
//              else
//              {
//               setMessage(data.message);
//              }
            
            
//           })
//          // navigate('/')
//       } catch (error) {
//           console.log(error);
          
//       }
//   }


//   return (
// <div>
// <head>
//   <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8"/>
//   <script src="public/functions/jquery.js"></script>
// 	<script src="public/functions/jquery-ui.min.js"></script>
//   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
//   <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
//   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
//   <title>Robiotics</title>

//   <link rel="stylesheet" href="./public/css/styleMain.css"/>
//   <link rel="icon" href="./public/images/fotologo.jpg"/> 
//   </head>

// <body>
//   <script src="https://kit.fontawesome.com/e7616adc48.js" crossorigin="anonymous"></script>


//   <header class="d-flex flex-wrap justify-content-center py-3 mb-1 border-bottom">
//     <a href="/" class="d-flex align-items-center mb-1 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
     
//       <span class="fs-4 text-info">R O B I O T I C S</span>
//     </a>

//   </header>
  

// <div class="modal fade show d-block" id="loginModal" data-show="true" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="false">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h5 class="modal-title" id="confirmModalLabel">Ingreso al sistema:</h5>
//         <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
//           <span aria-hidden="true">&times;</span>
//         </button>
//       </div>
//           <div id="loginModalBody" class="modal-body">
//               <div class="form-group">
//                   <label for="exampleInputEmail1">Usuario </label>
//                   <input type="email" class="form-control" id="inpUser" onChange={e => {setUser(e.target.value)}}    aria-describedby="emailHelp" placeholder="Ingrese su usuario"/>
//               </div>
//               <div class="form-group">
//                   <label for="exampleInputPassword1">Password</label>
//                   <input type="password" class="form-control" id="inpPwd" onChange={e => {setPassword(e.target.value)}} placeholder="Password"/>
//               </div>
//               <div class="form-group text-danger">
//                   <label id="log_message">{message}</label>
//               </div>
//           </div>
//           <div class="modal-footer">
//             <button type="button" class="btn btn-primary" data-bs-dismiss="modal" >Cancelar</button>
//             <button type="button" id="btnconfirm" data-bs-confirm="" onClick={handleLogin } class="btn btn-primary">Confirmar</button>
//           </div>

//     </div>
//   </div>
// </div>  






// </body>

 

// </div>    


//   );
// }

// export default Login;
