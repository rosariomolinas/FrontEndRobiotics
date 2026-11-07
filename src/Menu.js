import React, { useEffect, useState} from 'react'


function Menu() {
  
    const [backendData, setBackendData] = useState(['']);

  
/*
 fetch('http://localhost:8080/robiotics/usuarios/userLogged', options).then(response => response.json())
 .then(data => 
 setBackendData ('3')
)
 .catch(error => console.error(error));

 validar
*/
useEffect(() => {

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/robiotics/usuarios/validar');
  //  xhr.mode = 'cors',
    xhr.withCredentials = true;
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
   // xhr.setRequestHeader('Access-Control-Expose-Headers', 'ETag');
   
   xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
   //xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
   
   xhr.send(JSON.stringify({"user":"luke", "password" : "luk"}));

    xhr.onload = function() {
      if (xhr.status == 200) { // analiza el estado HTTP de la respuesta
        console.log('here', xhr.getResponseHeader.length )
      } else { // muestra el resultado
        console.log('Error call')
      }
    };


} , [''])


    return (
  <div>
  hola2 {backendData}
  
   
  
  </div>    
  
  
    );
  }
  
  export default Menu;
  