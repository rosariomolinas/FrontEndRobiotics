// Pacientes.js
import React, { useState, useEffect } from "react";

const API = "http://localhost:8080/robiotics/pac";

const Pacientes = (props) => {

  // ----- Ficha del paciente -----
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [activo, setActivo] = useState(false);
  const [noteditable, setNotEditable] = useState(true);
  const [errores, setErrores] = useState({});

  // ----- Ventana de búsqueda -----
  const [vermodal, setVermodal] = useState(false);
  const [searchcodigo, setSearchCodigo] = useState("");
  const [searchnombre, setSearchNombre] = useState("");
  const [searchactivo, setSearchActivo] = useState(false);
  const [searchgrilla, setSearchGrilla] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");

  // ----- Ventana de confirmación -----
  const [vermodalconf, setVermodalConf] = useState(false);

  // ----- Toast -----
  const [showToast, setShowToast] = useState(false);
  const [textoToast, setTextoToast] = useState("");

  // El toast se oculta solo a los 3 segundos
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  function mostrarToast(texto) {
    setTextoToast(texto);
    setShowToast(true);
  }

  // Carga en el formulario un paciente que vino del backend
  function cargarPaciente(p) {
    if (!p) return;
    setCodigo(p.code ?? "");
    setNombre(p.nombre ?? "");
    setApellido(p.apellido ?? "");
    setEdad(p.edad ?? "");
    setActivo(!!p.activo);
  }

  function limpiarFicha() {
    setCodigo("");
    setNombre("");
    setApellido("");
    setEdad("");
    setActivo(false);
    setErrores({});
  }

  /* ================= Validación ================= */

  const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;

  function validarTexto(valor, campo) {
    const v = valor.trim();
    if (!v) return `El ${campo} es obligatorio`;
    if (v.length < 2) return `El ${campo} debe tener al menos 2 letras`;
    if (!SOLO_LETRAS.test(v)) return `El ${campo} solo puede contener letras`;
    return null;
  }

  function validarEdad(valor) {
    if (valor === "" || valor === null) return "La edad es obligatoria";
    const n = Number(valor);
    if (!Number.isInteger(n) || n < 0 || n > 120) return "La edad debe ser un número entero entre 0 y 120";
    return null;
  }

  // Devuelve true si todo está bien; si no, marca los campos con error
  function validarFicha() {
    const e = {};
    const errNombre = validarTexto(nombre, "nombre");
    const errApellido = validarTexto(apellido, "apellido");
    const errEdad = validarEdad(edad);
    if (errNombre) e.nombre = errNombre;
    if (errApellido) e.apellido = errApellido;
    if (errEdad) e.edad = errEdad;
    setErrores(e);
    return Object.keys(e).length === 0;
  }

  // Al escribir en un campo se borra su mensaje de error
  function cambiarCampo(setter, campo) {
    return (e) => {
      setter(e.target.value);
      if (errores[campo]) setErrores({ ...errores, [campo]: undefined });
    };
  }

  /* ================= Búsqueda ================= */

  function handleOnChangeActivo() {
    setSearchActivo(!searchactivo);
    setSearchMessage("");
  }

  /* Abrir ventana de búsqueda */
  function handleSearchShow() {
    setSearchCodigo("");
    setSearchNombre("");
    setSearchActivo(false);
    setSearchGrilla([]);
    setSearchMessage("");
    limpiarFicha();
    setNotEditable(true);
    setVermodal(true);
  }

  /* Cerrar / cancelar ventana de búsqueda */
  function handleSearchClose() {
    setVermodal(false);
  }

  /* Click sobre un paciente de la grilla */
  function handlepacSelected(fila) {
    cargarPaciente(searchgrilla[fila]);
    setVermodal(false);
  }

  /* Ejecutar la búsqueda en el backend y completar la grilla */
  async function handlesearchPac() {
    const params = new URLSearchParams();
    const msgactivo = searchactivo ? "false" : "true";
    let url;

    if (searchcodigo) {
      url = `${API}/findcode`;
      params.append("code", searchcodigo);
      params.append("token", props.vtoken);
      params.append("activo", msgactivo);
    } else if (searchnombre) {
      url = `${API}/findname`;
      params.append("nombre", searchnombre);
      params.append("msg", msgactivo);
    } else {
      url = `${API}/findall`;
      params.append("msg", msgactivo);
    }

    try {
      const response = await fetch(`${url}?${params}`);
      const data = await response.json();
      const lista = Array.isArray(data.data) ? data.data : [];
      setSearchGrilla(lista);
      if (!lista.length) setSearchMessage("No hay coincidencias");
    } catch (error) {
      console.error(error);
      setSearchGrilla([]);
      setSearchMessage("Error al buscar pacientes");
    }
  }

  /* ================= Botones de la ficha ================= */

  function handleNew() {
    limpiarFicha();
    setActivo(true);
    setNotEditable(false);
  }

  function handleEdit() {
    setNotEditable(false);
  }

  /* Eliminar => mostrar confirmación */
  function handleRemove() {
    setVermodalConf(true);
  }

  function handleConfirmClose() {
    setVermodalConf(false);
  }

  /* Confirmación de eliminación */
  async function handleConfirmEliminar() {
    setVermodalConf(false);
    if (!codigo) return;

    try {
      const response = await fetch(`${API}/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({ code: String(codigo) }),
      });
      await response.json();
      limpiarFicha();
      setNotEditable(true);
      mostrarToast("Paciente eliminado");
    } catch (error) {
      console.error(error);
      mostrarToast("Error al eliminar el paciente");
    }
  }

  /* Guardar (alta o modificación) */
  async function handleSave() {
    if (!validarFicha()) {
      mostrarToast("Revise los campos marcados en rojo");
      return;
    }

    const body = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      edad: Number(edad),
    };

    let url;
    let method;
    if (codigo) {
      method = "PUT";
      url = `${API}/update`;
      body.code = Number(codigo);
    } else {
      method = "POST";
      url = `${API}/addnew`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (Array.isArray(data.data) && data.data.length) {
        cargarPaciente(data.data[0]);
      }
      setNotEditable(true);
      mostrarToast("Paciente guardado");
    } catch (error) {
      console.error(error);
      mostrarToast("Error al guardar el paciente");
    }
  }

  /* Cancelar edición: vuelve a traer el registro desde el backend */
  async function handleCancel() {
    setNotEditable(true);
    setErrores({});

    if (!codigo) {
      limpiarFicha();
      return;
    }

    const params = new URLSearchParams();
    params.append("code", codigo);
    params.append("token", props.vtoken);

    try {
      const response = await fetch(`${API}/findcode?${params}`);
      const data = await response.json();
      if (Array.isArray(data.data) && data.data.length) {
        cargarPaciente(data.data[0]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  /* ================= Pantalla ================= */

  const labelStyle = { fontSize: "0.75rem" };

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">

      {/* Header superior */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.5px" }}>
            Gestión de Pacientes
          </h3>
          <p className="text-muted small mb-0">
            Administración y registro de pacientes del sistema Robiotics.
          </p>
        </div>
        <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold">
          <i className="bi bi-shield-check me-1"></i> Módulo Activo
        </span>
      </div>

      {/* Tarjeta principal */}
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">

            <div className="card-header border-0 bg-white pt-4 px-4 pb-0">
              <div className="d-flex align-items-center">
                <div className="rounded-3 p-2 me-3 text-white d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "#0284c7", width: "42px", height: "42px" }}>
                  <i className="bi bi-person-vcard fs-5"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Ficha del Paciente</h5>
                  <small className="text-muted">Complete o busque la información del expediente</small>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="row g-3">

                  <div className="col-12 col-md-4">
                    <label htmlFor="code" className="form-label text-uppercase text-secondary fw-bold small" style={labelStyle}>
                      Código
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted">#</span>
                      <input type="text" id="code" className="form-control bg-light"
                        value={codigo} disabled placeholder="Se asigna automáticamente" />
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <label htmlFor="nombre" className="form-label text-uppercase text-secondary fw-bold small" style={labelStyle}>
                      Nombre
                    </label>
                    <input type="text" id="nombre" maxLength={50}
                      className={`form-control py-2 ${errores.nombre ? "is-invalid" : ""}`}
                      value={nombre} onChange={cambiarCampo(setNombre, "nombre")}
                      disabled={noteditable} placeholder="Ingrese el nombre" />
                    <div className="invalid-feedback">{errores.nombre}</div>
                  </div>

                  <div className="col-12 col-md-4">
                    <label htmlFor="apellido" className="form-label text-uppercase text-secondary fw-bold small" style={labelStyle}>
                      Apellido
                    </label>
                    <input type="text" id="apellido" maxLength={50}
                      className={`form-control py-2 ${errores.apellido ? "is-invalid" : ""}`}
                      value={apellido} onChange={cambiarCampo(setApellido, "apellido")}
                      disabled={noteditable} placeholder="Ingrese el apellido" />
                    <div className="invalid-feedback">{errores.apellido}</div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="edad" className="form-label text-uppercase text-secondary fw-bold small" style={labelStyle}>
                      Edad
                    </label>
                    <input type="number" id="edad" min="0" max="120" step="1"
                      className={`form-control py-2 ${errores.edad ? "is-invalid" : ""}`}
                      value={edad} onChange={cambiarCampo(setEdad, "edad")}
                      disabled={noteditable} placeholder="Edad en años" />
                    <div className="invalid-feedback">{errores.edad}</div>
                  </div>

                  <div className="col-12 col-md-6 d-flex align-items-start pt-md-4">
                    <div className="form-check form-switch p-3 bg-light rounded-3 border w-100 d-flex align-items-center justify-content-between">
                      <label className="form-check-label fw-semibold text-dark mb-0 ms-2" htmlFor="activoSwitch">
                        Estado Activo en Sistema
                      </label>
                      <input className="form-check-input ms-0 fs-5" type="checkbox" role="switch"
                        id="activoSwitch" checked={activo} disabled readOnly />
                    </div>
                  </div>

                </div>
              </form>
            </div>

            {/* Botonera */}
            <div className="card-footer border-top bg-light p-3 p-md-4">
              <div className="row g-2">
                <div className="col-6 col-md-auto">
                  <button type="button" className="btn btn-outline-primary w-100 fw-semibold"
                    onClick={handleSearchShow} disabled={!noteditable}>
                    <i className="bi bi-search me-2"></i>Buscar
                  </button>
                </div>
                <div className="col-6 col-md-auto">
                  <button type="button" className="btn btn-primary w-100 fw-semibold"
                    style={{ backgroundColor: "#0284c7", borderColor: "#0284c7" }}
                    onClick={handleNew} disabled={!noteditable}>
                    <i className="bi bi-plus-lg me-2"></i>Nuevo
                  </button>
                </div>
                <div className="col-6 col-md-auto">
                  <button type="button" className="btn btn-outline-secondary w-100 fw-semibold"
                    onClick={handleEdit} disabled={!codigo || !noteditable}>
                    <i className="bi bi-pencil-square me-2"></i>Editar
                  </button>
                </div>
                <div className="col-6 col-md-auto">
                  <button type="button" className="btn btn-outline-danger w-100 fw-semibold"
                    onClick={handleRemove} disabled={!codigo || !noteditable}>
                    <i className="bi bi-trash me-2"></i>Eliminar
                  </button>
                </div>
                <div className="col-6 col-md-auto ms-md-auto">
                  <button type="button" className="btn btn-success w-100 px-4 fw-semibold"
                    onClick={handleSave} disabled={noteditable}>
                    <i className="bi bi-check-circle me-2"></i>Guardar
                  </button>
                </div>
                <div className="col-6 col-md-auto">
                  <button type="button" className="btn btn-light border w-100 px-4 fw-semibold"
                    onClick={handleCancel} disabled={noteditable}>
                    <i className="bi bi-x-circle me-2"></i>Cancelar
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= Modal de búsqueda ================= */}
      {(vermodal || vermodalconf) && <div className="modal-backdrop fade show"></div>}

      <div className={vermodal ? "modal fade show d-block" : "modal fade"}
        id="pacSearchModal" tabIndex="-1" role="dialog"
        aria-labelledby="searchModalLabel" aria-hidden={!vermodal}>
        <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title" id="searchModalLabel">Buscar paciente</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={handleSearchClose}></button>
            </div>

            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handlesearchPac(); }}>
                <div className="mb-3">
                  <label htmlFor="inpCode" className="form-label">Código:</label>
                  <input type="text" className="form-control" id="inpCode"
                    value={searchcodigo}
                    onChange={(e) => { setSearchCodigo(e.target.value); setSearchMessage(""); }} />
                </div>
                <div className="mb-3">
                  <label htmlFor="inpNombre" className="form-label">Nombre y Apellido:</label>
                  <input type="text" className="form-control" id="inpNombre"
                    value={searchnombre}
                    onChange={(e) => { setSearchNombre(e.target.value); setSearchMessage(""); }} />
                </div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="inpActivo"
                    checked={searchactivo} onChange={handleOnChangeActivo} />
                  <label className="form-check-label" htmlFor="inpActivo">Incluir inactivos</label>
                </div>

                {searchMessage && <div className="text-danger small mb-2">{searchMessage}</div>}

                <div className="d-flex justify-content-end gap-2 mb-3">
                  <button type="button" className="btn btn-secondary" onClick={handleSearchClose}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Buscar</button>
                </div>
              </form>

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
                    {searchgrilla.length === 0 ? (
                      <tr>
                        <td colSpan="3" className="text-center text-muted">Sin resultados</td>
                      </tr>
                    ) : (
                      searchgrilla.map((unolista, index) => (
                        <tr key={unolista.code ?? index} style={{ cursor: "pointer" }}
                          onClick={() => handlepacSelected(index)}>
                          <td>{unolista.code}</td>
                          <td>{unolista.nombre}</td>
                          <td>{unolista.apellido}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= Modal de confirmación ================= */}
      <div className={vermodalconf ? "modal fade show d-block" : "modal fade"}
        id="pacConfModal" tabIndex="-1" role="dialog"
        aria-labelledby="confirmModalLabel" aria-hidden={!vermodalconf}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="confirmModalLabel">¿Eliminar paciente?</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={handleConfirmClose}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">
                Se eliminará a <strong>{nombre} {apellido}</strong>. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-footer">
              <div className="row g-2 w-100 justify-content-end m-0">
                <div className="col-6 col-md-auto">
                  <button type="button" className="btn btn-secondary w-100" onClick={handleConfirmClose}>Cancelar</button>
                </div>
                <div className="col-6 col-md-auto">
                  <button type="button" id="btnconfirm" className="btn btn-danger w-100" onClick={handleConfirmEliminar}>Confirmar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= Toast ================= */}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1100 }}>
        <div className={showToast ? "toast show" : "toast"} role="status" aria-live="polite" aria-atomic="true">
          <div className="toast-body d-flex justify-content-between align-items-center">
            {textoToast}
            <button type="button" className="btn-close ms-3" aria-label="Cerrar" onClick={() => setShowToast(false)}></button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Pacientes;





















// import React, { useState } from 'react';
// import Toast from 'react-bootstrap/Toast';
// import ToastContainer from 'react-bootstrap/ToastContainer';

// function Pacientes() {

//   // Pacientes.ts

// const Pacientes = (props) => {
           
//    const [codigo, setCodigo] = useState("")
//    const [nombre, setNombre] = useState("")  
//    const [apellido, setApellido] = useState("")  
//    const [edad, setEdad] = useState("")  
//    const [activo, setActivo] = useState(false)  
//    const [noteditable, setNotEditable] = useState(true)

//    // ventana de búsqueda
//    const [vermodal, setVermodal] = useState(false)  
//    const [searchcodigo, setSearchCodigo] = useState("")
//    const [searchnombre, setSearchNombre] = useState("")  
//    const [searchactivo, setSearchActivo] = useState(false)  
//    const [searchgrilla, setSearchGrilla] = useState([])  
//    const [searchMessage, setSearchMessage] = useState("")

//    // ventana de confirmación
//    const [vermodalconf, setVermodalConf] = useState(false)  

// // toast
//    const [showToast, setShowToast] = useState(false);
//    const [textoToast, setTextoToast] = useState("");

//    async function    handleOnChangeActivo(e){
//     setSearchActivo(!searchactivo); 
//     setSearchMessage("");
//  }
 


// /* Handle de evento modelo */
//   async function handleModel(e){
//    e.preventDefault()
//    try {
//       var json = ""
//    } catch (error) {
//        console.log(error);
       
//    }
// }

// /* Abrir ventana de búsqueda */
// async function handleSearchShow(e){
//   e.preventDefault()
//   try {
//     setSearchCodigo("");
//     setSearchNombre("")  ;
//     setSearchActivo(false);
//     setSearchGrilla([]);
    
//     handleNew();
//     setNotEditable(true)
//      setVermodal(true)
//   } catch (error) {
//       console.log(error);
      
//   }
// }

// /* Cerrar / cancelar ventana de búsqueda */

// async function handleSearchClose(e){
//   e.preventDefault()
//   try {
//     setVermodal(false)
//   } catch (error) {
//       console.log(error);
      
//   }
// }

// /* cuando se hace click sobre alguno de los pacientes de la grilla de búsqueda */

// async function handlepacSelected(fila){
  
//   try {
    
    

//     setCodigo(searchgrilla[fila].code);
//     setNombre(searchgrilla[fila].nombre);
//     setApellido(searchgrilla[fila].apellido);
//     setEdad(searchgrilla[fila].edad);
//     setActivo(searchgrilla[fila].activo);
   
//     setVermodal(false)
//   } catch (error) {
//       console.log(error);
      
//   }
// }

// /* Ejecutar la búsqueda en el backend y completar la grilla */
// async function handlesearchPac(e){
//   var msgactivo;
//   var jstring;
//   var url;
//   const params = new URLSearchParams();
//   e.preventDefault()
//   try {
//     if (searchactivo)
//       { 
//        msgactivo = 'false'
//       }
//       else {
//        msgactivo = 'true'
//       }  
//     if (searchcodigo)
//       {
//       //  jstring = '{ "code" : "' + searchcodigo +  '", "token" : "' + props.vtoken + '", ' + msgactivo +  '}';
         
//   params.append('code', searchcodigo);
//   params.append('token', props.vtoken);
//   params.append('activo', msgactivo);
//         console.log (jstring);
//         url = "http://localhost:8080/robiotics/pac/findcode";
//       }
//       else
//       {
//         if (searchnombre)
//         {
//           jstring = '{ "nombre" : "' + searchnombre + '", '+ msgactivo +  '}';
//           url = "http://localhost:8080/robiotics/pac/findname";
//           params.append('nombre', searchnombre);
//           params.append('msg', msgactivo);
//         }
//         else
//         {
//           jstring = '{'+ msgactivo + '}';
//           url = "http://localhost:8080/robiotics/pac/findall";
//           params.append('msg', msgactivo);
//         }
    
//       }



// /* fetch de búsqueda */
// /*
// var options = {
//   method: 'GET',
//   headers: {
//   'Content-Type': 'application/json'
//   },
//   mode: 'cors',
//   credential : 'include',
//   body:  jstring,
//   //JSON.stringify({"code" : 4, "activo" : true}),
  
//   };*/

// fetch(`${url}?${params}`)
//   .then(response => response.json())
//   .then(data => {
//     setSearchGrilla(data.data);
//     if (!data.data.length) {
//       setSearchMessage("No hay coincidencias");
//     }
//   })
//   .catch(error => {
//     console.error(error);
//     setSearchMessage("Error al buscar pacientes");
//   });

// /*

// fetch(url, options)
// .then( response => response.json())
// .then( data => {
//     setSearchGrilla(data.data);
//     if (! data.data.length)
//     {
//       setSearchMessage("No hay coincidencias");

//     }
//   //setSearchNombre("Pepe");
//   //setCodigo (json[0].code);    
//   //setNombre (json[0].nombre);            
  
// })

// */

//   } catch (error) {
//       console.log(error);
      
//   }

  
// }




//    async function handleNew(e){
//     setCodigo("");
//     setNombre("")  ;
//     setApellido("");
//     setEdad("");
//     setNotEditable(false);
//   }


//   /* Editar */
//   async function handleEdit(e){
//     e.preventDefault()
//     try {
   
//       setNotEditable(false);
//     } catch (error) {
//         console.log(error);
        
//     }
//  }
//   /* Remove => mostrar confirmación de eliminación */
//   async function handleRemove(e){
//     e.preventDefault()
//     try {
      
//        setVermodalConf(true);
//     } catch (error) {
//         console.log(error);
        
//     }
//  }


//  /* confirmación de eliminación */
//  async function handleConfirmEliminar (e){
//   e.preventDefault()
//   try {

//     var jstring;
//     var url;
//     var json;
//     e.preventDefault()
//     try { 
//       setNotEditable(true);
//       if (codigo)
//       { 
//       jstring = '{ "code" : "' + codigo +  '"}';
//       url = "http://localhost:8080/robiotics/pac/remove";


//       var options = {
//         method: 'DELETE',
//         headers: {
//         'Content-Type': 'application/json'
//         },
//         mode: 'cors',
//         credential : 'include',
//         body:  jstring,
        
//         };
      
//       fetch(url, options)
//       .then( response => response.json())
//       .then( data => {
//          json = data.data;
//         console.log(json[0].codigo);
//         setCodigo (json[0].codigo);    
//         setNombre (json[0].nombre);
//         setApellido (json[0].apellido);            
//         setEdad (json[0].edad);
//         setActivo (json[0].actvo);
//         setTextoToast("Paciente eliminado");
//         setShowToast(true);
//       })
//     }


//       /* traer los datos del registro que se estaba editado */
      
//     } catch (error) {
//         console.log(error);
        
//     }




//     setVermodalConf(false)
//   } catch (error) {
//       console.log(error);
      
//   }
// }
// async function handleConfirmClose(e){
// e.preventDefault()
// try {
//   setVermodalConf(false)
// } catch (error) {
//     console.log(error);
    
// }
// }



//   /* Save */
//   async function handleSave(e){

//       var jstring;
//       var url;
//       var json;
//       var vmeth;
//       e.preventDefault()
//       try { 
//         setNotEditable(true);
//         json = '"nombre" : "' + nombre + '", "apellido" : "' + apellido + '", "edad" : ' + edad + '}';
        
//         if ( codigo )
//         // update
//         {
//           vmeth = 'PUT';
//           json = '{ "code" : ' + codigo + ', ' + json;
//           console.log(json);
//           url = "http://localhost:8080/robiotics/pac/update";
//         }
//         else 
//         // create
//         {
//           vmeth = 'POST';
//           json = '{' + json;
//           console.log(json);
//           url = "http://localhost:8080/robiotics/pac/addnew";
//         }
  
//         var options = {
//           method: vmeth,
//           headers: {
//           'Content-Type': 'application/json'
//           },
//           mode: 'cors',
//           credential : 'include',
//           body:  json,
          
//           };
        
//         fetch(url, options)
//         .then( response => response.json())
//         .then( data => {
          
//            json = data.data;
//            console.log(json);
//           setCodigo (json[0].code);    
//           setNombre (json[0].nombre);
//           setApellido (json[0].apellido);            
//           setEdad (json[0].edad);
//           setActivo (json[0].actvo);

// /* toast */
// setTextoToast("Paciente guardado");
// setShowToast(true);


//         })
//     } catch (error) {
//         console.log(error);
        
//     }
//  }

//    /* Cancelar */
//    async function handleCancel(e){
//     var jstring;
//     var url;
//     var json;
//     const params = new URLSearchParams();
//     e.preventDefault()
//     try { 
//       setNotEditable(true);
//       if (codigo)
//       { 
//         jstring = '{ "code" : "' + codigo +  '", "token" : "' + props.vtoken + '"}';
//         params.append('code', codigo);
//       params.append('token', props.vtoken);
//       url = "http://localhost:8080/robiotics/pac/findcode";


//       var options = {
//         method: 'GET',
//         headers: {
//         'Content-Type': 'application/json'
//         },
//         mode: 'cors',
//         credential : 'include',
//         body:  jstring,
        
//         };
      
//       fetch(`${url}?${params}`)
//       .then( response => response.json())
//       .then( data => {
//          json = data.data;
//         console.log(json[0].codigo);
//         setCodigo (json[0].codigo);    
//         setNombre (json[0].nombre);
//         setApellido (json[0].apellido);            
//         setEdad (json[0].edad);
//         setActivo (json[0].actvo);
//       })
//     }
//     else {
//       setNombre ("");
//       setApellido ("");            
//       setEdad ("");
//     }


//       /* traer los datos del registro que se estaba editado */
      
//     } catch (error) {
//         console.log(error);
        
//     }
//  }
 
//         return (
//             <div className="container-fluid py-4 px-4 bg-light min-vh-100">
//                 {/* Header Superior Limpio */}
//                 <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
//                     <div>
//                         <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: '-0.5px' }}>
//                             Gestión de Pacientes
//                         </h3>
//                         <p className="text-muted small mb-0">
//                             Administración y registro de pacientes del sistema Robiotics.
//                         </p>
//                     </div>
//                     <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold">
//                         <i className="bi bi-shield-check me-1"></i> Módulo Activo
//                     </span>
//                 </div>

//                 {/* Tarjeta Principal del Formulario */}
//                 <div className="row justify-content-center">
//                     <div className="col-12 col-xl-10">
//                         <div className="card border-0 shadow-sm rounded-4 overflow-hidden" style={{ backgroundColor: '#ffffff' }}>
//                             {/* Cabecera de la Tarjeta */}
//                             <div className="card-header border-0 bg-white pt-4 px-4 pb-0">
//                                 <div className="d-flex align-items-center">
//                                     <div className="rounded-3 p-2 me-3 text-white d-flex align-items-center justify-content-center" style={{ backgroundColor: '#0284c7', width: '42px', height: '42px' }}>
//                                         <i className="bi bi-person-vcard fs-5"></i>
//                                     </div>
//                                     <div>
//                                         <h5 className="fw-bold mb-0 text-dark">Ficha del Paciente</h5>
//                                         <small className="text-muted">Complete o busque la información del expediente</small>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Cuerpo del Formulario en Grid de 2 Columnas */}
//                             <div className="card-body p-4">
//                                 <form onSubmit={(e) => e.preventDefault()}>
//                                     <div className="row g-3">
//                                         {/* Campo: Código */}
//                                         <div className="col-12 col-md-4">
//                                             <label className="form-label text-uppercase text-secondary fw-bold small" style={{ fontSize: '0.75rem' }}>
//                                                 Código
//                                             </label>
//                                             <div className="input-group">
//                                                 <span className="input-group-text bg-light border-end-0 text-muted">#</span>
//                                                 <input
//                                                     type="text"
//                                                     className="form-control bg-light border-start-0 rounded-end-2"
//                                                     value={codigo || ''}
//                                                     onChange={this.changeCodigo}
//                                                     placeholder="Código de paciente"
//                                                 />
//                                             </div>
//                                         </div>

//                                         {/* Campo: Nombre */}
//                                         <div className="col-12 col-md-4">
//                                             <label className="form-label text-uppercase text-secondary fw-bold small" style={{ fontSize: '0.75rem' }}>
//                                                 Nombre
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control rounded-2 py-2"
//                                                 value={nombre || ''}
//                                                 onChange={this.changeNombre}
//                                                 placeholder="Ingrese el nombre"
//                                             />
//                                         </div>

//                                         {/* Campo: Apellido */}
//                                         <div className="col-12 col-md-4">
//                                             <label className="form-label text-uppercase text-secondary fw-bold small" style={{ fontSize: '0.75rem' }}>
//                                                 Apellido
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 className="form-control rounded-2 py-2"
//                                                 value={apellido || ''}
//                                                 onChange={this.changeApellido}
//                                                 placeholder="Ingrese el apellido"
//                                             />
//                                         </div>

//                                         {/* Campo: Edad */}
//                                         <div className="col-12 col-md-6">
//                                             <label className="form-label text-uppercase text-secondary fw-bold small" style={{ fontSize: '0.75rem' }}>
//                                                 Edad
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 className="form-control rounded-2 py-2"
//                                                 value={edad || ''}
//                                                 onChange={this.changeEdad}
//                                                 placeholder="Edad en años"
//                                             />
//                                         </div>

//                                         {/* Checkbox: Activo */}
//                                         <div className="col-12 col-md-6 d-flex align-items-center pt-md-4">
//                                             <div className="form-check form-switch p-3 bg-light rounded-3 border w-100 d-flex align-items-center justify-content-between">
//                                                 <label className="form-check-label fw-semibold text-dark mb-0 ms-2" htmlFor="activoSwitch">
//                                                     Estado Activo en Sistema
//                                                 </label>
//                                                 <input
//                                                     className="form-check-input ms-0 fs-5"
//                                                     type="checkbox"
//                                                     role="switch"
//                                                     id="activoSwitch"
//                                                     checked={activo || false}
//                                                     onChange={this.changeActivo}
//                                                 />
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </form>
//                             </div>

//                             {/* Botonera de Acciones Exactas (Sin Alterar Nombres ni Funciones) */}
//                             <div className="card-footer border-top bg-light p-3 p-md-4">
//                                 <div className="d-flex flex-wrap gap-2 justify-content-md-start justify-content-center">
//                                     {/* Botón Buscar */}
//                                     <button
//                                         type="button"
//                                         className="btn btn-outline-primary px-3 py-2 rounded-3 fw-semibold d-inline-flex align-items-center"
//                                         onClick={() => handleSearchShow()}
//                                     >
//                                         <i className="bi bi-search me-2"></i> Buscar
//                                     </button>

//                                     {/* Botón Nuevo */}
//                                     <button
//                                         type="button"
//                                         className="btn btn-primary px-3 py-2 rounded-3 fw-semibold d-inline-flex align-items-center"
//                                         style={{ backgroundColor: '#0284c7', borderColor: '#0284c7' }}
//                                         onClick={() => handleNew()}
//                                     >
//                                         <i className="bi bi-plus-lg me-2"></i> Nuevo
//                                     </button>

//                                     {/* Botón Editar */}
//                                     <button
//                                         type="button"
//                                         className="btn btn-outline-secondary px-3 py-2 rounded-3 fw-semibold d-inline-flex align-items-center"
//                                         onClick={() => handleEdit()}
//                                     >
//                                         <i className="bi bi-pencil-square me-2"></i> Editar
//                                     </button>

//                                     {/* Botón Eliminar */}
//                                     <button
//                                         type="button"
//                                         className="btn btn-outline-danger px-3 py-2 rounded-3 fw-semibold d-inline-flex align-items-center"
//                                         onClick={() => handleRemove()}
//                                     >
//                                         <i className="bi bi-trash me-2"></i> Eliminar
//                                     </button>

//                                     <div className="ms-md-auto d-flex gap-2 w-100 w-md-auto mt-2 mt-md-0">
//                                         {/* Botón Guardar */}
//                                         <button
//                                             type="button"
//                                             className="btn btn-success flex-grow-1 flex-md-grow-0 px-4 py-2 rounded-3 fw-semibold d-inline-flex align-items-center justify-content-center"
//                                             onClick={() => handleSave()}
//                                         >
//                                             <i className="bi bi-check-circle me-2"></i> Guardar
//                                         </button>

//                                         {/* Botón Cancelar */}
//                                         <button
//                                             type="button"
//                                             className="btn btn-light border flex-grow-1 flex-md-grow-0 px-4 py-2 rounded-3 fw-semibold d-inline-flex align-items-center justify-content-center"
//                                             onClick={() => handleCancel()}
//                                         >
//                                             <i className="bi bi-x-circle me-2"></i> Cancelar
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }

// export default Pacientes;



































// // Pacientes.ts

// import { React, useState } from "react"
// import Toast from 'react-bootstrap/Toast';
// import ToastContainer from 'react-bootstrap/ToastContainer';

// const Pacientes = (props) => {
           
//    const [codigo, setCodigo] = useState("")
//    const [nombre, setNombre] = useState("")  
//    const [apellido, setApellido] = useState("")  
//    const [edad, setEdad] = useState("")  
//    const [activo, setActivo] = useState(false)  
//    const [noteditable, setNotEditable] = useState(true)

//    // ventana de búsqueda
//    const [vermodal, setVermodal] = useState(false)  
//    const [searchcodigo, setSearchCodigo] = useState("")
//    const [searchnombre, setSearchNombre] = useState("")  
//    const [searchactivo, setSearchActivo] = useState(false)  
//    const [searchgrilla, setSearchGrilla] = useState([])  
//    const [searchMessage, setSearchMessage] = useState("")

//    // ventana de confirmación
//    const [vermodalconf, setVermodalConf] = useState(false)  

// // toast
//    const [showToast, setShowToast] = useState(false);
//    const [textoToast, setTextoToast] = useState("");

//    async function    handleOnChangeActivo(e){
//     setSearchActivo(!searchactivo); 
//     setSearchMessage("");
//  }
 


// /* Handle de evento modelo */
//   async function handleModel(e){
//    e.preventDefault()
//    try {
//       var json = ""
//    } catch (error) {
//        console.log(error);
       
//    }
// }

// /* Abrir ventana de búsqueda */
// async function handleSearchShow(e){
//   e.preventDefault()
//   try {
//     setSearchCodigo("");
//     setSearchNombre("")  ;
//     setSearchActivo(false);
//     setSearchGrilla([]);
    
//     handleNew();
//     setNotEditable(true)
//      setVermodal(true)
//   } catch (error) {
//       console.log(error);
      
//   }
// }

// /* Cerrar / cancelar ventana de búsqueda */

// async function handleSearchClose(e){
//   e.preventDefault()
//   try {
//     setVermodal(false)
//   } catch (error) {
//       console.log(error);
      
//   }
// }

// /* cuando se hace click sobre alguno de los pacientes de la grilla de búsqueda */

// async function handlepacSelected(fila){
  
//   try {
    
    

//     setCodigo(searchgrilla[fila].code);
//     setNombre(searchgrilla[fila].nombre);
//     setApellido(searchgrilla[fila].apellido);
//     setEdad(searchgrilla[fila].edad);
//     setActivo(searchgrilla[fila].activo);
   
//     setVermodal(false)
//   } catch (error) {
//       console.log(error);
      
//   }
// }

// /* Ejecutar la búsqueda en el backend y completar la grilla */
// async function handlesearchPac(e){
//   var msgactivo;
//   var jstring;
//   var url;
//   const params = new URLSearchParams();
//   e.preventDefault()
//   try {
//     if (searchactivo)
//       { 
//        msgactivo = 'false'
//       }
//       else {
//        msgactivo = 'true'
//       }  
//     if (searchcodigo)
//       {
//       //  jstring = '{ "code" : "' + searchcodigo +  '", "token" : "' + props.vtoken + '", ' + msgactivo +  '}';
         
//   params.append('code', searchcodigo);
//   params.append('token', props.vtoken);
//   params.append('activo', msgactivo);
//         console.log (jstring);
//         url = "http://localhost:8080/robiotics/pac/findcode";
//       }
//       else
//       {
//         if (searchnombre)
//         {
//           jstring = '{ "nombre" : "' + searchnombre + '", '+ msgactivo +  '}';
//           url = "http://localhost:8080/robiotics/pac/findname";
//           params.append('nombre', searchnombre);
//           params.append('msg', msgactivo);
//         }
//         else
//         {
//           jstring = '{'+ msgactivo + '}';
//           url = "http://localhost:8080/robiotics/pac/findall";
//           params.append('msg', msgactivo);
//         }
    
//       }



// /* fetch de búsqueda */
// /*
// var options = {
//   method: 'GET',
//   headers: {
//   'Content-Type': 'application/json'
//   },
//   mode: 'cors',
//   credential : 'include',
//   body:  jstring,
//   //JSON.stringify({"code" : 4, "activo" : true}),
  
//   };*/

// fetch(`${url}?${params}`)
//   .then(response => response.json())
//   .then(data => {
//     setSearchGrilla(data.data);
//     if (!data.data.length) {
//       setSearchMessage("No hay coincidencias");
//     }
//   })
//   .catch(error => {
//     console.error(error);
//     setSearchMessage("Error al buscar pacientes");
//   });

// /*

// fetch(url, options)
// .then( response => response.json())
// .then( data => {
//     setSearchGrilla(data.data);
//     if (! data.data.length)
//     {
//       setSearchMessage("No hay coincidencias");

//     }
//   //setSearchNombre("Pepe");
//   //setCodigo (json[0].code);    
//   //setNombre (json[0].nombre);            
  
// })

// */

//   } catch (error) {
//       console.log(error);
      
//   }

  
// }




//    async function handleNew(e){
//     setCodigo("");
//     setNombre("")  ;
//     setApellido("");
//     setEdad("");
//     setNotEditable(false);
//   }


//   /* Editar */
//   async function handleEdit(e){
//     e.preventDefault()
//     try {
   
//       setNotEditable(false);
//     } catch (error) {
//         console.log(error);
        
//     }
//  }
//   /* Remove => mostrar confirmación de eliminación */
//   async function handleRemove(e){
//     e.preventDefault()
//     try {
      
//        setVermodalConf(true);
//     } catch (error) {
//         console.log(error);
        
//     }
//  }


//  /* confirmación de eliminación */
//  async function handleConfirmEliminar (e){
//   e.preventDefault()
//   try {

//     var jstring;
//     var url;
//     var json;
//     e.preventDefault()
//     try { 
//       setNotEditable(true);
//       if (codigo)
//       { 
//       jstring = '{ "code" : "' + codigo +  '"}';
//       url = "http://localhost:8080/robiotics/pac/remove";


//       var options = {
//         method: 'DELETE',
//         headers: {
//         'Content-Type': 'application/json'
//         },
//         mode: 'cors',
//         credential : 'include',
//         body:  jstring,
        
//         };
      
//       fetch(url, options)
//       .then( response => response.json())
//       .then( data => {
//          json = data.data;
//         console.log(json[0].codigo);
//         setCodigo (json[0].codigo);    
//         setNombre (json[0].nombre);
//         setApellido (json[0].apellido);            
//         setEdad (json[0].edad);
//         setActivo (json[0].actvo);
//         setTextoToast("Paciente eliminado");
//         setShowToast(true);
//       })
//     }


//       /* traer los datos del registro que se estaba editado */
      
//     } catch (error) {
//         console.log(error);
        
//     }




//     setVermodalConf(false)
//   } catch (error) {
//       console.log(error);
      
//   }
// }
// async function handleConfirmClose(e){
// e.preventDefault()
// try {
//   setVermodalConf(false)
// } catch (error) {
//     console.log(error);
    
// }
// }



//   /* Save */
//   async function handleSave(e){

//       var jstring;
//       var url;
//       var json;
//       var vmeth;
//       e.preventDefault()
//       try { 
//         setNotEditable(true);
//         json = '"nombre" : "' + nombre + '", "apellido" : "' + apellido + '", "edad" : ' + edad + '}';
        
//         if ( codigo )
//         // update
//         {
//           vmeth = 'PUT';
//           json = '{ "code" : ' + codigo + ', ' + json;
//           console.log(json);
//           url = "http://localhost:8080/robiotics/pac/update";
//         }
//         else 
//         // create
//         {
//           vmeth = 'POST';
//           json = '{' + json;
//           console.log(json);
//           url = "http://localhost:8080/robiotics/pac/addnew";
//         }
  
//         var options = {
//           method: vmeth,
//           headers: {
//           'Content-Type': 'application/json'
//           },
//           mode: 'cors',
//           credential : 'include',
//           body:  json,
          
//           };
        
//         fetch(url, options)
//         .then( response => response.json())
//         .then( data => {
          
//            json = data.data;
//            console.log(json);
//           setCodigo (json[0].code);    
//           setNombre (json[0].nombre);
//           setApellido (json[0].apellido);            
//           setEdad (json[0].edad);
//           setActivo (json[0].actvo);

// /* toast */
// setTextoToast("Paciente guardado");
// setShowToast(true);


//         })
//     } catch (error) {
//         console.log(error);
        
//     }
//  }

//    /* Cancelar */
//    async function handleCancel(e){
//     var jstring;
//     var url;
//     var json;
//     const params = new URLSearchParams();
//     e.preventDefault()
//     try { 
//       setNotEditable(true);
//       if (codigo)
//       { 
//         jstring = '{ "code" : "' + codigo +  '", "token" : "' + props.vtoken + '"}';
//         params.append('code', codigo);
//       params.append('token', props.vtoken);
//       url = "http://localhost:8080/robiotics/pac/findcode";


//       var options = {
//         method: 'GET',
//         headers: {
//         'Content-Type': 'application/json'
//         },
//         mode: 'cors',
//         credential : 'include',
//         body:  jstring,
        
//         };
      
//       fetch(`${url}?${params}`)
//       .then( response => response.json())
//       .then( data => {
//          json = data.data;
//         console.log(json[0].codigo);
//         setCodigo (json[0].codigo);    
//         setNombre (json[0].nombre);
//         setApellido (json[0].apellido);            
//         setEdad (json[0].edad);
//         setActivo (json[0].actvo);
//       })
//     }
//     else {
//       setNombre ("");
//       setApellido ("");            
//       setEdad ("");
//     }


//       /* traer los datos del registro que se estaba editado */
      
//     } catch (error) {
//         console.log(error);
        
//     }
//  }



//            return (
//                <div >
 


// <head>
//     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
//   <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
//   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
 
  
//   </head>

// <h5>Pacientes</h5>
//   <div id="divtabpac" className="container text-center ms-2 mb-2">

//   {/* Spacer */}
//   <div className="row mb-2" />

//   {/* Código */}
//   <div className="row mb-1 align-items-center">
//     <div className="col-12 col-md-2 text-md-end">
//       Código:
//     </div>
//     <div className="col-12 col-md-3">
//       <input className="form-control" type="text" id="code" name="code"
//         onChange={e => setCodigo(e.target.value)} value={codigo} disabled={true}/>
//     </div>
//   </div>

//   {/* Nombre */}
//   <div className="row mb-1 align-items-center">
//     <div className="col-12 col-md-2 text-md-end">
//       Nombre:
//     </div>
//     <div className="col-12 col-md-3">
//       <input className="form-control" type="text" id="nombre" name="nombre"
//         onChange={e => setNombre(e.target.value)} value={nombre} disabled={noteditable}/>
//     </div>
//   </div>

//   {/* Apellido */}
//   <div className="row mb-1 align-items-center">
//     <div className="col-12 col-md-2 text-md-end">
//       Apellido:
//     </div>
//     <div className="col-12 col-md-3">
//       <input className="form-control" type="text" id="apellido" name="apellido"
//         onChange={e => setApellido(e.target.value)} value={apellido} disabled={noteditable}/>
//     </div>
//   </div>

//   {/* Edad + Activo */}
//   <div className="row mb-1 align-items-center">
//     <div className="col-12 col-md-2 text-md-end">
//       Edad:
//     </div>
//     <div className="col-12 col-md-3">
//       <input className="form-control" type="text" id="edad" name="edad"
//         onChange={e => setEdad(e.target.value)} value={edad} disabled={noteditable}/>
//     </div>
//     <div className="col-6 col-md-1 text-end text-md-end mt-2 mt-md-0">
//       Activo:
//     </div>
//     <div className="col-6 col-md-1 text-start mt-2 mt-md-0">
//       <input type="checkbox" id="activo" name="activo" checked={activo} disabled={true}/>
//     </div>
//   </div>

//   {/* Spacer */}
//   <div className="row mb-2" />

//   {/* Botones */}
//   <div className="row mb-1 g-2 justify-content-start">
//     <div className="col-6 col-md-auto">
//       <button type="button" className="btn btn-primary w-100" id="find"
//         onClick={handleSearchShow} disabled={!noteditable}>Buscar</button>
//     </div>
//     <div className="col-6 col-md-auto">
//       <button type="button" className="btn btn-primary w-100" id="clear"
//         onClick={handleNew} disabled={!noteditable}>Nuevo</button>
//     </div>
//     <div className="col-6 col-md-auto">
//       <button type="button" className="btn btn-primary w-100" id="edit"
//         onClick={handleEdit} disabled={!codigo}>Editar</button>
//     </div>
//     <div className="col-6 col-md-auto">
//       <button type="button" className="btn btn-primary w-100" id="remove"
//         onClick={handleRemove} disabled={!codigo}>Eliminar</button>
//     </div>
//     <div className="col-6 col-md-auto">
//       <button type="button" className="btn btn-primary w-100" id="grabar"
//         onClick={handleSave} disabled={noteditable}>Guardar</button>
//     </div>
//     <div className="col-6 col-md-auto">
//       <button type="button" className="btn btn-primary w-100" id="cancelar"
//         onClick={handleCancel} disabled={noteditable}>Cancelar</button>
//     </div>
//   </div>

// </div>




//       <ToastContainer position="bottom-end">
//         <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          
//           <Toast.Body>{textoToast}</Toast.Body>
//         </Toast>
//         </ToastContainer>









// { /* <!-- Ventana de búsqueda de pacientes //  add show d-block to the class for the modal login to show up -->  */ }

// <div className={vermodal ? 'modal fade show d-block' : 'modal fade'}
//   id="pacSearchModal" tabIndex="-1" role="dialog"
//   aria-labelledby="loginModalLabel" aria-hidden="false">

//   <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down" role="document">
//     <div className="modal-content">

//       <div className="modal-header">
//         <h5 className="modal-title" id="confirmModalLabel">Buscar paciente</h5>
//       </div>

//       <div className="modal-body">
//         <div className="mb-3">
//           <label htmlFor="inpCode" className="form-label">Código:</label>
//           <input type="text" className="form-control" id="inpCode"
//             onChange={e => { setSearchCodigo(e.target.value); setSearchMessage("") }}
//             value={searchcodigo} placeholder=""/>
//         </div>
//         <div className="mb-3">
//           <label htmlFor="inpNombre" className="form-label">Nombre y Apellido:</label>
//           <input type="text" className="form-control" id="inpNombre"
//             onChange={e => { setSearchNombre(e.target.value); setSearchMessage("") }}
//             value={searchnombre} placeholder=""/>
//         </div>
//         <div className="mb-3 form-check">
//           <input type="checkbox" className="form-check-input" id="inpActivo"
//             onChange={handleOnChangeActivo} checked={searchactivo}/>
//           <label className="form-check-label" htmlFor="inpActivo">Incluir inactivos</label>
//         </div>
//         {searchMessage && (
//           <div className="text-danger small">{searchMessage}</div>
//         )}
//       </div>

//       <div className="modal-footer">
//         <button type="button" className="btn btn-secondary"
//           onClick={handleSearchClose}>Cancelar</button>
//         <button type="button" className="btn btn-primary"
//           onClick={handlesearchPac}>Buscar</button>
//       </div>

//       {/* Grilla de resultados */}
//       <div className="container-fluid px-2 pb-2">
//         <div className="table-responsive">
//           <table className="table table-hover table-sm align-middle mb-0">
//             <thead className="table-info">
//               <tr>
//                 <th>Código</th>
//                 <th>Nombre</th>
//                 <th>Apellido</th>
//               </tr>
//             </thead>
//             <tbody>
//               {searchgrilla.map((unolista, index) => (
//                 <tr key={index} style={{ cursor: 'pointer' }}
//                   onClick={() => handlepacSelected(index)}>
//                   <td>{unolista.code}</td>
//                   <td>{unolista.nombre}</td>
//                   <td>{unolista.apellido}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//     </div>
//   </div>
// </div>


// { /* <!-- Ventana de confirmación para eliminar/desactivar -->  */ }

// {vermodalconf && <div className="modal-backdrop fade show"></div>}

// <div className={vermodalconf ? 'modal fade show d-block' : 'modal fade'}
//   id="pacConfModal" tabIndex="-1" role="dialog"
//   aria-labelledby="confirmModalLabel" aria-hidden={!vermodalconf}>

//   <div className="modal-dialog modal-dialog-centered" role="document">
//     <div className="modal-content">

//       <div className="modal-header">
//         <h5 className="modal-title" id="confirmModalLabel">¿Eliminar paciente?</h5>
//         <button type="button" className="btn-close" aria-label="Cerrar"
//           onClick={handleConfirmClose}></button>
//       </div>

//       <div className="modal-body">
//         <p className="mb-0">Esta acción no se puede deshacer.</p>
//       </div>

//       <div className="modal-footer">
//         <div className="row g-2 w-100 justify-content-end m-0">
//           <div className="col-6 col-md-auto">
//             <button type="button" className="btn btn-secondary w-100"
//               onClick={handleConfirmClose}>Cancelar</button>
//           </div>
//           <div className="col-6 col-md-auto">
//             <button type="button" id="btnconfirm" className="btn btn-danger w-100"
//               onClick={handleConfirmEliminar}>Confirmar</button>
//           </div>
//         </div>
//       </div>

//     </div>
//   </div>
// </div>


// <div class="toast-container position-fixed bottom-0 end-0 p-3">
//   <div id="liveToastmsg" class="toast" role="alert" aria-live="assertive" aria-atomic="true">

//     <div class="toast-body">
      
//     </div>
//   </div>
// </div>













//                </div>
//            );
//    };

// export default Pacientes;
