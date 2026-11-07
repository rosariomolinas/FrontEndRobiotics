
import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ChangePass(props) {
    const [user, setUser] = useState("")
    const [passwordOld, setPasswordOld] = useState("")  
    const [passwordNew, setPasswordNew] = useState("")  
    const [message, setMessage] = useState("")  

    const navigate = useNavigate()

    async function handleChgLogin(e){
      e.preventDefault()
      try {
         
          var options = {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            mode: 'cors',
            credential : 'include',
           //credential : 'same-origin',
            //body : {},
            //body: {"user":"mark", "password" : "mar1"},
            body: JSON.stringify({"user" : user, "passwordold" : passwordOld,  "passwordnew" : passwordNew}),
            };new
        
          fetch('http://localhost:8080/robiotics/usuarios/pwdUpdate', options)
          .then( response => response.json())
          .then( data => {
             // usuario válido
             if(data.data)
             {
              props.newToken(data.token);
              navigate('/')
             }
             else
             {
              setMessage(data.message);
             }
            
            
          })
         // navigate('/')
      } catch (error) {
          console.log(error);
          
      }
  }


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
  

<div class="modal fade show d-block" id="loginModal" data-show="true" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmModalLabel">Ingreso al sistema:</h5>
        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
          <div id="loginModalBody" class="modal-body">
              <div class="form-group">
                  <label for="exampleInputEmail1">Usuario </label>
                  <input type="email" class="form-control" id="inpUser" onChange={e => {setUser(e.target.value)}}    aria-describedby="emailHelp" placeholder="Ingrese su usuario"/>
              </div>
              <div class="form-group">
                  <label for="exampleInputPassword1">Password anterior</label>
                  <input type="password" class="form-control" id="inpPwdold" onChange={e => {setPasswordOld(e.target.value)}} placeholder="Passwordold"/>
              </div>
              <div class="form-group">
                  <label for="exampleInputPassword1">Password nueva</label>
                  <input type="password" class="form-control" id="inpPwdnew" onChange={e => {setPasswordNew(e.target.value)}} placeholder="Passwordnew"/>
              </div>              
              <div class="form-group text-danger">
                  <label id="log_message">{message}</label>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" >Cancelar</button>
            <button type="button" id="btnconfirm" data-bs-confirm="" onClick={handleChgLogin } class="btn btn-primary">Confirmar</button>
          </div>

    </div>
  </div>
</div>  






</body>

 

</div>    


  );
}

export default ChangePass;
