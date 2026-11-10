// Intervbuscar.js
import React, { useState, useEffect } from "react";

const API = "http://localhost:8080/robiotics";

/* ============================================================
   Utilidades de formato
   ============================================================ */

// "2026-11-20T00:00:00.000Z" -> "20/11/2026"
function formatFecha(valor) {
  if (!valor) return "";
  const [anio, mes, dia] = String(valor).substring(0, 10).split("-");
  return dia && mes && anio ? `${dia}/${mes}/${anio}` : String(valor);
}

function formatCosto(valor) {
  return `$ ${Number(valor || 0).toLocaleString("es-AR")}`;
}

// 135 -> "135 min (2 h 15 min)"
function formatTiempo(valor) {
  const min = Number(valor || 0);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const resto = min % 60;
  return `${min} min (${h} h${resto ? ` ${resto} min` : ""})`;
}

/* ============================================================
   Cabecera de tarjeta (ícono + título + subtítulo)
   ============================================================ */
function CabeceraTarjeta({ icono, titulo, subtitulo, children }) {
  return (
    <div className="card-header border-0 bg-white pt-4 px-4 pb-0">
      <div className="d-flex align-items-center flex-wrap gap-2">
        <div className="rounded-3 p-2 me-2 text-white d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#0284c7", width: "42px", height: "42px" }}>
          <i className={`bi ${icono} fs-5`}></i>
        </div>
        <div className="me-auto">
          <h5 className="fw-bold mb-0 text-dark">{titulo}</h5>
          <small className="text-muted">{subtitulo}</small>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ============================================================
   Modal de búsqueda reutilizable (pacientes y médicos)
   ============================================================ */
function ModalBusqueda({
  id, titulo, visible,
  codigo, setCodigo, nombre, setNombre,
  activo, onToggleActivo, mensaje, setMensaje,
  grilla, onBuscar, onCerrar, onSeleccionar,
}) {
  return (
    <div className={visible ? "modal fade show d-block" : "modal fade"}
      id={id} tabIndex="-1" role="dialog"
      aria-labelledby={`${id}Label`} aria-hidden={!visible}>
      <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down" role="document">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title" id={`${id}Label`}>{titulo}</h5>
            <button type="button" className="btn-close" aria-label="Cerrar" onClick={onCerrar}></button>
          </div>

          <div className="modal-body">
            <form onSubmit={(e) => { e.preventDefault(); onBuscar(); }}>
              <div className="mb-3">
                <label htmlFor={`${id}Code`} className="form-label">Código:</label>
                <input type="text" className="form-control" id={`${id}Code`}
                  value={codigo}
                  onChange={(e) => { setCodigo(e.target.value); setMensaje(""); }} />
              </div>
              <div className="mb-3">
                <label htmlFor={`${id}Nombre`} className="form-label">Nombre y Apellido:</label>
                <input type="text" className="form-control" id={`${id}Nombre`}
                  value={nombre}
                  onChange={(e) => { setNombre(e.target.value); setMensaje(""); }} />
              </div>
              <div className="mb-3 form-check">
                <input type="checkbox" className="form-check-input" id={`${id}Activo`}
                  checked={activo} onChange={onToggleActivo} />
                <label className="form-check-label" htmlFor={`${id}Activo`}>Incluir inactivos</label>
              </div>

              {mensaje && <div className="text-danger small mb-2">{mensaje}</div>}

              <div className="d-flex justify-content-end gap-2 mb-3">
                <button type="button" className="btn btn-secondary" onClick={onCerrar}>Cancelar</button>
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
                  {grilla.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">Sin resultados</td>
                    </tr>
                  ) : (
                    grilla.map((fila, index) => (
                      <tr key={fila.code ?? index} style={{ cursor: "pointer" }}
                        onClick={() => onSeleccionar(index)}>
                        <td>{fila.code}</td>
                        <td>{fila.nombre}</td>
                        <td>{fila.apellido}</td>
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
  );
}

/* Ícono de "sí / no" para el detalle */
function Check({ valor }) {
  return valor
    ? <i className="bi bi-check-circle-fill text-success" aria-label="Sí"></i>
    : <span className="text-muted" aria-label="No">—</span>;
}

/* ============================================================
   Pantalla de búsqueda de intervenciones
   ============================================================ */
const Intervbuscar = (props) => {

  // ----- Filtros -----
  const [codpaciente, setCodpaciente] = useState(0);
  const [nombpaciente, setNombpaciente] = useState("");
  const [coddoctor, setCoddoctor] = useState(0);
  const [nombDoctor, setNombDoctor] = useState("");
  const [fechIntervDes, setFechIntervDes] = useState("");
  const [fechIntervHas, setFechIntervHas] = useState("");

  // ----- Búsqueda de paciente -----
  const [vermodal, setVermodal] = useState(false);
  const [searchcodigo, setSearchCodigo] = useState("");
  const [searchnombre, setSearchNombre] = useState("");
  const [searchactivo, setSearchActivo] = useState(false);
  const [searchgrilla, setSearchGrilla] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");

  // ----- Búsqueda de médico -----
  const [vermodalDoc, setVermodalDoc] = useState(false);
  const [searchDoccodigo, setSearchDocCodigo] = useState("");
  const [searchDocnombre, setSearchDocNombre] = useState("");
  const [searchDocactivo, setSearchDocActivo] = useState(false);
  const [searchDocgrilla, setSearchDocGrilla] = useState([]);
  const [searchDocMessage, setSearchDocMessage] = useState("");

  // ----- Catálogos (para mostrar nombres en el detalle) -----
  const [listOrganos, setListOrganos] = useState([]);
  const [listMedica, setListMedica] = useState([]);

  // ----- Resultados -----
  const [intervGrilla, setIntervGrilla] = useState([]);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [intervDetailGrilla, setIntervDetailGrilla] = useState([]);
  const [searchInterv, setsearchInterv] = useState("");
  const [buscando, setBuscando] = useState(false);

  /* ================= Carga de catálogos ================= */

  useEffect(() => {
    fetch(`${API}/org/traertodos`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.lista)) setListOrganos(data.lista);
      })
      .catch((error) => console.error("Error cargando órganos", error));
  }, []);

  useEffect(() => {
    fetch(`${API}/medica/traertodos`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) setListMedica(data);
      })
      .catch((error) => console.error("Error cargando medicación", error));
  }, []);

  function nombreOrgano(code) {
    const o = listOrganos.find((x) => String(x.code) === String(code));
    return o ? o.nombre : `Órgano ${code}`;
  }

  function nombreMedica(code) {
    if (!code || Number(code) === 0) return null;
    const m = listMedica.find((x) => String(x.code) === String(code));
    return m ? m.nombre : `Medicación ${code}`;
  }

  /* ================= Búsqueda de intervenciones ================= */

  async function handleSearchInterv() {
    if (fechIntervDes && fechIntervHas && fechIntervDes > fechIntervHas) {
      setsearchInterv("La fecha 'Desde' no puede ser posterior a 'Hasta'");
      return;
    }

    const params = new URLSearchParams();
    if (codpaciente !== 0) params.append("paciente", codpaciente);
    if (coddoctor !== 0) params.append("doctor", coddoctor);
    if (fechIntervDes) params.append("fecdes", fechIntervDes);
    if (fechIntervHas) params.append("fechas", fechIntervHas);

    setBuscando(true);
    setsearchInterv("");
    setFilaSeleccionada(null);
    setIntervDetailGrilla([]);

    try {
      const response = await fetch(`${API}/interv/traeralgunos?${params}`);
      const data = await response.json();
      const lista = Array.isArray(data.data) ? data.data : [];
      setIntervGrilla(lista);
      if (!lista.length) setsearchInterv(data.message || "No se encontraron intervenciones");
    } catch (error) {
      console.error(error);
      setIntervGrilla([]);
      setsearchInterv("Error al buscar intervenciones");
    } finally {
      setBuscando(false);
    }
  }

  function handleLimpiarFiltros() {
    setCodpaciente(0);
    setNombpaciente("");
    setCoddoctor(0);
    setNombDoctor("");
    setFechIntervDes("");
    setFechIntervHas("");
    setIntervGrilla([]);
    setIntervDetailGrilla([]);
    setFilaSeleccionada(null);
    setsearchInterv("");
  }

  function handleVerDetalle(index) {
    const interv = intervGrilla[index];
    setFilaSeleccionada(index);
    setIntervDetailGrilla(Array.isArray(interv.ruta) ? interv.ruta : []);
  }

  /* ================= Búsqueda de paciente ================= */

  function handleSearchShow() {
    setSearchCodigo("");
    setSearchNombre("");
    setSearchActivo(false);
    setSearchGrilla([]);
    setSearchMessage("");
    setVermodal(true);
  }

  function handleSearchClose() {
    setVermodal(false);
  }

  function handlepacSelected(fila) {
    const p = searchgrilla[fila];
    setCodpaciente(p.code);
    setNombpaciente(`${p.nombre} ${p.apellido}`);
    setVermodal(false);
  }

  function handleQuitarPaciente() {
    setCodpaciente(0);
    setNombpaciente("");
  }

  function handleOnChangeActivo() {
    setSearchActivo(!searchactivo);
    setSearchMessage("");
  }

  async function handlesearchPac() {
    const params = new URLSearchParams();
    let url;

    if (searchcodigo) {
      url = `${API}/pac/findcode`;
      params.append("code", searchcodigo);
      params.append("token", props.vtoken);
    } else if (searchnombre) {
      url = `${API}/pac/findname`;
      params.append("nombre", searchnombre);
    } else {
      url = `${API}/pac/findall`;
    }
    // El backend filtra los inactivos solo si recibe activo=true
    if (!searchactivo) params.append("activo", "true");

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

  /* ================= Búsqueda de médico ================= */

  function handleSearchDocShow() {
    setSearchDocCodigo("");
    setSearchDocNombre("");
    setSearchDocActivo(false);
    setSearchDocGrilla([]);
    setSearchDocMessage("");
    setVermodalDoc(true);
  }

  function handleSearchDocClose() {
    setVermodalDoc(false);
  }

  function handleDocSelected(fila) {
    const d = searchDocgrilla[fila];
    setCoddoctor(d.code);
    setNombDoctor(`${d.nombre} ${d.apellido}`);
    setVermodalDoc(false);
  }

  function handleQuitarDoctor() {
    setCoddoctor(0);
    setNombDoctor("");
  }

  function handleOnChangeDocActivo() {
    setSearchDocActivo(!searchDocactivo);
    setSearchDocMessage("");
  }

  async function handlesearchDoc() {
    const params = new URLSearchParams();
    let url;

    // OJO: /doctor/ todavía da 404 en el backend; hay que crear esas rutas
    if (searchDoccodigo) {
      url = `${API}/doctor/findcode`;
      params.append("code", searchDoccodigo);
      params.append("token", props.vtoken);
    } else if (searchDocnombre) {
      url = `${API}/doctor/findname`;
      params.append("nombre", searchDocnombre);
    } else {
      url = `${API}/doctor/findall`;
    }
    // El backend filtra los inactivos solo si recibe activo=true
    if (!searchDocactivo) params.append("activo", "true");

    try {
      const response = await fetch(`${url}?${params}`);
      const data = await response.json();
      const lista = Array.isArray(data.data) ? data.data : [];
      setSearchDocGrilla(lista);
      if (!lista.length) setSearchDocMessage("No hay coincidencias");
    } catch (error) {
      console.error(error);
      setSearchDocGrilla([]);
      setSearchDocMessage("Error al buscar médicos");
    }
  }

  /* ================= Pantalla ================= */

  const labelClass = "form-label text-uppercase text-secondary fw-bold small";
  const labelStyle = { fontSize: "0.75rem" };
  const intervSel = filaSeleccionada !== null ? intervGrilla[filaSeleccionada] : null;

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">

      {/* Header superior */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.5px" }}>
            Buscar Intervenciones
          </h3>
          <p className="text-muted small mb-0">
            Consulta de intervenciones registradas en el sistema Robiotics.
          </p>
        </div>

      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">

          {/* ================= Tarjeta 1: Filtros ================= */}
          <div className="card border-0 shadow-sm rounded-3 bg-white mb-4">
            <CabeceraTarjeta icono="bi-funnel" titulo="Filtros de búsqueda"
              subtitulo="Todos los filtros son opcionales" />

            <div className="card-body p-4">
              <form onSubmit={(e) => { e.preventDefault(); handleSearchInterv(); }}>
                <div className="row g-3">

                  <div className="col-12 col-md-6">
                    <label htmlFor="bsqPaciente" className={labelClass} style={labelStyle}>Paciente</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted"><i className="bi bi-person"></i></span>
                      <input type="text" id="bsqPaciente" className="form-control bg-light"
                        value={nombpaciente} readOnly placeholder="Todos" />
                      {codpaciente !== 0 && (
                        <button type="button" className="btn btn-outline-secondary"
                          aria-label="Quitar paciente" title="Quitar paciente" onClick={handleQuitarPaciente}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                      <button type="button" className="btn btn-outline-primary" onClick={handleSearchShow}>
                        <i className="bi bi-search me-1"></i>Buscar
                      </button>
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="bsqMedico" className={labelClass} style={labelStyle}>Médico</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted"><i className="bi bi-person-badge"></i></span>
                      <input type="text" id="bsqMedico" className="form-control bg-light"
                        value={nombDoctor} readOnly placeholder="Todos" />
                      {coddoctor !== 0 && (
                        <button type="button" className="btn btn-outline-secondary"
                          aria-label="Quitar médico" title="Quitar médico" onClick={handleQuitarDoctor}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      )}
                      <button type="button" className="btn btn-outline-primary" onClick={handleSearchDocShow}>
                        <i className="bi bi-search me-1"></i>Buscar
                      </button>
                    </div>
                  </div>

                  <div className="col-6 col-md-3">
                    <label htmlFor="intervDateDes" className={labelClass} style={labelStyle}>Fecha desde</label>
                    <input id="intervDateDes" type="date" className="form-control py-2"
                      value={fechIntervDes} onChange={(e) => setFechIntervDes(e.target.value)} />
                  </div>

                  <div className="col-6 col-md-3">
                    <label htmlFor="intervDateHas" className={labelClass} style={labelStyle}>Fecha hasta</label>
                    <input id="intervDateHas" type="date" className="form-control py-2"
                      value={fechIntervHas} onChange={(e) => setFechIntervHas(e.target.value)} />
                  </div>

                </div>

                {searchInterv && (
                  <div className="alert alert-warning mt-3 mb-0 py-2" role="status">
                    <i className="bi bi-info-circle me-1"></i>{searchInterv}
                  </div>
                )}

                <div className="row g-2 justify-content-end mt-3">
                  <div className="col-6 col-md-auto">
                    <button type="button" className="btn btn-light border w-100 px-4 fw-semibold" onClick={handleLimpiarFiltros}>
                      <i className="bi bi-eraser me-2"></i>Limpiar
                    </button>
                  </div>
                  <div className="col-6 col-md-auto">
                    <button type="submit" className="btn btn-primary w-100 px-4 fw-semibold"
                      style={{ backgroundColor: "#0284c7", borderColor: "#0284c7" }} disabled={buscando}>
                      {buscando
                        ? <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        : <i className="bi bi-search me-2"></i>}
                      Buscar intervenciones
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* ================= Tarjeta 2: Resultados ================= */}
          <div className="card border-0 shadow-sm rounded-3 bg-white mb-4">
            <CabeceraTarjeta icono="bi-list-ul" titulo="Resultados"
              subtitulo="Haga clic en una intervención para ver su ruta de órganos">
              {intervGrilla.length > 0 && (
                <span className="badge bg-light text-dark border">{intervGrilla.length} encontradas</span>
              )}
            </CabeceraTarjeta>

            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-hover table-sm align-middle mb-0">
                  <thead className="table-info">
                    <tr>
                      <th>Fecha</th>
                      <th>Paciente</th>
                      <th>Médico</th>
                      <th className="text-end">Costo</th>
                      <th className="text-end">Tiempo</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {intervGrilla.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-3">
                          Use los filtros y presione “Buscar intervenciones”.
                        </td>
                      </tr>
                    ) : (
                      intervGrilla.map((interv, index) => (
                        <tr key={interv.code ?? interv._id ?? index}
                          className={index === filaSeleccionada ? "table-active" : ""}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleVerDetalle(index)}>
                          <td>{formatFecha(interv.fecint)}</td>
                          <td>#{interv.paciente}</td>
                          <td>#{interv.doctor}</td>
                          <td className="text-end">{formatCosto(interv.costo)}</td>
                          <td className="text-end text-nowrap">{formatTiempo(interv.tiempo)}</td>
                          <td className="text-end">
                            <button type="button" className="btn btn-outline-primary btn-sm text-nowrap"
                              onClick={(e) => { e.stopPropagation(); handleVerDetalle(index); }}>
                              <i className="bi bi-eye me-1"></i>Ver detalle
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ================= Tarjeta 3: Detalle ================= */}
          {intervSel && (
            <div className="card border-0 shadow-sm rounded-3 bg-white mb-4">
              <CabeceraTarjeta icono="bi-diagram-3" titulo="Detalle de la intervención"
                subtitulo={`Fecha ${formatFecha(intervSel.fecint)} · Paciente #${intervSel.paciente} · Médico #${intervSel.doctor}`}>
                <button type="button" className="btn-close" aria-label="Cerrar detalle"
                  onClick={() => { setFilaSeleccionada(null); setIntervDetailGrilla([]); }}></button>
              </CabeceraTarjeta>

              <div className="card-body p-4">
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 border h-100">
                      <div className={labelClass} style={labelStyle}>Costo</div>
                      <div className="fs-4 fw-bold text-dark">{formatCosto(intervSel.costo)}</div>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="p-3 bg-light rounded-3 border h-100">
                      <div className={labelClass} style={labelStyle}>Tiempo</div>
                      <div className="fs-4 fw-bold text-dark">{formatTiempo(intervSel.tiempo)}</div>
                    </div>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-sm align-middle mb-0">
                    <thead className="table-info">
                      <tr>
                        <th>Órgano</th>
                        <th className="text-center">Tejido</th>
                        <th className="text-center">Sangre</th>
                        <th className="text-center">Tomografía</th>
                        <th>Medicación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {intervDetailGrilla.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center text-muted py-3">Esta intervención no tiene órganos cargados.</td>
                        </tr>
                      ) : (
                        intervDetailGrilla.map((fila, index) => (
                          <tr key={index}>
                            <td className="fw-semibold">{nombreOrgano(fila.organo)}</td>
                            <td className="text-center"><Check valor={fila.mtejido} /></td>
                            <td className="text-center"><Check valor={fila.msangre} /></td>
                            <td className="text-center"><Check valor={fila.tomo3d} /></td>
                            <td>{nombreMedica(fila.medica) ?? <span className="text-muted">Sin medicación</span>}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ================= Modales ================= */}
      {(vermodal || vermodalDoc) && <div className="modal-backdrop fade show"></div>}

      <ModalBusqueda
        id="pacSearchModal" titulo="Buscar paciente" visible={vermodal}
        codigo={searchcodigo} setCodigo={setSearchCodigo}
        nombre={searchnombre} setNombre={setSearchNombre}
        activo={searchactivo} onToggleActivo={handleOnChangeActivo}
        mensaje={searchMessage} setMensaje={setSearchMessage}
        grilla={searchgrilla} onBuscar={handlesearchPac}
        onCerrar={handleSearchClose} onSeleccionar={handlepacSelected}
      />

      <ModalBusqueda
        id="docSearchModal" titulo="Buscar médico" visible={vermodalDoc}
        codigo={searchDoccodigo} setCodigo={setSearchDocCodigo}
        nombre={searchDocnombre} setNombre={setSearchDocNombre}
        activo={searchDocactivo} onToggleActivo={handleOnChangeDocActivo}
        mensaje={searchDocMessage} setMensaje={setSearchDocMessage}
        grilla={searchDocgrilla} onBuscar={handlesearchDoc}
        onCerrar={handleSearchDocClose} onSeleccionar={handleDocSelected}
      />

    </div>
  );
};

export default Intervbuscar;






// // Intervbuscar.js

// import { React, useState } from "react"
// import Toast from 'react-bootstrap/Toast';
// import ToastContainer from 'react-bootstrap/ToastContainer';




// const Intervbuscar = (props) => {

    
//     const [codpaciente, setCodpaciente] = useState(0)  
//     const [nombpaciente, setNombpaciente] = useState("")  
//     const [noteditable, setNotEditable] = useState(true)
 
//     const [coddoctor, setCoddoctor] = useState(0)
//     const [nombDoctor, setNombDoctor] = useState("")  
//     const [fechIntervDes, setFechIntervDes] = useState("")  
//     const [fechIntervHas, setFechIntervHas] = useState("")  

//     // ventana de búsqueda paciente
//     const [vermodal, setVermodal] = useState(false)  
//     const [searchcodigo, setSearchCodigo] = useState("")
//     const [searchnombre, setSearchNombre] = useState("")  
//     const [searchactivo, setSearchActivo] = useState(false)  
//     const [searchgrilla, setSearchGrilla] = useState([])  
//     const [searchMessage, setSearchMessage] = useState("")

//     // ventana de búsqueda doctor
//     const [vermodalDoc, setVermodalDoc] = useState(false)  
//     const [searchDoccodigo, setSearchDocCodigo] = useState("")
//     const [searchDocnombre, setSearchDocNombre] = useState("")  
//     const [searchDocactivo, setSearchDocActivo] = useState(false)  
//     const [searchDocgrilla, setSearchDocGrilla] = useState([])  
//     const [searchDocMessage, setSearchDocMessage] = useState("")
    
//     const [listOrganos, setListOrganos] = useState([])
//     const [orgValores, setOrgValores] = useState([])
    
//     const [listMedica, setListMedica] = useState([])


//     const [intervGrilla, setIntervGrilla] = useState([])  
//     const [intervDetailGrilla, setIntervDetailGrilla] = useState([])  

//     const [searchInterv, setsearchInterv] = useState("")

//     // ventana de confirmación
//     const [vermodalconf, setVermodalConf] = useState(false)  
 
//  // toast
//     const [showToast, setShowToast] = useState(false);
//     const [textoToast, setTextoToast] = useState("");
    
// /* Handle de evento modelo */
// async function handleModel(e){
//     e.preventDefault()
//     try {
//        var json = ""
//     } catch (error) {
//         console.log(error);
        
//     }
//  }
//  async function handleVerDetalle(e, inx){
//   e.preventDefault()


//   try {
//     // la primera vez, cargo los organos
//     if (!listOrganos.length)
//     {
//       console.log("2")
//       var jstring;
//       var url;
//       const params = new URLSearchParams();
//       jstring = '{}';
//               url = "http://localhost:8080/robiotics/org/traertodos";

//           /* fetch de búsqueda */
//           /*
//           var options = {
//             method: 'POST',
//             headers: {
//             'Content-Type': 'application/json'
//             },
//             mode: 'cors',
//             credential : 'include',
//             body:  jstring,
//             //JSON.stringify({"code" : 4, "activo" : true}),
            
//             };
//             */
          
//           fetch(`${url}?${params}`)
//           .then( response => response.json())
//           .then( data => {
//               console.log(data.lista)
//               if ( data.lista.length)
//               {
//                 setListOrganos(data.lista);
//                 setOrgValores(data.valores);
//               }          
            
//           })
//         }   
          
//      // la primera vez, cargo los medicamentos
//      if (!listMedica.length)
//       {
        
//         var jstring1;
//         var url1;
//         const params = new URLSearchParams();
//         jstring1 = '{}';
//                 url1 = "http://localhost:8080/robiotics/medica/traertodos";
  
//             /* fetch de búsqueda */
//             /*
//             var options1 = {
//               method: 'POST',
//               headers: {
//               'Content-Type': 'application/json'
//               },
//               mode: 'cors',
//               credential : 'include',
//               body:  jstring1,
//               //JSON.stringify({"code" : 4, "activo" : true}),
              
//               };*/
            
//             fetch(`${url}?${params}`)
//             .then( response => response.json())
//             .then( data => {
//                 console.log(data)
//                 if ( data.length)
//                 {
//                   setListMedica(data);
            
//                 }          
              
//             })
//           }       
   
//     /*setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": listOrganos[0].code, "mtejido" : false, "mtejidovis" : listOrganos[0].mtejido, 
//                "msangre" : false, "msangrevis" : listOrganos[0].msangre, "tomo3d" : false, "tomo3dvis" : listOrganos[0].tomo3d, "medica" : 0}]);
//     */
//   } 
     
//   catch (error) {
//       console.log(error);
      
//   }


//   console.log(intervGrilla, intervGrilla[inx].ruta)
//   var nvoDetail = []
//   intervGrilla[inx].ruta.map  (( unolista, index ) => {

//    nvoDetail.push(unolista);
//   });
//   setIntervDetailGrilla(nvoDetail)
//   try {
//      var json = ""
//   } catch (error) {
//       console.log(error);
      
//   }
// }
// /* Handle de evento modelo */
// async function handleSearchInterv(e){
//   var jstring;
//   var url;
//   const params = new URLSearchParams();
//   e.preventDefault()
//   try {

//         jstring = '{ '
//         if (codpaciente != 0)
//         {
//           jstring = jstring + '"paciente" : ' + codpaciente
//           params.append("paciente", codpaciente);
//         }
        
//         if (coddoctor != 0)
//           {
//             if(jstring === '{ ')
//             {
//               jstring = jstring + '"doctor" : ' + coddoctor;
//               params.append("doctor", coddoctor);

//             }
//             else
//             {
//               jstring = jstring + ', "doctor" : ' + coddoctor;
//               params.append("doctor", coddoctor);
//             }

            
//           }
//         if (! (fechIntervDes ==="") )
//           {
//             if(jstring !== '{ ')
//               {
//                 jstring = jstring + ', "fecdes" : "' + fechIntervDes + '"';
//                  params.append("fecdes", fechIntervDes);
//               }
//               else
//               {
//                 jstring = jstring + ' "fecdes" : "' + fechIntervDes + '"';
//                 params.append("fecdes", fechIntervDes);
//               }
  
//           }
//         if (! (fechIntervHas ==="") )
//           {      
//             if(jstring !== '{ ')
//               {    
//                  jstring = jstring + ', "fechas" : "' + fechIntervHas + '"'  ;
//                  params.append("fechas", fechIntervHas);
//               }
//               else
//               {
//                 jstring = jstring + '"fechas" : "' + fechIntervHas + '"' ;
//                 params.append("fechas", fechIntervHas); 

//               }
//           }


//         //        "code" : "' + searchDoccodigo +  '", "token" : "' + props.vtoken + '", ' + msgactivo +  '}';
//         jstring = jstring + '}';   
//         console.log("cadena búsqueda", jstring);
//         url = "http://localhost:8080/robiotics/interv/traeralgunos";
      
    
      



// /* fetch de búsqueda */
// /*
// var options = {
//   method: 'POST',
//   headers: {
//   'Content-Type': 'application/json'
//   },
//   mode: 'cors',
//   credential : 'include',
//   body:  jstring,
  
//   };*/

// fetch(`${url}?${params}`)
// .then( response => response.json())
// .then( data => {
//   console.log("res", data.data);
//   setIntervGrilla(data.data);
//     if (! data.data.length)
//     {
//       console.log("No hay" );
//       setsearchInterv(data.message);

//     }          
  
// })


//   } catch (error) {
//       console.log(error);
      
//   }

// }
//  /* e.taget.value es la fila de la grilla -- inx es el elemento */ 
//  async function  handleOrganoChange(e, inx){
//   e.preventDefault()
//   try {

//     ///setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": 2, "tejido" : false, "sangre" : true}]);


//     const fila = inx
//     const valor = e.target.value;
//     var opt;
    
//     listOrganos.map((c, i) => {
//       if (c.code == valor)
//       {
//          opt = i
//       }
//     });
//     console.log("g valor", valor, "nuevo", opt); 
//     const newintervGrilla = intervGrilla.map((c, i) => {
//       if (i === fila) {
//        console.log("fila org", listOrganos, valor, listOrganos[opt].nombre)
//         c.organo = valor;
//         c.mtejido = false
//         c.mtejidovis = listOrganos[opt].mtejido
//         c.msangre = false
//         c.msangrevis = listOrganos[opt].msangre
//         c.tomo3d = false
//         c.tomo3dvis = listOrganos[opt].tomo3d

//         return c;
//       } else {
//         // The rest haven't changed
//         return c;
//       }
//     });
//     setIntervGrilla(newintervGrilla);



//      //console.log("option cambia=>", inx, "--", e.target.value)
//   } catch (error) {
//       console.log(error);
      
//   }
// }

// async function handleOnChangeChecked(e, inx, campo){
//   //e.preventDefault()
//   try {
//     const fila = inx
//     //const opt = e.target.value;
//     const newintervGrilla = intervGrilla.map((c, i) => {
//       if (i === fila) {
//        // console.log("fila", i)
//         if (campo == 1) { c.mtejido = !c.mtejido }  
//         if (campo == 2) { c.msangre = !c.msangre }  
//         if (campo == 3) { c.tomo3d = !c.tomo3d }  
//         return c;
//       } else {
//         // The rest haven't changed
//         return c;
//       }
//     });
//     setIntervGrilla(newintervGrilla);
//   } catch (error) {
//       console.log(error);
      
//   }
// }
//  /* e.taget.value es la fila de la grilla -- inx es el elemento */ 
//  async function  handleMedicaChange(e, inx){
//   e.preventDefault()
//   try {

//     ///setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": 2, "tejido" : false, "sangre" : true}]);


//     const fila = inx
//     const opt = e.target.value;
//     const newintervGrilla = intervGrilla.map((c, i) => {
//       if (i === fila) {
//        // console.log("fila", i)
//         c.medica = opt;
//         return c;
//       } else {
//         // The rest haven't changed
//         return c;
//       }
//     });
//     setIntervGrilla(newintervGrilla);

//   } catch (error) {
//       console.log(error);
      
//   }
// }

//  async function handleaddRuta(e){
//   e.preventDefault()
//   try {
//     // la primera vez, cargo los organos
//     if (!listOrganos.length)
//     {
//       console.log("2")
//       var jstring;
//       var url;
//       const params = new URLSearchParams();
//       jstring = '{}';
//               url = "http://localhost:8080/robiotics/org/traertodos";

//           /* fetch de búsqueda */
//          /* var options = {
//             method: 'POST',
//             headers: {
//             'Content-Type': 'application/json'
//             },
//             mode: 'cors',
//             credential : 'include',
//             body:  jstring,
//             //JSON.stringify({"code" : 4, "activo" : true}),
            
//             };
//             */
          
//           fetch(`${url}?${params}`)
//           .then( response => response.json())
//           .then( data => {
//               console.log(data.lista)
//               if ( data.lista.length)
//               {
//                 setListOrganos(data.lista);
//                 setOrgValores(data.valores);
//               }          
            
//           })
//         }   
          
//      // la primera vez, cargo los medicamentos
//      if (!listMedica.length)
//       {
        
//         var jstring1;
//         var url1;
//         const params = new URLSearchParams();
//         jstring1 = '{}';
//                 url1 = "http://localhost:8080/robiotics/medica/traertodos";
  
//             /* fetch de búsqueda */
//             /*
//             var options1 = {
//               method: 'POST',
//               headers: {
//               'Content-Type': 'application/json'
//               },
//               mode: 'cors',
//               credential : 'include',
//               body:  jstring1,
//               //JSON.stringify({"code" : 4, "activo" : true}),
              
//               };
//             */
//             fetch(`${url}?${params}`)
//             .then( response => response.json())
//             .then( data => {
//                 console.log(data)
//                 if ( data.length)
//                 {
//                   setListMedica(data);
            
//                 }          
              
//             })
//           }       
   
//     setIntervGrilla (intervGrilla => [...intervGrilla, {"organo": listOrganos[0].code, "mtejido" : false, "mtejidovis" : listOrganos[0].mtejido, 
//                "msangre" : false, "msangrevis" : listOrganos[0].msangre, "tomo3d" : false, "tomo3dvis" : listOrganos[0].tomo3d, "medica" : 0}]);
    
//   } 
     
//   catch (error) {
//       console.log(error);
      
//   }
// }



// /* Abrir ventana de búsqueda */
// async function handleSearchShow(e){
//   e.preventDefault()
//   try {
//     setSearchCodigo("");
//     setSearchNombre("")  ;
//     setSearchActivo(false);
//     setSearchGrilla([]);
    

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
    
    
//     setCodpaciente(searchgrilla[fila].code );
//     setNombpaciente(searchgrilla[fila].nombre + ' ' + searchgrilla[fila].apellido);
    
   
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
//        msgactivo = '"activo" : false'
//       }
//       else {
//        msgactivo = '"activo" : true'
//       }  
//     if (searchcodigo)
//       {
//         jstring = '{ "code" : "' + searchcodigo +  '", "token" : "' + props.vtoken + '", ' + msgactivo +  '}';
//         params.append('code', searchcodigo);
//         params.append('token', props.vtoken);
//         params.append('msg', msgactivo);
//         url = "http://localhost:8080/robiotics/pac/findcode";
//       }
//       else
//       {
//         if (searchnombre)
//         {
//           jstring = '{ "nombre" : "' + searchnombre + '", '+ msgactivo +  '}';
//           params.append('nombre', searchnombre);
//           params.append('msg', msgactivo);
//           url = "http://localhost:8080/robiotics/pac/findname";
    
//         }
//         else
//         {
//           jstring = '{'+ msgactivo + '}';
//           params.append('msg', msgactivo);
//           url = "http://localhost:8080/robiotics/pac/findall";
    
//         }
    
//       }



// /* fetch de búsqueda */
// /*
// var options = {
//   method: 'POST',
//   headers: {
//   'Content-Type': 'application/json'
//   },
//   mode: 'cors',
//   credential : 'include',
//   body:  jstring,
//   //JSON.stringify({"code" : 4, "activo" : true}),
  
//   };
// */
// fetch(`${url}?${params}`)
// .then( response => response.json())
// .then( data => {
  
//     setSearchGrilla(data.data);
//     if (! data.data.length)
//     {
//       setSearchMessage("No hay coincidencias");

//     }          
  
// })


//   } catch (error) {
//       console.log(error);
      
//   }
// }


// async function    handleOnChangeActivo(e){
//   setSearchActivo(!searchactivo); 
//   setSearchMessage("");
// }

// /* Abrir ventana de búsqueda */
// async function handleSearchDocShow(e){
//   e.preventDefault()
//   try {
//     setSearchDocCodigo("");
//     setSearchDocNombre("")  ;
//     setSearchDocActivo(false);
//     setSearchDocGrilla([]);
    
//     setNotEditable(true)
//      setVermodalDoc(true)
//   } catch (error) {
//       console.log(error);
      
//   }
// }

// /* Cerrar / cancelar ventana de búsqueda */

// async function handleSearchDocClose(e){
//   e.preventDefault()
//   try {
//     setVermodalDoc(false)
//   } catch (error) {
//       console.log(error);
      
//   }
// }


// /* cuando se hace click sobre alguno de los doctores de la grilla de búsqueda */

// async function handleDocSelected(fila){
  
//   try {
    
//     setCoddoctor(searchDocgrilla[fila].code);
//     setNombDoctor(searchDocgrilla[fila].nombre + ' ' + searchDocgrilla[fila].apellido);
    
   
//     setVermodalDoc(false)
//   } catch (error) {
//       console.log(error);
      
//   }
// }

// /* Ejecutar la búsqueda en el backend y completar la grilla */
// async function handlesearchDoc(e){
//   var msgactivo;
//   var jstring;
//   var url;
//   const params = new URLSearchParams();
//   e.preventDefault()
//   try {
//     if (searchactivo)
//       { 
//        msgactivo = '"activo" : false'
//       }
//       else {
//        msgactivo = '"activo" : true'
//       }  
//     if (searchDoccodigo)
//       {
//         jstring = '{ "code" : "' + searchDoccodigo +  '", "token" : "' + props.vtoken + '", ' + msgactivo +  '}';
//         params.append('code', searchcodigo);
//         params.append('token', props.vtoken);
//         params.append('msg', msgactivo);
//         url = "http://localhost:8080/robiotics/doctor/findcode";
//       }
//       else
//       {
//         if (searchDocnombre)
//         {
//           jstring = '{ "nombre" : "' + searchDocnombre + '", '+ msgactivo +  '}';
//           params.append('nombre', searchDocnombre);
//           params.append('msg', msgactivo);
//           url = "http://localhost:8080/robiotics/doctor/findname";
    
//         }
//         else
//         {
//           jstring = '{'+ msgactivo + '}'; 
//           params.append('msg', msgactivo);
//           url = "http://localhost:8080/robiotics/doctor/findall";
    
//         }
    
//       }



// /* fetch de búsqueda */
// /*
// var options = {
//   method: 'POST',
//   headers: {
//   'Content-Type': 'application/json'
//   },
//   mode: 'cors',
//   credential : 'include',
//   body:  jstring,
//   //JSON.stringify({"code" : 4, "activo" : true}),
  
//   };
//   */

// fetch(`${url}?${params}`)
// .then( response => response.json())
// .then( data => {
//     setSearchDocGrilla(data.data);
//     if (! data.data.length)
//     {
//       setSearchDocMessage("No hay coincidencias");

//     }          
  
// })


//   } catch (error) {
//       console.log(error);
      
//   }
// }


// async function    handleOnChangeDocActivo(e){
//   setSearchDocActivo(!searchDocactivo); 
//   setSearchDocMessage("");
// }



//            return (
//                <div>
                  
//                    <head>
//     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous"/>
//   <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js" integrity="sha384-IQsoLXl5PILFhosVNubq5LC7Qb9DXgDA9i+tQ8Zj3iwWAwPtgFTxbJ8NT4GN1R8p" crossorigin="anonymous"></script>
//   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.min.js" integrity="sha384-cVKIPhGWiC2Al4u+LWgxfKTRIcfu0JTxR+EQDz/bgldoEyl4H0zUF0QKbrJ0EcQF" crossorigin="anonymous"></script>
//   <link rel="stylesheet" href="../public/css/stylePac.css"/>
  
//   </head>

//   <h5>Búsqueda de Intervenciones</h5>
//   <div id="divtabcampos" class="container text-center mb-3">
//     <div class="row align-items-start mb-2">
//       <div class="col col-2 borde">
//           <button type="button" class="btn btn-primary" id="find" onClick={handleSearchShow} disabled={!noteditable} >Buscar Paciente</button>
//       </div>
//       <div class="col col-2 borde">
//         <label for="exampleFormControlInput1" id="nombpaciente" class="form-label">{nombpaciente}</label>
//       </div>
//     </div>

//     <div class="row align-items-start mb-2">
//       <div class="col col-2 borde">
//         <button type="button" class="btn btn-primary" id="find" onClick={handleSearchDocShow} disabled={!noteditable} >Buscar Médico</button>
//       </div>
//       <div class="col col-2 borde">
//         <label for="exampleFormControlInput1" id="nombdoctor" class="form-label">{nombDoctor}</label>
//       </div>
//     </div>

//     <div class="row align-items-start mb-2 ">
//       <div class="col col-2 borde">
//          <label for="intervDate">Fecha Intervención:</label>
//       </div>
//       <div class="col col-1 borde">
//          <label for="intervDateDes">Desde:</label>
//       </div>
//       <div class="col col-2 borde">
//       <input id="intervDateDes" onChange={e => {setFechIntervDes(e.target.value)}} class="form-control" type="date" value={fechIntervDes} />
//       </div>
//       <div class="col col-1 borde">
//          <label for="intervDateHas">Hasta:</label>
//       </div>
//       <div class="col col-2 borde">
//       <input id="intervDateHas" onChange={e => {setFechIntervHas(e.target.value)}} class="form-control" type="date" value={fechIntervHas} />
//       </div>
//     </div>
   

//     <div class="row align-items-start mb-2">
//       <div class="col col-3 borde">
//         <button type="button" class="btn btn-info" id="find" onClick={handleSearchInterv} disabled={!noteditable} >Buscar Intervenciones</button>
//       </div>
//       <div class="col col-4 borde">
//            <label id="log_message">{searchInterv}</label>
//       </div>
//     </div>
//   </div>
  








// <div id="divtabruta" class="container text-center mb-3">
//   <div class="row align-items-start mb-2 ">
//     <div class="col bg-info col-2 borde">
//       Fecha
//     </div>
//     <div class="col bg-info col-1 borde">
//       Doctor
//     </div>
//     <div class="col bg-info col-1 borde">
//       Paciente
//     </div>
//     <div class="col bg-info col-1 borde">
//       Costo
//     </div>
//     <div class="col bg-info col-1 borde">
//       Tiempo
//     </div>
//     <div class="col bg-info col-3 borde">
//       &nbsp;
//     </div>
//   </div>
  
//   {  intervGrilla.map (( unolista, index ) => (
//                     <>
//                     <div class="row align-items-start borde-primary mb-2" >
                      
//                       <div key={index+'_1te'} class="col col-2 border-primary"> {unolista.fecint.substring(0,10)}
                        
                        
//                       </div>
//                       <div key={index+'_1sa'} class="col col-1 border-primary">  {unolista.doctor}
                         
//                       </div>
//                       <div key={index+'_1to1'} class="col col-1 border-primary">  {unolista.paciente}
                         
//                       </div>
//                       <div key={index+'_1to2'} class="col col-1 border-primary">  {unolista.costo}
                         
//                       </div>
//                       <div key={index+'_1to3'} class="col col-1 border-primary">  {unolista.tiempo}
                         
//                       </div>
//                       <div key={index+'_1bo4'} class="col col-3 border-primary"> <button type="button" class="btn btn-primary" id="verdetalle" onClick={(evt) => handleVerDetalle(evt, index)} >Ver detalle</button>
//                       </div> 

//                     </div>
            
//                    </>


//                   ))} 




// </div>


// <div id="divtabruta" class="container text-center mb-3">
//   <div class="row align-items-start mb-2 ">
//     <div class="col bg-info col-2 borde">
//       Órgano
//     </div>
//     <div class="col bg-info col-1 borde">
//       Tejido
//     </div>
//     <div class="col bg-info col-1 borde">
//       Sangre
//     </div>
//     <div class="col bg-info col-1 borde">
//       Tomografía
//     </div>
//     <div class="col bg-info col-2 borde">
//       Medicación
//     </div>
//     <div class="col bg-info col-2 borde">
//       &nbsp;
//     </div>
//   </div>
  
//   {  intervDetailGrilla.map (( unolista, index ) => (
//                     <>
//                     <div class="row align-items-start borde-primary mb-2" >
//                       <div key={index+'_2o'} class="col col-2 border-primary"> 
//                           <select name="organos" onChange={(evt) => handleOrganoChange(evt, index)} value= {unolista.organo}>
//                               {listOrganos.map((e, key) => {
//                                   return <option key={key} value={e.code}>{e.nombre}</option>;
//                               })}
//                           </select>
//                        </div>
//                       <div key={index+'_2te'} class="col col-1 border-primary">  <input type="checkbox" class="form-check-input" disabled checked={unolista.mtejido} />   
                        
                        
                        
//                       </div>
//                       <div key={index+'_2sa'} class="col col-1 border-primary"> <input type="checkbox" class="form-check-input" disabled checked={unolista.msangre} />  
                         
//                       </div>
//                       <div key={index+'_2to'} class="col col-1 border-primary"> <input type="checkbox" class="form-check-input" disabled checked={unolista.tomo3d} /> 
                         
//                       </div>
//                       <div key={index+'_2me'} class="col col-2 border-primary"> 
//                           <select name="medicas" onChange={(evt) => handleMedicaChange(evt, index)} value= {unolista.medica}>
//                               <option key={0} selected value={0}> </option>
//                               {listMedica.map((e, key) => {
//                                   return <option key={key} value={e.code}>{e.nombre}</option>;
//                               })}
//                           </select>
//                        </div>

//                     </div>
            
//                    </>


//                   ))} 




// </div>

  


// { /* <!-- Ventana de búsqueda de pacientes //  add show d-block to the class for the modal login to show up-->  */ }

// <div class={vermodal ? 'modal fade show d-block' : 'modal fade'} id="pacSearchModal" data-show="true" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="false">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h5 class="modal-title" id="confirmModalLabel">Buscar paciente</h5>
        
//       </div>
//              <div id="loginModalBody" class="modal-body">
//                 <div class="form-group">
//                     <label for="InputCode">Código :</label>
//                     <input type="text" class="form-control" id="inpCode" aria-describedby="emailHelp" onChange={e => {setSearchCodigo(e.target.value); setSearchMessage("")}} value={searchcodigo}  placeholder=""/>
//                 </div>
//                 <div class="form-group">
//                     <label for="InputNombre">Nombre y Apellido:</label>
//                     <input type="text" class="form-control" id="inpNombre" onChange={e => {setSearchNombre(e.target.value); setSearchMessage("")}} value={searchnombre} placeholder=""/>
//                 </div>
//                 <div class="form-group">
//                   <label for="InputActivo">Incluir inactivos</label>&nbsp;
//                   <input type="checkbox" class="form-check-input" id="inpActivo" onChange={handleOnChangeActivo} checked={searchactivo} placeholder=""/>
//                 </div>
//                 <div class="form-group text-danger">
//                     <label id="log_message">{searchMessage}</label>
//                 </div>
//                </div>
          
//               <div class="modal-footer">
//                 <button type="button" class="btn btn-primary"   onClick={handleSearchClose} data-bs-dismiss="modal">Cancelar</button>
//                 <button type="button" id="btnconfirm" data-bs-confirm="" onClick={handlesearchPac}  class="btn btn-primary">Buscar</button>
//               </div>


//             <div id="divtabpac" class="container text-center ml-2 mb-2">
//                     <div class="row align-items-start border-primary">
//                       <div class="col bg-info col-2 border-primary">
//                         Código
//                       </div>
//                       <div class="col bg-info col-5 border-primary">
//                         Nombre
//                       </div>
//                       <div class="col bg-info col-5 border-primary">
//                         Apellido
//                       </div>
//                     </div>

//                   {  searchgrilla.map (( unolista, index ) => (
//                     <>
//                     <div class="row align-items-start borde-primary" onClick={() => { handlepacSelected(index) }}>
//                       <div key={index+'_1p'} class="col col-2 border-primary"> {unolista.code} </div>
//                       <div key={index+'_2p'} class="col col-5 border-primary"> {unolista.nombre}</div>
//                       <div key={index+'_3p'} class="col col-5 border-primary"> {unolista.apellido}</div>


//                     </div>
            
//                    </>


//                   ))} 
//               </div>


//     </div>
//   </div>
//   </div>


// { /* <!-- Ventana de búsqueda de doctores //  add show d-block to the class for the modal login to show up-->  */ }

// <div class={vermodalDoc ? 'modal fade show d-block' : 'modal fade'} id="docSearchModal" data-show="true" tabIndex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="false">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h5 class="modal-title" id="confirmModalLabel">Buscar doctor</h5>
        
//       </div>
//              <div id="loginModalBody" class="modal-body">
//                 <div class="form-group">
//                     <label for="InputCode">Código :</label>
//                     <input type="text" class="form-control" id="inpCode" aria-describedby="emailHelp" onChange={e => {setSearchDocCodigo(e.target.value); setSearchDocMessage("")}} value={searchDoccodigo}  placeholder=""/>
//                 </div>
//                 <div class="form-group">
//                     <label for="InputNombre">Nombre y Apellido:</label>
//                     <input type="text" class="form-control" id="inpNombre" onChange={e => {setSearchDocNombre(e.target.value); setSearchDocMessage("")}} value={searchDocnombre} placeholder=""/>
//                 </div>
//                 <div class="form-group">
//                   <label for="InputActivo">Incluir inactivos</label>&nbsp;
//                   <input type="checkbox" class="form-check-input" id="inpActivo" onChange={handleOnChangeDocActivo} checked={searchDocactivo} placeholder=""/>
//                 </div>
//                 <div class="form-group text-danger">
//                     <label id="log_message">{searchDocMessage}</label>
//                 </div>
//                </div>
          
//               <div class="modal-footer">
//                 <button type="button" class="btn btn-primary"   onClick={handleSearchDocClose} data-bs-dismiss="modal">Cancelar</button>
//                 <button type="button" id="btnconfirm" data-bs-confirm="" onClick={handlesearchDoc}  class="btn btn-primary">Buscar</button>
//               </div>


//             <div id="divtabdoc" class="container text-center ml-2 mb-2">
//                     <div class="row align-items-start border-primary">
//                       <div class="col bg-info col-2 border-primary">
//                         Código
//                       </div>
//                       <div class="col bg-info col-5 border-primary">
//                         Nombre
//                       </div>
//                       <div class="col bg-info col-5 border-primary">
//                         Apellido
//                       </div>
//                     </div>

//                   {  searchDocgrilla.map (( unolista, index ) => (
//                     <>
//                     <div class="row align-items-start borde-primary" onClick={() => { handleDocSelected(index) }}>
//                       <div key={index+'_1d'} class="col col-2 border-primary"> {unolista.code} </div>
//                       <div key={index+'_2d'} class="col col-5 border-primary"> {unolista.nombre}</div>
//                       <div key={index+'_3d'} class="col col-5 border-primary"> {unolista.apellido}</div>


//                     </div>
            
//                    </>


//                   ))} 
//               </div>


//     </div>
//   </div>
//   </div>



// <ToastContainer position="bottom-end">
//         <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          
//           <Toast.Body>{textoToast}</Toast.Body>
//         </Toast>
//         </ToastContainer>




    

//                </div>
//            );
//  }

// export default Intervbuscar;