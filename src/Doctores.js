// Pacientes.js

import { React, useState } from "react"
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';


const Pacientes = (props) => {
           
   const [codigo, setCodigo] = useState("")
   const [nombre, setNombre] = useState("")  
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

   async function    handleOnChangeActivo(e){
    setSearchActivo(!searchactivo); 
    setSearchMessage("");
 }
 


/* Handle de evento modelo */
  async function handleModel(e){
   e.preventDefault()
   try {
      var json = ""
   } catch (error) {
       console.log(error);
       
   }
}

/* Abrir ventana de búsqueda */
async function handleSearchShow(e){
  e.preventDefault()
  try {
    setSearchCodigo("");
    setSearchNombre("")  ;
    setSearchActivo(false);
    setSearchGrilla([]);
    
    handleNew();
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
    
    

    setCodigo(searchgrilla[fila].code);
    setNombre(searchgrilla[fila].nombre);
    setApellido(searchgrilla[fila].apellido);
    setEdad(searchgrilla[fila].edad);
    setActivo(searchgrilla[fila].activo);
   
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
  const params = new URLSearchParams();
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
        params.append('code', searchcodigo);
        params.append('token', props.vtoken);
        params.append('msg', msgactivo);
        console.log (jstring);
        url = "http://localhost:8080/robiotics/pac/findcode";
      }
      else
      {
        if (searchnombre)
        {
          jstring = '{ "nombre" : "' + searchnombre + '", '+ msgactivo +  '}';
          url = "http://localhost:8080/robiotics/pac/findname";
          params.append('nombre', searchnombre);
          params.append('msg', msgactivo);
        }
        else
        {
          jstring = '{'+ msgactivo + '}';
          url = "http://localhost:8080/robiotics/pac/findall";
          params.append('msg', msgactivo);
        }
    
      }



/* fetch de búsqueda */
/*
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
  */
  

fetch(`${url}?${params}`)
.then( response => response.json())
.then( data => {
    setSearchGrilla(data.data);
    if (! data.data.length)
    {
      setSearchMessage("No hay coincidencias");

    }
  //setSearchNombre("Pepe");
  //setCodigo (json[0].code);    
  //setNombre (json[0].nombre);            
  
})


  } catch (error) {
      console.log(error);
      
  }
}



   async function handleNew(e){
    setCodigo("");
    setNombre("")  ;
    setApellido("");
    setEdad("");
    setNotEditable(false);
  }


  /* Editar */
  async function handleEdit(e){
    e.preventDefault()
    try {
   
      setNotEditable(false);
    } catch (error) {
        console.log(error);
        
    }
 }
  /* Remove => mostrar confirmación de eliminación */
  async function handleRemove(e){
    e.preventDefault()
    try {
      
       setVermodalConf(true);
    } catch (error) {
        console.log(error);
        
    }
 }


 /* confirmación de eliminación */
 async function handleConfirmEliminar (e){
  e.preventDefault()
  try {

    var jstring;
    var url;
    var json;
    e.preventDefault()
    try { 
      setNotEditable(true);
      if (codigo)
      { 
      jstring = '{ "code" : "' + codigo +  '"}';
      url = "http://localhost:8080/robiotics/pac/remove";


      var options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        mode: 'cors',
        credential : 'include',
        body:  jstring,
        
        };
      
      fetch(url, options)
      .then( response => response.json())
      .then( data => {
         json = data.data;
        console.log(json[0].codigo);
        setCodigo (json[0].codigo);    
        setNombre (json[0].nombre);
        setApellido (json[0].apellido);            
        setEdad (json[0].edad);
        setActivo (json[0].actvo);
        setTextoToast("Paciente eliminado");
        setShowToast(true);
      })
    }


      /* traer los datos del registro que se estaba editado */
      
    } catch (error) {
        console.log(error);
        
    }




    setVermodalConf(false)
  } catch (error) {
      console.log(error);
      
  }
}
async function handleConfirmClose(e){
e.preventDefault()
try {
  setVermodalConf(false)
} catch (error) {
    console.log(error);
    
}
}



  /* Save */
  async function handleSave(e){

      var jstring;
      var url;
      var json;
      e.preventDefault()
      try { 
        setNotEditable(true);
        json = '"nombre" : "' + nombre + '", "apellido" : "' + apellido + '", "edad" : ' + edad + '}';
        if ( codigo )
        {
          json = '{ "code" : ' + codigo + ', ' + json;
          console.log(json);
          url = "http://localhost:8080/robiotics/pac/update";
        }
        else 
        {
          json = '{' + json;
          console.log(json);
          url = "http://localhost:8080/robiotics/pac/addnew";
        }
  
        var options = {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          mode: 'cors',
          credential : 'include',
          body:  json,
          
          };
        
        fetch(url, options)
        .then( response => response.json())
        .then( data => {
          
           json = data.data;
           console.log(json);
          setCodigo (json[0].code);    
          setNombre (json[0].nombre);
          setApellido (json[0].apellido);            
          setEdad (json[0].edad);
          setActivo (json[0].actvo);

/* toast */
setTextoToast("Paciente guardado");
setShowToast(true);


        })
    } catch (error) {
        console.log(error);
        
    }
 }

   /* Cancelar */
   async function handleCancel(e){
    var jstring;
    var url;
    var json;
    const params = new URLSearchParams();

    e.preventDefault()
    try { 
      setNotEditable(true);
      if (codigo)
      { 
        jstring = '{ "code" : "' + codigo +  '", "token" : "' + props.vtoken + '"}';
      //jstring = '{ "code" : "' + codigo +  '"}';
      url = "http://localhost:8080/robiotics/pac/findcode";

/*
      var options = {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        mode: 'cors',
        credential : 'include',
        body:  jstring,
        
        };
      */
      fetch(`${url}?${params}`)
      .then( response => response.json())
      .then( data => {
         json = data.data;
        console.log(json[0].codigo);
        setCodigo (json[0].codigo);    
        setNombre (json[0].nombre);
        setApellido (json[0].apellido);            
        setEdad (json[0].edad);
        setActivo (json[0].actvo);
      })
    }
    else {
      setNombre ("");
      setApellido ("");            
      setEdad ("");
    }


      /* traer los datos del registro que se estaba editado */
      
    } catch (error) {
        console.log(error);
        
    }
 }



           return (
               <div>



<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="../public/css/stylePac.css"/>
  
  </head>

  <div id="divtabpac" class="container text-center ml-2 mb-2">
            <div class="row mb-12 border-primary">
                     <div class="col  col-1 text-end border-primary">
                      &nbsp;
                     </div>
              </div>

            <div class="row mb-1 border-primary">
              <div class="col col-1 text-end border-primary">
                          
                        Código:
              </div>
              <div class="col  col-2 border-primary">

                     <input type="text" id="code" name="code" onChange={e => {setCodigo(e.target.value)}} value={codigo}  disabled={true}/> 
              </div>
           </div>
           <div class="row  mb-1 border-primary">
              <div class="col  col-1 text-end border-primary">
                     Nombre:
              </div>
              <div class="col  col-2 border-primary">
                     <input type="text" id="nombre" name="nombre" onChange={e => {setNombre(e.target.value)}}  value={nombre} disabled={noteditable}/> 
              </div>
            </div>
            <div class="row  mb-1 border-primary">
             <div class="col  col-1 text-end border-primary">
                     Apellido:
             </div>
             <div class="col  col-1 border-primary">

                     <input type="text" id="apellido" name="apellido" onChange={e => {setApellido(e.target.value)}}  value={apellido} disabled={noteditable}/> 
             </div>
             </div>
             <div class="row mb-1 border-primary">
                <div class="col  col-1 text-end border-primary">
                     Edad:
                </div>
               <div class="col  col-2 border-primary">
                     <input type="text" id="edad" name="edad" onChange={e => {setEdad(e.target.value)}}  value={edad} disabled={noteditable}/> 
              </div>
              <div class="col  col-1 text-end border-primary">
                     Activo:
                     </div>
                     <div class="col  col-1 text-start border-primary">
                     <input type="checkbox" id="activo" name="activo"  checked={activo} disabled={true}/> 
                     </div>
                     </div>
             <div class="row mb-12 border-primary">
                     <div class="col  col-1 text-end border-primary">
                      &nbsp;
                     </div>
              </div>

              <div class="row mb-1 border-primary">
                     <div class="col  col-1 text-center border-primary">

                       <button type="button" class="btn btn-primary" id="find" onClick={handleSearchShow} disabled={!noteditable} >Buscar</button>
                     </div>
                     <div class="col  col-1 text-center border-primary">
                       <button type="button" class="btn btn-primary"  id="clear" onClick={handleNew} disabled={!noteditable} >Nuevo</button>
                     </div>

                     <div class="col  col-1 text-center border-primary">
                     <button type="button" class="btn btn-primary" id="edit" onClick={handleEdit} disabled={!codigo}>Editar</button>
                     </div>
                     <div class="col  col-1 text-center border-primary">
                     <button type="button" class="btn btn-primary"  id="remove" onClick={handleRemove} disabled={!codigo}>Eliminar</button>
                     </div>

                     <div class="col  col-1 text-center border-primary">
                     <button type="button" class="btn btn-primary" id="grabar" onClick={handleSave} disabled={noteditable}>Guardar</button>
                     </div>
                     <div class="col  col-1 text-center border-primary">
                     <button type="button" class="btn btn-primary" id="cancelar" onClick={handleCancel} disabled={noteditable}>Cancelar</button>
                     </div>


              </div>

       </div>




      <ToastContainer position="bottom-end">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          
          <Toast.Body>{textoToast}</Toast.Body>
        </Toast>
        </ToastContainer>









{ /* <!-- Ventana de búsqueda de pacientes //  add show d-block to the class for the modal login to show up -->  */ }

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


{ /* <!-- Ventana de confirmación para eliminar/desactivar -->  */ }

<div class={vermodalconf ? 'modal fade show d-block' : 'modal fade'} id="pacConfModal" data-show="true" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
     
      <div class="modal-header">
        <h5 class="modal-title" id="confirmModalLabel">¿Eliminar paciente?</h5>
        
      </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-primary"   onClick={handleConfirmClose} data-bs-dismiss="modal">Cancelar</button>
              <button type="button" id="btnconfirm" data-bs-confirm="" onClick={handleConfirmEliminar}  class="btn btn-primary">Confirmar</button>
            </div>
            
          </div>


    </div>
  </div>


<div class="toast-container position-fixed bottom-0 end-0 p-3">
  <div id="liveToastmsg" class="toast" role="alert" aria-live="assertive" aria-atomic="true">

    <div class="toast-body">
      
    </div>
  </div>
</div>













               </div>
           );
   };

export default Pacientes;

