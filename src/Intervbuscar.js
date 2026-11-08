// Intervbuscar.js
import React, { useState, useEffect } from "react";

const API = "http://localhost:8080/robiotics";

//   utilidades de formato
   
// "2026-11-20T00:00:00.000Z" a "20/11/2026"
function formatFecha(valor) {
  if (!valor) return "";
  const [anio, mes, dia] = String(valor).substring(0, 10).split("-");
  return dia && mes && anio ? `${dia}/${mes}/${anio}` : String(valor);
}

function formatCosto(valor) {
  return `$ ${Number(valor || 0).toLocaleString("es-AR")}`;
}

// 135 a "135 min (2 h 15 min)"
function formatTiempo(valor) {
  const min = Number(valor || 0);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const resto = min % 60;
  return `${min} min (${h} h${resto ? ` ${resto} min` : ""})`;
}

// cabecera de tarjeta (ícono + título + subtítulo)
   
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

// modal de búsqueda reutilizable (pacientes y médicos)
   
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

// icono de si / no p el detalle 
function Check({ valor }) {
  return valor
    ? <i className="bi bi-check-circle-fill text-success" aria-label="Sí"></i>
    : <span className="text-muted" aria-label="No">—</span>;
}

// pantalla búsqueda de intervenciones
   
const Intervbuscar = (props) => {

  // filtros
  const [codpaciente, setCodpaciente] = useState(0);
  const [nombpaciente, setNombpaciente] = useState("");
  const [coddoctor, setCoddoctor] = useState(0);
  const [nombDoctor, setNombDoctor] = useState("");
  const [fechIntervDes, setFechIntervDes] = useState("");
  const [fechIntervHas, setFechIntervHas] = useState("");

  // búsqueda paciente 
  const [vermodal, setVermodal] = useState(false);
  const [searchcodigo, setSearchCodigo] = useState("");
  const [searchnombre, setSearchNombre] = useState("");
  const [searchactivo, setSearchActivo] = useState(false);
  const [searchgrilla, setSearchGrilla] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");

  // búsqueda médico
  const [vermodalDoc, setVermodalDoc] = useState(false);
  const [searchDoccodigo, setSearchDocCodigo] = useState("");
  const [searchDocnombre, setSearchDocNombre] = useState("");
  const [searchDocactivo, setSearchDocActivo] = useState(false);
  const [searchDocgrilla, setSearchDocGrilla] = useState([]);
  const [searchDocMessage, setSearchDocMessage] = useState("");

  // catálogos (p mostrar nombres en el detalle)
  const [listOrganos, setListOrganos] = useState([]);
  const [listMedica, setListMedica] = useState([]);

  // resultados 
  const [intervGrilla, setIntervGrilla] = useState([]);
  const [filaSeleccionada, setFilaSeleccionada] = useState(null);
  const [intervDetailGrilla, setIntervDetailGrilla] = useState([]);
  const [searchInterv, setsearchInterv] = useState("");
  const [buscando, setBuscando] = useState(false);

  // carga d catálogos

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

  // búsqueda d intervenciones 

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

  // búsqueda d paciente 

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
    const msgactivo = searchactivo ? '"activo" : false' : '"activo" : true';
    let url;

    if (searchcodigo) {
      url = `${API}/pac/findcode`;
      params.append("code", searchcodigo);
      params.append("token", props.vtoken);
      params.append("msg", msgactivo);
    } else if (searchnombre) {
      url = `${API}/pac/findname`;
      params.append("nombre", searchnombre);
      params.append("msg", msgactivo);
    } else {
      url = `${API}/pac/findall`;
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

  // búsqueda de médico 

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
    const msgactivo = searchDocactivo ? '"activo" : false' : '"activo" : true';
    let url;

    
    if (searchDoccodigo) {
      url = `${API}/doctor/findcode`;
      params.append("code", searchDoccodigo);
      params.append("token", props.vtoken);
      params.append("msg", msgactivo);
    } else if (searchDocnombre) {
      url = `${API}/doctor/findname`;
      params.append("nombre", searchDocnombre);
      params.append("msg", msgactivo);
    } else {
      url = `${API}/doctor/findall`;
      params.append("msg", msgactivo);
    }

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

  //  pantalla

  const labelClass = "form-label text-uppercase text-secondary fw-bold small";
  const labelStyle = { fontSize: "0.75rem" };
  const intervSel = filaSeleccionada !== null ? intervGrilla[filaSeleccionada] : null;

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">

     // header superior 
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.5px" }}>
            Buscar Intervenciones
          </h3>
          <p className="text-muted small mb-0">
            Consulta de intervenciones registradas en el sistema Robiotics.
          </p>
        </div>
        <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold">
          <i className="bi bi-shield-check me-1"></i> Módulo Activo
        </span>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">

          // tarjeta 1: filtros 
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

         // tarjeta2: resultados 
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

           // tarjeta3: detalle 
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

      //  modales
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
Mostrando Intervbuscar.js
