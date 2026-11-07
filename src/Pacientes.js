// Pacientes.ts

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
       msgactivo = 'false'
      }
      else {
       msgactivo = 'true'
      }  
    if (searchcodigo)
      {
      //  jstring = '{ "code" : "' + searchcodigo +  '", "token" : "' + props.vtoken + '", ' + msgactivo +  '}';
         
  params.append('code', searchcodigo);
  params.append('token', props.vtoken);
  params.append('activo', msgactivo);
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
  method: 'GET',
  headers: {
  'Content-Type': 'application/json'
  },
  mode: 'cors',
  credential : 'include',
  body:  jstring,
  //JSON.stringify({"code" : 4, "activo" : true}),
  
  };*/

fetch(`${url}?${params}`)
  .then(response => response.json())
  .then(data => {
    setSearchGrilla(data.data);
    if (!data.data.length) {
      setSearchMessage("No hay coincidencias");
    }
  })
  .catch(error => {
    console.error(error);
    setSearchMessage("Error al buscar pacientes");
  });

/*

fetch(url, options)
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

*/

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
        method: 'DELETE',
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
      var vmeth;
      e.preventDefault()
      try { 
        setNotEditable(true);
        json = '"nombre" : "' + nombre + '", "apellido" : "' + apellido + '", "edad" : ' + edad + '}';
        
        if ( codigo )
        // update
        {
          vmeth = 'PUT';
          json = '{ "code" : ' + codigo + ', ' + json;
          console.log(json);
          url = "http://localhost:8080/robiotics/pac/update";
        }
        else 
        // create
        {
          vmeth = 'POST';
          json = '{' + json;
          console.log(json);
          url = "http://localhost:8080/robiotics/pac/addnew";
        }
  
        var options = {
          method: vmeth,
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
        params.append('code', codigo);
      params.append('token', props.vtoken);
      url = "http://localhost:8080/robiotics/pac/findcode";


      var options = {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json'
        },
        mode: 'cors',
        credential : 'include',
        body:  jstring,
        
        };
      
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
               <div >
 


<head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
 
  
  </head>

<h5>Pacientes</h5>
  <div id="divtabpac" className="container text-center ms-2 mb-2">

  {/* Spacer */}
  <div className="row mb-2" />

  {/* Código */}
  <div className="row mb-1 align-items-center">
    <div className="col-12 col-md-2 text-md-end">
      Código:
    </div>
    <div className="col-12 col-md-3">
      <input className="form-control" type="text" id="code" name="code"
        onChange={e => setCodigo(e.target.value)} value={codigo} disabled={true}/>
    </div>
  </div>

  {/* Nombre */}
  <div className="row mb-1 align-items-center">
    <div className="col-12 col-md-2 text-md-end">
      Nombre:
    </div>
    <div className="col-12 col-md-3">
      <input className="form-control" type="text" id="nombre" name="nombre"
        onChange={e => setNombre(e.target.value)} value={nombre} disabled={noteditable}/>
    </div>
  </div>

  {/* Apellido */}
  <div className="row mb-1 align-items-center">
    <div className="col-12 col-md-2 text-md-end">
      Apellido:
    </div>
    <div className="col-12 col-md-3">
      <input className="form-control" type="text" id="apellido" name="apellido"
        onChange={e => setApellido(e.target.value)} value={apellido} disabled={noteditable}/>
    </div>
  </div>

  {/* Edad + Activo */}
  <div className="row mb-1 align-items-center">
    <div className="col-12 col-md-2 text-md-end">
      Edad:
    </div>
    <div className="col-12 col-md-3">
      <input className="form-control" type="text" id="edad" name="edad"
        onChange={e => setEdad(e.target.value)} value={edad} disabled={noteditable}/>
    </div>
    <div className="col-6 col-md-1 text-end text-md-end mt-2 mt-md-0">
      Activo:
    </div>
    <div className="col-6 col-md-1 text-start mt-2 mt-md-0">
      <input type="checkbox" id="activo" name="activo" checked={activo} disabled={true}/>
    </div>
  </div>

  {/* Spacer */}
  <div className="row mb-2" />

  {/* Botones */}
  <div className="row mb-1 g-2 justify-content-start">
    <div className="col-6 col-md-auto">
      <button type="button" className="btn btn-primary w-100" id="find"
        onClick={handleSearchShow} disabled={!noteditable}>Buscar</button>
    </div>
    <div className="col-6 col-md-auto">
      <button type="button" className="btn btn-primary w-100" id="clear"
        onClick={handleNew} disabled={!noteditable}>Nuevo</button>
    </div>
    <div className="col-6 col-md-auto">
      <button type="button" className="btn btn-primary w-100" id="edit"
        onClick={handleEdit} disabled={!codigo}>Editar</button>
    </div>
    <div className="col-6 col-md-auto">
      <button type="button" className="btn btn-primary w-100" id="remove"
        onClick={handleRemove} disabled={!codigo}>Eliminar</button>
    </div>
    <div className="col-6 col-md-auto">
      <button type="button" className="btn btn-primary w-100" id="grabar"
        onClick={handleSave} disabled={noteditable}>Guardar</button>
    </div>
    <div className="col-6 col-md-auto">
      <button type="button" className="btn btn-primary w-100" id="cancelar"
        onClick={handleCancel} disabled={noteditable}>Cancelar</button>
    </div>
  </div>

</div>




      <ToastContainer position="bottom-end">
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          
          <Toast.Body>{textoToast}</Toast.Body>
        </Toast>
        </ToastContainer>









{ /* <!-- Ventana de búsqueda de pacientes //  add show d-block to the class for the modal login to show up -->  */ }

<div className={vermodal ? 'modal fade show d-block' : 'modal fade'}
  id="pacSearchModal" tabIndex="-1" role="dialog"
  aria-labelledby="loginModalLabel" aria-hidden="false">

  <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down" role="document">
    <div className="modal-content">

      <div className="modal-header">
        <h5 className="modal-title" id="confirmModalLabel">Buscar paciente</h5>
      </div>

      <div className="modal-body">
        <div className="mb-3">
          <label htmlFor="inpCode" className="form-label">Código:</label>
          <input type="text" className="form-control" id="inpCode"
            onChange={e => { setSearchCodigo(e.target.value); setSearchMessage("") }}
            value={searchcodigo} placeholder=""/>
        </div>
        <div className="mb-3">
          <label htmlFor="inpNombre" className="form-label">Nombre y Apellido:</label>
          <input type="text" className="form-control" id="inpNombre"
            onChange={e => { setSearchNombre(e.target.value); setSearchMessage("") }}
            value={searchnombre} placeholder=""/>
        </div>
        <div className="mb-3 form-check">
          <input type="checkbox" className="form-check-input" id="inpActivo"
            onChange={handleOnChangeActivo} checked={searchactivo}/>
          <label className="form-check-label" htmlFor="inpActivo">Incluir inactivos</label>
        </div>
        {searchMessage && (
          <div className="text-danger small">{searchMessage}</div>
        )}
      </div>

      <div className="modal-footer">
        <button type="button" className="btn btn-secondary"
          onClick={handleSearchClose}>Cancelar</button>
        <button type="button" className="btn btn-primary"
          onClick={handlesearchPac}>Buscar</button>
      </div>

      {/* Grilla de resultados */}
      <div className="container-fluid px-2 pb-2">
        <div className="table-responsive">
          <table className="table table-hover table-sm align-middle mb-0">
            <thead className="table-info">
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Apellido</th>
              </tr>
            </thead>
            <tbody>
              {searchgrilla.map((unolista, index) => (
                <tr key={index} style={{ cursor: 'pointer' }}
                  onClick={() => handlepacSelected(index)}>
                  <td>{unolista.code}</td>
                  <td>{unolista.nombre}</td>
                  <td>{unolista.apellido}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</div>


{ /* <!-- Ventana de confirmación para eliminar/desactivar -->  */ }

{vermodalconf && <div className="modal-backdrop fade show"></div>}

<div className={vermodalconf ? 'modal fade show d-block' : 'modal fade'}
  id="pacConfModal" tabIndex="-1" role="dialog"
  aria-labelledby="confirmModalLabel" aria-hidden={!vermodalconf}>

  <div className="modal-dialog modal-dialog-centered" role="document">
    <div className="modal-content">

      <div className="modal-header">
        <h5 className="modal-title" id="confirmModalLabel">¿Eliminar paciente?</h5>
        <button type="button" className="btn-close" aria-label="Cerrar"
          onClick={handleConfirmClose}></button>
      </div>

      <div className="modal-body">
        <p className="mb-0">Esta acción no se puede deshacer.</p>
      </div>

      <div className="modal-footer">
        <div className="row g-2 w-100 justify-content-end m-0">
          <div className="col-6 col-md-auto">
            <button type="button" className="btn btn-secondary w-100"
              onClick={handleConfirmClose}>Cancelar</button>
          </div>
          <div className="col-6 col-md-auto">
            <button type="button" id="btnconfirm" className="btn btn-danger w-100"
              onClick={handleConfirmEliminar}>Confirmar</button>
          </div>
        </div>
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

