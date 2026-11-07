// Intervnueva.js

import { React, useState, useEffect } from "react"
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';




const Intervnueva = (props) => {

    const [codpaciente, setCodpaciente] = useState(0)  
    const [nombpaciente, setNombpaciente] = useState("")  
    const [noteditable, setNotEditable] = useState(true)
 
    const [coddoctor, setCoddoctor] = useState(0)
    const [nombDoctor, setNombDoctor] = useState("")  
    const [fechInterv, setFechInterv] = useState("")  

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
    
    const [listOrganos, setListOrganos] = useState([] )
    const [orgValores, setOrgValores] = useState([])
    
    const [listMedica, setListMedica] = useState([])
    //{"code" : 1, "nombre" : "corazón"}, {"code" : 2, "nombre" : "pulmón"}, {"code" : 3, "nombre" : "higado"}])

    const [presupErrMessage, setPresupErrMessage] = useState([])
    const [presupCosto, setPresupCosto] = useState(0)
    const [presupTiempo, setPresupTiempo] = useState(0)


      

    //const [intervGrilla, setIntervGrilla] = useState({"organo": "corazon", "tejido" : true, "sangre" : true}, {  "organo": "corazon", "tejido" :false, "sangre" : true})  
    const [intervGrilla, setIntervGrilla] = useState([])  



    // ventana de confirmación
    const [vermodalconf, setVermodalConf] = useState(false)  
 
 // toast
    const [showToast, setShowToast] = useState(false);
    const [textoToast, setTextoToast] = useState("");
    
    useEffect(() => {
     
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
            console.log("organos", data.lista)
            if ( data.lista.length)
            {

              
              setListOrganos(data.lista);

              setOrgValores(data.valores);
            }          








        })





  }, []);


  useEffect(() => {
     
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
        
        fetch(`${url1}?${params}`)
        .then( response => response.json())
        .then( data => {
            console.log(data)
            if ( data.length)
            {
              setListMedica(data);
              
            }  
          })




  }, []);



/* Handle de evento modelo */
async function handleModel(e){
    e.preventDefault()
    try {
       var json = ""
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

   console.log("org 0-bis-", listOrganos);
    setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": listOrganos[0].code, "mtejido" : false, "mtejidovis" : listOrganos[0].mtejido, 
               "msangre" : false, "msangrevis" : listOrganos[0].msangre, "tomo3d" : false, "tomo3dvis" : listOrganos[0].tomo3d, "medica" : 0}]);
        
  } 
     
  catch (error) {
      console.log(error);
      
  }
}



async function handlePresup(e){
  var errMessage = [];
  var repOrg = [];  // organos repetidos
  var orgRepetido = false;
  var cost_total = 0;
  var tiempo_total = 0;
  var cantMedic = 0;
  var almenos1 = false;
  var sininterv = false;
  if (nombpaciente === "")
  { 
     errMessage.push("Ingresar Paciente");
  }
  if (nombDoctor === "")
  {
    
    errMessage.push("Ingresar Médico");  
  } 
  if (fechInterv === "")
    {
      
      errMessage.push("Ingresar fecha de Intervención");  
    } 
      // la fecha debe estar en el futuro
  else
  {
    var dfecInter = new Date(fechInterv);
    var dhoy = new Date();
    if (! (dfecInter > dhoy))
    {
      errMessage.push("La fecha de Intervención debe ser futura");  
    } 
  }
 
  if (intervGrilla.length < 1)
    errMessage.push("Al menos cargar un órgano en la ruta");  

// recorro la grilla de intervenciones

    intervGrilla.map((c, i) => 
    {
      //verificar no se repitan los órganos
      almenos1 = false;
      if (repOrg.includes(c.organo))
      {
          orgRepetido = true
      }
      repOrg.push(c.organo)
/* tejido */
//if (vfilas[i].children[1].children[0].checked)
      if(c.mtejido)
      {
        cost_total = cost_total + orgValores.tejido_costo;
        tiempo_total = tiempo_total + orgValores.tejido_tiempo;
        almenos1 = true;
      }
      if(c.msangre)
      {
        cost_total = cost_total + orgValores.sangre_costo;
        tiempo_total = tiempo_total + orgValores.sangre_tiempo;
        almenos1 = true;
      }
      if(c.tomo3d)
        {
          cost_total = cost_total + orgValores.tomo3d_costo;
          tiempo_total = tiempo_total + orgValores.tomo3d_tiempo;
          almenos1 = true;
        }

       // contabilizar medicamentos 
       if ( c.medica != 0) 
       {
        cantMedic++;
       }

       if (!almenos1)
       {
        sininterv = true;
       } 
       
    });

    if (sininterv)
    {
      errMessage.push("Órgano sin ninguna intervención");  
    }
    if (orgRepetido)
       errMessage.push("Órganos repetidos en la ruta");  
    if (cantMedic > 2)
       errMessage.push("Más de 2 medicaciones seleccionadas");  
   
    setPresupCosto(cost_total);
    setPresupTiempo(tiempo_total);
  setPresupErrMessage(errMessage);
}

async function handleConfirm(e){
  handlePresup();
  console.log("--", presupErrMessage.length);
  if (presupErrMessage.length == 0)
  {
        var jstring;
      var url;
      e.preventDefault()
      try {

        // preparar json
        jstring = '{"paciente" : ' + codpaciente + ', "doctor" : ' + coddoctor + ', "fecint" : "' + fechInterv + '" , "costo" : ' + presupCosto + ', "tiempo" : ' + presupTiempo + ', "ruta" : [' ;
        intervGrilla.map((c, i) => 
          {
           
            if (i > 0)
              {
                jstring = jstring + ', ';
                console.log("dentro", i);
              }            
            jstring = jstring + '{ "organo" : ' + c.organo + ', "mtejido" : ' + c.mtejido + ', "msangre" : ' + c.msangre  + ', "tomo3d"  : ' + c.tomo3d + ', "medica" :  ' +  c.medica + '}'


          });
          jstring = jstring + '] }';
          url = "http://localhost:8080/robiotics/interv/addnew";
         
          console.log("interv", jstring);
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
      
        console.log("ruta add new", data)     
        setTextoToast("Datos de intervención guardados");
        setShowToast(true);  
      
    })


      } catch (error) {
          console.log(error);
          setTextoToast("Error grabando datos de intervención");
        setShowToast(true);  
          
      }
  }
  
}


async function handleEliminar(e, ind){
  const fila = ind
  const opt = e.target.value;
  var i;
  try {
    console.log("grilla filas", intervGrilla.length );
    const newintervGrilla = [];
    for(i=0; i < intervGrilla.length; i++)
    {
      if (i != fila) {
        newintervGrilla.push(intervGrilla[i])
      }

    }
      console.log("grilla nueva", newintervGrilla)
      setIntervGrilla(newintervGrilla);

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

  <h5>Intervenciones</h5>
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
      <div class="col col-2 borde">
      <input id="intervDate" onChange={e => {setFechInterv(e.target.value)}} class="form-control" type="date" value={fechInterv} />
      </div>
    </div>
   
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
  
  {  intervGrilla.map (( unolista, index ) => (
                    <>
                    <div class="row align-items-start borde-primary mb-2" >
                      <div key={index+'_1o'} class="col col-2 border-primary"> 
                          <select name="organos" onChange={(evt) => handleOrganoChange(evt, index)} value= {unolista.organo}>
                              {listOrganos.map((e, key) => {
                                  return <option key={key} value={e.code}>{e.nombre}</option>;
                              })}
                          </select>
                       </div>
                      <div key={index+'_1te'} class="col col-1 border-primary">  {unolista.mtejidovis ?  <input type="checkbox" class="form-check-input" onChange={(evt) => handleOnChangeChecked(evt, index, 1)} checked={unolista.mtejido} /> : ''}  
                        
                        
                        
                      </div>
                      <div key={index+'_1sa'} class="col col-1 border-primary">  {unolista.msangrevis ?  <input type="checkbox" class="form-check-input" onChange={(evt) => handleOnChangeChecked(evt, index, 2)} checked={unolista.msangre} /> : ''}  
                         
                      </div>
                      <div key={index+'_1to'} class="col col-1 border-primary">  {unolista.tomo3dvis ?  <input type="checkbox" class="form-check-input" onChange={(evt) => handleOnChangeChecked(evt, index, 3)} checked={unolista.tomo3d} /> : ''}  
                         
                      </div>
                      <div key={index+'_1me'} class="col col-2 border-primary"> 
                          <select name="medicas" onChange={(evt) => handleMedicaChange(evt, index)} value= {unolista.medica}>
                              <option key={0} selected value={0}> </option>
                              {listMedica.map((e, key) => {
                                  return <option key={key} value={e.code}>{e.nombre}</option>;
                              })}
                          </select>
                       </div>

                       <div key={index+'_1bo'} class="col col-1 border-primary"> <button type="button" class="btn btn-primary" id="removerow" onClick={(evt) => handleEliminar(evt, index)} >Eliminar</button>
                      </div> 
                    </div>
            
                   </>


                  ))} 




</div>

<div id="divtabcampos" class="container text-center mb-3">
    <div class="row align-items-start mb-2">
      <div class="col col-2 borde">
         <button type="button" class="btn btn-primary" id="rutaadd" onClick={handleaddRuta} >Ruta +</button>
      </div>
      <div class="col col-2 borde">
         <button type="button" class="btn btn-primary" id="presup" onClick={handlePresup} >Presupuestar</button>
      </div>
      <div class="col col-2 borde">
         <button type="button" class="btn btn-primary" id="presconfirm" onClick={handleConfirm} >Confirmar</button>
      </div>
    </div>

    <div class="row align-items-start mb-2">
      <div class="col col-2 borde">
        <label for="exampleFormControlInput1" class="form-label">Costo:</label>
      </div>
      <div class="col col-2 borde">
         <label for="exampleFormControlInput1" id="valcosto" class="form-label">{presupCosto}</label>
      </div>
    </div>
    <div class="row align-items-start mb-2">
      <div class="col col-2 borde">
      <label for="exampleFormControlInput1" class="form-label">Tiempo:</label>
      </div>
      <div class="col col-2 borde">
      <label for="exampleFormControlInput1" id="valtiempo" class="form-label">{presupTiempo}</label>
      </div>
    </div>

    <div class="row   mb-2">
       <div class="col col-3 borde  text-danger">
          

          {  presupErrMessage.map (( unolista ) => (
                    <>
                      <label class="form-label " id="err_message">{unolista}</label><br></br>
            
                   </>


                  ))} 


    </div>
   
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

export default Intervnueva;