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

  var cookie
  var options = {
    method: 'POST',
    headers: {
    'Content-Type': 'API-Key', 
    //'application/json',
    },
    mode: 'cors',
    credential : 'include',
   //credential : 'same-origin',
    //body : {},
    //body: {"user":"mark", "password" : "mar1"},
    body: JSON.stringify({"user":"luke", "password" : "luk"}),
    };

  fetch('http://localhost:8080/robiotics/usuarios/validar', options)
  .then( response => 
       //          response.json()
       cookie = 
       response.headers.getSetCookie()
       //getSetCookie()
       //get('Set-Cookie')
       
       //setBackendData (cookie)     
)
.then( data => console.log('here', cookie ))
 /* .then(  response => response.json   () )
  .then(data =>  { if (data.logged) 
    { 
      setBackendData ('no ')
    } 
    else {
      setBackendData (data.profile)
    }
                     
})
*/ 


/*
  var options1 = {
    method: 'POST',
    headers: {
    'Content-Type': 'application/json',
    'Cookie' : cookie
    },
    mode: 'cors',
    //credentials: 'include',
    credential : 'same-origin',
    //body : {},
    //body: {"user":"mark", "password" : "mar1"},
    //body: JSON.stringify('{"user":"mark", "password" : "mar1"}'),
    //body: JSON.stringify({}),
    };




    fetch('http://127.0.0.1:8080/robiotics/usuarios/userLogged', options1)
    .then(  response => response.json   () )
    .then(data =>  { if (data.logged) 
      { 
        setBackendData ('no ')
      } 
      else {
        setBackendData (data.profile)
      }
                        
})
    .catch(error => console.error(error));

*/
} , [''])


    return (
  <div>
  hola2 {backendData}
  
   
  
  </div>    
  
  
    );
  }
  
  export default Menu;
  