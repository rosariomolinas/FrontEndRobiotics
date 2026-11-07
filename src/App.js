// App.js
import NavBar from "./NavBar";
import { Routes, Route } from 'react-router-dom';
import React, { Component } from "react";

//import Home from './Pages/Home';
import Login  from './Login';
import Pacientes from './Pacientes';
import Organos from './Organos';
import Doctores from './Doctores';
import Intervnueva from './Intervnueva';
import Intervbuscar from './Intervbuscar';
import ChangePass from './ChangePass';

class  App extends Component {

   constructor(props){
     super(props);
     this.state = {token : ""}

   
   }

   newToken = (newToken) => {
      this.setState({ token : newToken})
   }

   getProfile = (getProfile) => {
      this.setState({ profile : getProfile})
   }

   render() {

       if (this.state.token === "")
         {
           return ( 
            <>
            <Login newToken={ this.newToken } getProfile={this.getProfile}/>
            </>
            );
   
         } 
         else {
    
   
            return (
               
               <>
                <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
      <title>Robiotics</title>

      <link rel="stylesheet" href="./../public/css/styleMain.css"/>
      <link rel="icon" href="./../public/images/fotologo.jpg"/> 
  </head>
               <NavBar vprofile = {this.state.profile}/>
                  <Routes>
                     <Route path="/pacientes" element={ <Pacientes vtoken = {this.state.token}/>} />
                     <Route path="/intervnueva" element={<Intervnueva vtoken = {this.state.token} />} />
                     <Route path="/intervbuscar" element={<Intervbuscar vtoken = {this.state.token} />} />
                     <Route path="/doctores" element={<Doctores />} />
                     <Route path="/organos" element={<Organos />} />
                     <Route path="/logout" element={<Login />} />
                     <Route path="/passchange" element={<ChangePass />} />
                     <Route path="/http://localhost:3000/home"  element={"http://localhost:3000/home"}/>
                  </Routes>
               </>
               );  
           }
}
};
 
export default App;