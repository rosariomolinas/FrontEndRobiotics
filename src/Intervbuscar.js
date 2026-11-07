// Intervbuscar.js

import { React, useState } from "react"
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';




const Intervbuscar = (props) => {

    
    const [codpaciente, setCodpaciente] = useState(0)  
    const [nombpaciente, setNombpaciente] = useState("")  
    const [noteditable, setNotEditable] = useState(true)
 
    const [coddoctor, setCoddoctor] = useState(0)
    const [nombDoctor, setNombDoctor] = useState("")  
    const [fechIntervDes, setFechIntervDes] = useState("")  
    const [fechIntervHas, setFechIntervHas] = useState("")  

    // ventana de búsqueda paciente
    const [vermodal, setVermodal] = useState(false)  
    const [searchcodigo, setSearchCodigo] = useState("")
    const [searchnombre, setSearchNombre] = useState("")  
    const [searchactivo, setSearchActivo] = useState(false)  
    const [searchgrilla, setSearchGrilla] = useState([])  
    const [searchMessage, setSearchMessage] = useState("")

    // ventana de búsqueda doctor
    const [vermodalDoc, setVermodalDoc] = useState(false)  
    const [searchDoccodigo, setSearchDocCodigo] = useState("")
    const [searchDocnombre, setSearchDocNombre] = useState("")  
    const [searchDocactivo, setSearchDocActivo] = useState(false)  
    const [searchDocgrilla, setSearchDocGrilla] = useState([])  
    const [searchDocMessage, setSearchDocMessage] = useState("")
    
    const [listOrganos, setListOrganos] = useState([])
    const [orgValores, setOrgValores] = useState([])
    
    const [listMedica, setListMedica] = useState([])


    const [intervGrilla, setIntervGrilla] = useState([])  
    const [intervDetailGrilla, setIntervDetailGrilla] = useState([])  

    const [searchInterv, setsearchInterv] = useState("")

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
 async function handleVerDetalle(e, inx){
  e.preventDefault()


  try {
    // la primera vez, cargo los organos
    if (!listOrganos.length)
    {
      console.log("2")
      var jstring;
      var url;
      const params = new URLSearchParams();
      jstring = '{}';
              url = "http://localhost:8080/robiotics/org/traertodos";

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
              console.log(data.lista)
              if ( data.lista.length)
              {
                setListOrganos(data.lista);
                setOrgValores(data.valores);
              }          
            
          })
        }   
          
     // la primera vez, cargo los medicamentos
     if (!listMedica.length)
      {
        
        var jstring1;
        var url1;
        const params = new URLSearchParams();
        jstring1 = '{}';
                url1 = "http://localhost:8080/robiotics/medica/traertodos";
  
            /* fetch de búsqueda */
            /*
            var options1 = {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              mode: 'cors',
              credential : 'include',
              body:  jstring1,
              //JSON.stringify({"code" : 4, "activo" : true}),
              
              };*/
            
            fetch(`${url}?${params}`)
            .then( response => response.json())
            .then( data => {
                console.log(data)
                if ( data.length)
                {
                  setListMedica(data);
            
                }          
              
            })
          }       
   
    /*setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": listOrganos[0].code, "mtejido" : false, "mtejidovis" : listOrganos[0].mtejido, 
               "msangre" : false, "msangrevis" : listOrganos[0].msangre, "tomo3d" : false, "tomo3dvis" : listOrganos[0].tomo3d, "medica" : 0}]);
    */
  } 
     
  catch (error) {
      console.log(error);
      
  }


  console.log(intervGrilla, intervGrilla[inx].ruta)
  var nvoDetail = []
  intervGrilla[inx].ruta.map  (( unolista, index ) => {

   nvoDetail.push(unolista);
  });
  setIntervDetailGrilla(nvoDetail)
  try {
     var json = ""
  } catch (error) {
      console.log(error);
      
  }
}
/* Handle de evento modelo */
async function handleSearchInterv(e){
  var jstring;
  var url;
  const params = new URLSearchParams();
  e.preventDefault()
  try {

        jstring = '{ '
        if (codpaciente != 0)
        {
          jstring = jstring + '"paciente" : ' + codpaciente
        }
        
        if (coddoctor != 0)
          {
            if(jstring === '{ ')
            {
              jstring = jstring + '"doctor" : ' + coddoctor

            }
            else
            {
              jstring = jstring + ', "doctor" : ' + coddoctor
            }

            
          }
        if (! (fechIntervDes ==="") )
          {
            if(jstring !== '{ ')
              {
                jstring = jstring + ', "fecdes" : "' + fechIntervDes + '"'
              }
              else
              {
                jstring = jstring + ' "fecdes" : "' + fechIntervDes + '"'
  
              }
  
          }
        if (! (fechIntervHas ==="") )
          {      
            if(jstring !== '{ ')
              {    
                 jstring = jstring + ', "fechas" : "' + fechIntervHas + '"'  
              }
              else
              {
                jstring = jstring + '"fechas" : "' + fechIntervHas + '"'  

              }
          }


        //        "code" : "' + searchDoccodigo +  '", "token" : "' + props.vtoken + '", ' + msgactivo +  '}';
        jstring = jstring + '}';   
        console.log("cadena búsqueda", jstring);
        url = "http://localhost:8080/robiotics/interv/traeralgunos";
      
    
      



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
  
  };*/

fetch(url, options)
.then( response => response.json())
.then( data => {
  console.log("res", data.data);
  setIntervGrilla(data.data);
    if (! data.data.length)
    {
      console.log("No hay" );
      setsearchInterv(data.message);

    }          
  
})


  } catch (error) {
      console.log(error);
      
  }

}
 /* e.taget.value es la fila de la grilla -- inx es el elemento */ 
 async function  handleOrganoChange(e, inx){
  e.preventDefault()
  try {

    ///setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": 2, "tejido" : false, "sangre" : true}]);


    const fila = inx
    const valor = e.target.value;
    var opt;
    
    listOrganos.map((c, i) => {
      if (c.code == valor)
      {
         opt = i
      }
    });
    console.log("g valor", valor, "nuevo", opt); 
    const newintervGrilla = intervGrilla.map((c, i) => {
      if (i === fila) {
       console.log("fila org", listOrganos, valor, listOrganos[opt].nombre)
        c.organo = valor;
        c.mtejido = false
        c.mtejidovis = listOrganos[opt].mtejido
        c.msangre = false
        c.msangrevis = listOrganos[opt].msangre
        c.tomo3d = false
        c.tomo3dvis = listOrganos[opt].tomo3d

        return c;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setIntervGrilla(newintervGrilla);



     //console.log("option cambia=>", inx, "--", e.target.value)
  } catch (error) {
      console.log(error);
      
  }
}

async function handleOnChangeChecked(e, inx, campo){
  //e.preventDefault()
  try {
    const fila = inx
    //const opt = e.target.value;
    const newintervGrilla = intervGrilla.map((c, i) => {
      if (i === fila) {
       // console.log("fila", i)
        if (campo == 1) { c.mtejido = !c.mtejido }  
        if (campo == 2) { c.msangre = !c.msangre }  
        if (campo == 3) { c.tomo3d = !c.tomo3d }  
        return c;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setIntervGrilla(newintervGrilla);
  } catch (error) {
      console.log(error);
      
  }
}
 /* e.taget.value es la fila de la grilla -- inx es el elemento */ 
 async function  handleMedicaChange(e, inx){
  e.preventDefault()
  try {

    ///setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": 2, "tejido" : false, "sangre" : true}]);


    const fila = inx
    const opt = e.target.value;
    const newintervGrilla = intervGrilla.map((c, i) => {
      if (i === fila) {
       // console.log("fila", i)
        c.medica = opt;
        return c;
      } else {
        // The rest haven't changed
        return c;
      }
    });
    setIntervGrilla(newintervGrilla);

  } catch (error) {
      console.log(error);
      
  }
}

 async function handleaddRuta(e){
  e.preventDefault()
  try {
    // la primera vez, cargo los organos
    if (!listOrganos.length)
    {
      console.log("2")
      var jstring;
      var url;
      const params = new URLSearchParams();
      jstring = '{}';
              url = "http://localhost:8080/robiotics/org/traertodos";

          /* fetch de búsqueda */
         /* var options = {
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
              console.log(data.lista)
              if ( data.lista.length)
              {
                setListOrganos(data.lista);
                setOrgValores(data.valores);
              }          
            
          })
        }   
          
     // la primera vez, cargo los medicamentos
     if (!listMedica.length)
      {
        
        var jstring1;
        var url1;
        const params = new URLSearchParams();
        jstring1 = '{}';
                url1 = "http://localhost:8080/robiotics/medica/traertodos";
  
            /* fetch de búsqueda */
            /*
            var options1 = {
              method: 'POST',
              headers: {
              'Content-Type': 'application/json'
              },
              mode: 'cors',
              credential : 'include',
              body:  jstring1,
              //JSON.stringify({"code" : 4, "activo" : true}),
              
              };
            */
            fetch(`${url}?${params}`)
            .then( response => response.json())
            .then( data => {
                console.log(data)
                if ( data.length)
                {
                  setListMedica(data);
            
                }          
              
            })
          }       
   
    setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": listOrganos[0].code, "mtejido" : false, "mtejidovis" : listOrganos[0].mtejido, 
               "msangre" : false, "msangrevis" : listOrganos[0].msangre, "tomo3d" : false, "tomo3dvis" : listOrganos[0].tomo3d, "medica" : 0}]);
    
  } 
     
  catch (error) {
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
    
    
    setCodpaciente(searchgrilla[fila].code );
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
        url = "http://localhost:8080/robiotics/pac/findcode";
      }
      else
      {
        if (searchnombre)
        {
          jstring = '{ "nombre" : "' + searchnombre + '", '+ msgactivo +  '}';
          params.append('nombre', searchnombre);
          params.append('msg', msgactivo);
          url = "http://localhost:8080/robiotics/pac/findname";
    
        }
        else
        {
          jstring = '{'+ msgactivo + '}';
          params.append('msg', msgactivo);
          url = "http://localhost:8080/robiotics/pac/findall";
    
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
  
})


  } catch (error) {
      console.log(error);
      
  }
}


async function    handleOnChangeActivo(e){
  setSearchActivo(!searchactivo); 
  setSearchMessage("");
}

/* Abrir ventana de búsqueda */
async function handleSearchDocShow(e){
  e.preventDefault()
  try {
    setSearchDocCodigo("");
    setSearchDocNombre("")  ;
    setSearchDocActivo(false);
    setSearchDocGrilla([]);
    
    setNotEditable(true)
     setVermodalDoc(true)
  } catch (error) {
      console.log(error);
      
  }
}

/* Cerrar / cancelar ventana de búsqueda */

async function handleSearchDocClose(e){
  e.preventDefault()
  try {
    setVermodalDoc(false)
  } catch (error) {
      console.log(error);
      
  }
}


/* cuando se hace click sobre alguno de los doctores de la grilla de búsqueda */

async function handleDocSelected(fila){
  
  try {
    
    setCoddoctor(searchDocgrilla[fila].code);
    setNombDoctor(searchDocgrilla[fila].nombre + ' ' + searchDocgrilla[fila].apellido);
    
   
    setVermodalDoc(false)
  } catch (error) {
      console.log(error);
      
  }
}

/* Ejecutar la búsqueda en el backend y completar la grilla */
async function handlesearchDoc(e){
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
    if (searchDoccodigo)
      {
        jstring = '{ "code" : "' + searchDoccodigo +  '", "token" : "' + props.vtoken + '", ' + msgactivo +  '}';
        params.append('code', searchcodigo);
        params.append('token', props.vtoken);
        params.append('msg', msgactivo);
        url = "http://localhost:8080/robiotics/doctor/findcode";
      }
      else
      {
        if (searchDocnombre)
        {
          jstring = '{ "nombre" : "' + searchDocnombre + '", '+ msgactivo +  '}';
          params.append('nombre', searchDocnombre);
          params.append('msg', msgactivo);
          url = "http://localhost:8080/robiotics/doctor/findname";
    
        }
        else
        {
          jstring = '{'+ msgactivo + '}'; 
          params.append('msg', msgactivo);
          url = "http://localhost:8080/robiotics/doctor/findall";
    
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
    setSearchDocGrilla(data.data);
    if (! data.data.length)
    {
      setSearchDocMessage("No hay coincidencias");

    }          
  
})


  } catch (error) {
      console.log(error);
      
  }
}


async function    handleOnChangeDocActivo(e){
  setSearchDocActivo(!searchDocactivo); 
  setSearchDocMessage("");
}



           return (
               <div>
                  
                   <head>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
  <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
  <link rel="stylesheet" href="../public/css/stylePac.css"/>
  
  </head>

  <h5>Búsqueda de Intervenciones</h5>
  <div id="divtabcampos" class="container text-center mb-3">
    <div class="row align-items-start mb-2">
      <div class="col col-2 borde">
          <button type="button" class="btn btn-primary" id="find" onClick={handleSearchShow} disabled={!noteditable} >Buscar Paciente</button>
      </div>
      <div class="col col-2 borde">
        <label for="exampleFormControlInput1" id="nombpaciente" class="form-label">{nombpaciente}</label>
      </div>
    </div>

    <div class="row align-items-start mb-2">
      <div class="col col-2 borde">
        <button type="button" class="btn btn-primary" id="find" onClick={handleSearchDocShow} disabled={!noteditable} >Buscar Médico</button>
      </div>
      <div class="col col-2 borde">
        <label for="exampleFormControlInput1" id="nombdoctor" class="form-label">{nombDoctor}</label>
      </div>
    </div>

    <div class="row align-items-start mb-2 ">
      <div class="col col-2 borde">
         <label for="intervDate">Fecha Intervención:</label>
      </div>
      <div class="col col-1 borde">
         <label for="intervDateDes">Desde:</label>
      </div>
      <div class="col col-2 borde">
      <input id="intervDateDes" onChange={e => {setFechIntervDes(e.target.value)}} class="form-control" type="date" value={fechIntervDes} />
      </div>
      <div class="col col-1 borde">
         <label for="intervDateHas">Hasta:</label>
      </div>
      <div class="col col-2 borde">
      <input id="intervDateHas" onChange={e => {setFechIntervHas(e.target.value)}} class="form-control" type="date" value={fechIntervHas} />
      </div>
    </div>
   

    <div class="row align-items-start mb-2">
      <div class="col col-3 borde">
        <button type="button" class="btn btn-info" id="find" onClick={handleSearchInterv} disabled={!noteditable} >Buscar Intervenciones</button>
      </div>
      <div class="col col-4 borde">
           <label id="log_message">{searchInterv}</label>
      </div>
    </div>
  </div>
  








<div id="divtabruta" class="container text-center mb-3">
  <div class="row align-items-start mb-2 ">
    <div class="col bg-info col-2 borde">
      Fecha
    </div>
    <div class="col bg-info col-1 borde">
      Doctor
    </div>
    <div class="col bg-info col-1 borde">
      Paciente
    </div>
    <div class="col bg-info col-1 borde">
      Costo
    </div>
    <div class="col bg-info col-1 borde">
      Tiempo
    </div>
    <div class="col bg-info col-3 borde">
      &nbsp;
    </div>
  </div>
  
  {  intervGrilla.map (( unolista, index ) => (
                    <>
                    <div class="row align-items-start borde-primary mb-2" >
                      
                      <div key={index+'_1te'} class="col col-2 border-primary"> {unolista.fecint.substring(0,10)}
                        
                        
                      </div>
                      <div key={index+'_1sa'} class="col col-1 border-primary">  {unolista.doctor}
                         
                      </div>
                      <div key={index+'_1to1'} class="col col-1 border-primary">  {unolista.paciente}
                         
                      </div>
                      <div key={index+'_1to2'} class="col col-1 border-primary">  {unolista.costo}
                         
                      </div>
                      <div key={index+'_1to3'} class="col col-1 border-primary">  {unolista.tiempo}
                         
                      </div>
                      <div key={index+'_1bo4'} class="col col-3 border-primary"> <button type="button" class="btn btn-primary" id="verdetalle" onClick={(evt) => handleVerDetalle(evt, index)} >Ver detalle</button>
                      </div> 

                    </div>
            
                   </>


                  ))} 




</div>


<div id="divtabruta" class="container text-center mb-3">
  <div class="row align-items-start mb-2 ">
    <div class="col bg-info col-2 borde">
      Órgano
    </div>
    <div class="col bg-info col-1 borde">
      Tejido
    </div>
    <div class="col bg-info col-1 borde">
      Sangre
    </div>
    <div class="col bg-info col-1 borde">
      Tomografía
    </div>
    <div class="col bg-info col-2 borde">
      Medicación
    </div>
    <div class="col bg-info col-2 borde">
      &nbsp;
    </div>
  </div>
  
  {  intervDetailGrilla.map (( unolista, index ) => (
                    <>
                    <div class="row align-items-start borde-primary mb-2" >
                      <div key={index+'_2o'} class="col col-2 border-primary"> 
                          <select name="organos" onChange={(evt) => handleOrganoChange(evt, index)} value= {unolista.organo}>
                              {listOrganos.map((e, key) => {
                                  return <option key={key} value={e.code}>{e.nombre}</option>;
                              })}
                          </select>
                       </div>
                      <div key={index+'_2te'} class="col col-1 border-primary">  <input type="checkbox" class="form-check-input" disabled checked={unolista.mtejido} />   
                        
                        
                        
                      </div>
                      <div key={index+'_2sa'} class="col col-1 border-primary"> <input type="checkbox" class="form-check-input" disabled checked={unolista.msangre} />  
                         
                      </div>
                      <div key={index+'_2to'} class="col col-1 border-primary"> <input type="checkbox" class="form-check-input" disabled checked={unolista.tomo3d} /> 
                         
                      </div>
                      <div key={index+'_2me'} class="col col-2 border-primary"> 
                          <select name="medicas" onChange={(evt) => handleMedicaChange(evt, index)} value= {unolista.medica}>
                              <option key={0} selected value={0}> </option>
                              {listMedica.map((e, key) => {
                                  return <option key={key} value={e.code}>{e.nombre}</option>;
                              })}
                          </select>
                       </div>

                    </div>
            
                   </>


                  ))} 




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
                      <div key={index+'_1p'} class="col col-2 border-primary"> {unolista.code} </div>
                      <div key={index+'_2p'} class="col col-5 border-primary"> {unolista.nombre}</div>
                      <div key={index+'_3p'} class="col col-5 border-primary"> {unolista.apellido}</div>


                    </div>
            
                   </>


                  ))} 
              </div>


    </div>
  </div>
  </div>


{ /* <!-- Ventana de búsqueda de doctores //  add show d-block to the class for the modal login to show up-->  */ }

<div class={vermodalDoc ? 'modal fade show d-block' : 'modal fade'} id="docSearchModal" data-show="true" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="false">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="confirmModalLabel">Buscar doctor</h5>
        
      </div>
             <div id="loginModalBody" class="modal-body">
                <div class="form-group">
                    <label for="InputCode">Código :</label>
                    <input type="text" class="form-control" id="inpCode" aria-describedby="emailHelp" onChange={e => {setSearchDocCodigo(e.target.value); setSearchDocMessage("")}} value={searchDoccodigo}  placeholder=""/>
                </div>
                <div class="form-group">
                    <label for="InputNombre">Nombre y Apellido:</label>
                    <input type="text" class="form-control" id="inpNombre" onChange={e => {setSearchDocNombre(e.target.value); setSearchDocMessage("")}} value={searchDocnombre} placeholder=""/>
                </div>
                <div class="form-group">
                  <label for="InputActivo">Incluir inactivos</label>&nbsp;
                  <input type="checkbox" class="form-check-input" id="inpActivo" onChange={handleOnChangeDocActivo} checked={searchDocactivo} placeholder=""/>
                </div>
                <div class="form-group text-danger">
                    <label id="log_message">{searchDocMessage}</label>
                </div>
               </div>
          
              <div class="modal-footer">
                <button type="button" class="btn btn-primary"   onClick={handleSearchDocClose} data-bs-dismiss="modal">Cancelar</button>
                <button type="button" id="btnconfirm" data-bs-confirm="" onClick={handlesearchDoc}  class="btn btn-primary">Buscar</button>
              </div>


            <div id="divtabdoc" class="container text-center ml-2 mb-2">
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

                  {  searchDocgrilla.map (( unolista, index ) => (
                    <>
                    <div class="row align-items-start borde-primary" onClick={() => { handleDocSelected(index) }}>
                      <div key={index+'_1d'} class="col col-2 border-primary"> {unolista.code} </div>
                      <div key={index+'_2d'} class="col col-5 border-primary"> {unolista.nombre}</div>
                      <div key={index+'_3d'} class="col col-5 border-primary"> {unolista.apellido}</div>


                    </div>
            
                   </>


                  ))} 
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

export default Intervbuscar;