// Intervenciones.js

import { React, useState } from "react"
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';




const Intervenciones = (props) => {

    const [codigo, setCodigo] = useState("")
    const [nombpaciente, setNombpaciente] = useState("")  
    const [apellido, setApellido] = useState("")  
    const [edad, setEdad] = useState("")  
    const [activo, setActivo] = useState(false)  
    const [noteditable, setNotEditable] = useState(true)
 
    // ventana de búsqueda
    const [vermodal, setVermodal] = useState(false)  
    const [searchcodigo, setSearchCodigo] = useState("")
    const [searchnombre, setSearchNombre] = useState("")  
    const [searchactivo, setSearchActivo] = useState(false)  
    const [searchgrilla, setSearchGrilla] = useState([])  
    const [searchMessage, setSearchMessage] = useState("")
 
    // ventana de confirmación
    const [vermodalconf, setVermodalConf] = useState(false)  
 
 // toast
    const [showToast, setShowToast] = useState(false);
    const [textoToast, setTextoToast] = useState("");
    
/* Handle de evento modelo */
async function handleModel(e){
    e.preventDefault()
    try {
       var json = ""
    } catch (error) {
        console.log(error);
        
    }
 }
 
 async function handleNew(e){
  setNombpaciente("");
  setNotEditable(false);
}

/* Abrir ventana de búsqueda */
async function handleSearchShow(e){
  e.preventDefault()
  try {
    setSearchCodigo("");
    setSearchNombre("")  ;
    setSearchActivo(false);
    setSearchGrilla([]);
    
    //handleNew();
    setNotEditable(true)
     setVermodal(true)
  } catch (error) {
      console.log(error);
      
  }
}

/* Cerrar / cancelar ventana de búsqueda */

async function handleSearchClose(e){
  e.preventDefault()
  try {
    setVermodal(false)
  } catch (error) {
      console.log(error);
      
  }
}


/* cuando se hace click sobre alguno de los pacientes de la grilla de búsqueda */

async function handlepacSelected(fila){
  
  try {
    
    

    setNombpaciente(searchgrilla[fila].nombre + ' ' + searchgrilla[fila].apellido);
    
   
    setVermodal(false)
  } catch (error) {
      console.log(error);
      
  }
}

/* Ejecutar la búsqueda en el backend y completar la grilla */
async function handlesearchPac(e){
  var msgactivo;
  var jstring;
  var url;
  e.preventDefault()
  try {
    if (searchactivo)
      { 
       msgactivo = '"activo" : false'
      }
      else {
       msgactivo = '"activo" : true'
      }  
    if (searchcodigo)
      {
        jstring = '{ "code" : "' + searchcodigo +  '", "token" : "' + props.vtoken + '", ' + msgactivo +  '}';
        console.log (jstring);
        url = "http://localhost:8080/robiotics/pac/findcode";
      }
      else
      {
        if (searchnombre)
        {
          jstring = '{ "nombre" : "' + searchnombre + '", '+ msgactivo +  '}';
          url = "http://localhost:8080/robiotics/pac/findname";
    
        }
        else
        {
          jstring = '{'+ msgactivo + '}';
          url = "http://localhost:8080/robiotics/pac/findall";
    
        }
    
      }



/* fetch de búsqueda */
var options = {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json'
  },
  mode: 'cors',
  credential : 'include',
  body:  jstring,
  //JSON.stringify({"code" : 4, "activo" : true}),
  
  };

fetch(url, options)
.then( response => response.json())
.then( data => {
    setSearchGrilla(data.data);
    if (! data.data.length)
    {
      setSearchMessage("No hay coincidencias");

    }          
  
})


  } catch (error) {
      console.log(error);
      
  }
}


async function    handleOnChangeActivo(e){
  setSearchActivo(!searchactivo); 
  setSearchMessage("");
}

           return (
               <div>
                   Data from parent is:{props.vtoken}


                   <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="../public/css/stylePac.css"/>
  
  </head>


  <div class="mb-3">
    <button type="button" class="btn btn-primary" id="find" onClick={handleSearchShow} disabled={!noteditable} >Buscar Paciente</button>
    <label for="exampleFormControlInput1" id="nombpaciente" class="form-label">{nombpaciente}</label>
   
  </div>

  
  <div class="mb-4">
    <button class="button mt-2 mb-2 color1" id="find" onclick="searchDocShow();"><i class="fa-solid fa-find fa-1x color1" ></i>Buscar Medico</button> 
    <label for="exampleFormControlInput1" id="nombdoctor" class="form-label"></label>
   
  </div>

<label for="intervDate">Fecha Intervención:</label>
<input id="intervDate" onchange="presupNuevo()" class="form-control" type="date" />

<div id="divtabruta" class="container text-center">
  <div class="row align-items-start ">
    <div class="col bg-info col-2 borde">
      Órgano
    </div>
    <div class="col bg-info col-2 borde">
      Tejido
    </div>
    <div class="col bg-info col-2 borde">
      Sangre
    </div>
    <div class="col bg-info col-2 borde">
      Tomografía
    </div>
    <div class="col bg-info col-2 borde">
      Medicación
    </div>
    <div class="col bg-info col-2 borde">
      &nbsp;
    </div>
  </div>
  
</div>

<button id="rutaadd" onclick="rutaadd()" >Ruta +</button>

<button id="rutapresup" onclick="presup()" >Presupuestar</button>

<button id="presupconf" onclick="confirmar()" disabled>Confirmar</button>

<div id="container">




<div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Costo:</label>
  <label for="exampleFormControlInput1" id="valcosto" class="form-label"></label>
 
</div>


<div class="mb-3">
 
  <label for="exampleFormControlInput1" class="form-label">Tiempo:</label>
  <label for="exampleFormControlInput1" id="valtiempo" class="form-label"></label>
 
</div>
<div class="form-group text-danger">
  <label id="err_message"></label>
</div>

{ /* <!-- Ventana de búsqueda de pacientes //  add show d-block to the class for the modal login to show up-->  */ }

<div class={vermodal ? 'modal fade show d-block' : 'modal fade'} id="pacSearchModal" data-show="true" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmModalLabel">Buscar paciente</h5>
        
      </div>
             <div id="loginModalBody" class="modal-body">
                <div class="form-group">
                    <label for="InputCode">Código :</label>
                    <input type="text" class="form-control" id="inpCode" aria-describedby="emailHelp" onChange={e => {setSearchCodigo(e.target.value); setSearchMessage("")}} value={searchcodigo}  placeholder=""/>
                </div>
                <div class="form-group">
                    <label for="InputNombre">Nombre y Apellido:</label>
                    <input type="text" class="form-control" id="inpNombre" onChange={e => {setSearchNombre(e.target.value); setSearchMessage("")}} value={searchnombre} placeholder=""/>
                </div>
                <div class="form-group">
                  <label for="InputActivo">Incluir inactivos</label>&nbsp;
                  <input type="checkbox" class="form-check-input" id="inpActivo" onChange={handleOnChangeActivo} checked={searchactivo} placeholder=""/>
                </div>
                <div class="form-group text-danger">
                    <label id="log_message">{searchMessage}</label>
                </div>
               </div>
          
              <div class="modal-footer">
                <button type="button" class="btn btn-primary"   onClick={handleSearchClose} data-bs-dismiss="modal">Cancelar</button>
                <button type="button" id="btnconfirm" data-bs-confirm="" onClick={handlesearchPac}  class="btn btn-primary">Buscar</button>
              </div>


            <div id="divtabpac" class="container text-center ml-2 mb-2">
                    <div class="row align-items-start border-primary">
                      <div class="col bg-info col-2 border-primary">
                        Código
                      </div>
                      <div class="col bg-info col-5 border-primary">
                        Nombre
                      </div>
                      <div class="col bg-info col-5 border-primary">
                        Apellido
                      </div>
                    </div>

                  {  searchgrilla.map (( unolista, index ) => (
                    <>
                    <div class="row align-items-start borde-primary" onClick={() => { handlepacSelected(index) }}>
                      <div key={index+'_1'} class="col col-2 border-primary"> {unolista.code} </div>
                      <div key={index+'_2'} class="col col-5 border-primary"> {unolista.nombre}</div>
                      <div key={index+'_3'} class="col col-5 border-primary"> {unolista.apellido}</div>


                    </div>
            
                   </>


                  ))} 
              </div>


    </div>
  </div>
  </div>
  </div>


{ /* <!-- Ventana de búsqueda de doctores //  add show d-block to the class for the modal login to show up-->  */ }


<div class="modal fade " id="docSearchModal" data-show="true" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmModalLabel">Buscar doctor:</h5>
        
      </div>
          <div id="loginModalBody" class="modal-body">
              <div class="form-group">
                  <label for="InputCode">Código :</label>
                  <input type="text" class="form-control" id="inpDocCode" aria-describedby="emailHelp" placeholder=""/>
              </div>
              <div class="form-group">
                  <label for="InputNombre">Nombre y Apellido :</label>
                  <input type="text" class="form-control" id="inpDocNombre" placeholder=""/>
              </div>
              <div class="form-group text-danger">
                  <label id="log_docmessage"></label>
              </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary"   onclick="searchDocClose()" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" id="btnconfirm" data-bs-confirm="" onclick="searchDoc()" class="btn btn-primary">Buscar</button>
          </div>
          <div id="divtabdoc" class="container text-center">
            <div class="row align-items-start ">
              <div class="col bg-info col-2 borde">
                Código
              </div>
              <div class="col bg-info col-5 borde">
                Nombre
              </div>
              <div class="col bg-info col-5 borde">
                Apellido
              </div>
            </div>
            
          </div>


    </div>
  </div>
</div>  


<ToastContainer position="bottom-end">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          
          <Toast.Body>{textoToast}</Toast.Body>
        </Toast>
        </ToastContainer>




    

               </div>
           );
 }

export default Intervenciones;