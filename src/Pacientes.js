// Pacientes.js
import React, { useState, useEffect } from "react";

const API = "http://localhost:8080/robiotics/pac";

const Pacientes = (props) => {

  // ficha paciente 
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const [activo, setActivo] = useState(false);
  const [noteditable, setNotEditable] = useState(true);
  const [errores, setErrores] = useState({});

  // ventana búsqueda
  const [vermodal, setVermodal] = useState(false);
  const [searchcodigo, setSearchCodigo] = useState("");
  const [searchnombre, setSearchNombre] = useState("");
  const [searchactivo, setSearchActivo] = useState(false);
  const [searchgrilla, setSearchGrilla] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");

  // ventana confirmación
  const [vermodalconf, setVermodalConf] = useState(false);

  // ventanita de notificación (toast)
  const [showToast, setShowToast] = useState(false);
  const [textoToast, setTextoToast] = useState("");

  // la ventanita toast se va a los 3 segundos
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  function mostrarToast(texto) {
    setTextoToast(texto);
    setShowToast(true);
  }

  // carga en el formulario un paciente (vino del back)
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




  
  // validación

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

  //  true si todo está bien; si no, los campos con error
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

  // cuando escribimos en un campo se borra mensaje de error
  function cambiarCampo(setter, campo) {
    return (e) => {
      setter(e.target.value);
      if (errores[campo]) setErrores({ ...errores, [campo]: undefined });
    };
  }



  
  // búsqueda
  
  function handleOnChangeActivo() {
    setSearchActivo(!searchactivo);
    setSearchMessage("");
  }

  //abrir ventana búsqueda
  
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

  // cerrar o cancelar ventana búsqueda
  
  function handleSearchClose() {
    setVermodal(false);
  }

  // seleccionar sobre un paciente de la grilla 
  function handlepacSelected(fila) {
    cargarPaciente(searchgrilla[fila]);
    setVermodal(false);
  }

  // ejecut la búsqueda en el back y se completa la grilla
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

  //  botones de la ficha 

  function handleNew() {
    limpiarFicha();
    setActivo(true);
    setNotEditable(false);
  }

  function handleEdit() {
    setNotEditable(false);
  }

  // elimina el mostrar confirmación
  function handleRemove() {
    setVermodalConf(true);
  }

  function handleConfirmClose() {
    setVermodalConf(false);
  }

  // confirmación la eliminación 
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

  // guarda (alta o modificación) 
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

  // cancelar edición, o sea vuelve a traer el registro desde el back
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

  // pantalla

  const labelStyle = { fontSize: "0.75rem" };

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">

      // header superior
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

      // tarjeta ppal
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

            // botonera
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

      // modal de búsqueda 
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

      //modal de confirmación 
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

      // toast o ventanita
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

