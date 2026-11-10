// Intervnueva.js
import React, { useState, useEffect } from "react";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const API = "http://localhost:8080/robiotics";

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

// Cabecera de cada tarjeta (ícono + título + subtítulo)
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
   Pantalla de nueva intervención
   ============================================================ */
const Intervnueva = (props) => {

  // ----- Datos de la intervención -----
  const [codpaciente, setCodpaciente] = useState(0);
  const [nombpaciente, setNombpaciente] = useState("");
  const [coddoctor, setCoddoctor] = useState(0);
  const [nombDoctor, setNombDoctor] = useState("");
  const [fechInterv, setFechInterv] = useState("");

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

  // ----- Catálogos -----
  const [listOrganos, setListOrganos] = useState([]);
  const [orgValores, setOrgValores] = useState({});
  const [listMedica, setListMedica] = useState([]);

  // ----- Ruta y presupuesto -----
  const [intervGrilla, setIntervGrilla] = useState([]);
  const [presupErrMessage, setPresupErrMessage] = useState([]);
  const [presupCosto, setPresupCosto] = useState(0);
  const [presupTiempo, setPresupTiempo] = useState(0);

  // ----- Toast -----
  const [showToast, setShowToast] = useState(false);
  const [textoToast, setTextoToast] = useState("");

  function mostrarToast(texto) {
    setTextoToast(texto);
    setShowToast(true);
  }

  /* ================= Carga de catálogos ================= */

  // Órganos y valores (costo / tiempo de cada estudio)
  useEffect(() => {
    fetch(`${API}/org/traertodos`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.lista) && data.lista.length) {
          setListOrganos(data.lista);
          setOrgValores(data.valores || {});
        }
      })
      .catch((error) => console.error("Error cargando órganos", error));
  }, []);

  // Medicamentos
  useEffect(() => {
    fetch(`${API}/medica/traertodos`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length) {
          setListMedica(data);
        }
      })
      .catch((error) => console.error("Error cargando medicación", error));
  }, []);

  /* ================= Ruta de órganos ================= */

  // Arma una fila nueva de la ruta para el órgano indicado
  function filaParaOrgano(organo, medica = 0) {
    return {
      organo: Number(organo.code),
      mtejido: false,
      mtejidovis: organo.mtejido,
      msangre: false,
      msangrevis: organo.msangre,
      tomo3d: false,
      tomo3dvis: organo.tomo3d,
      medica,
    };
  }

  function handleaddRuta() {
    if (!listOrganos.length) {
      mostrarToast("No hay órganos cargados");
      return;
    }
    setIntervGrilla((grilla) => [...grilla, filaParaOrgano(listOrganos[0])]);
  }

  function handleOrganoChange(e, fila) {
    const organo = listOrganos.find((o) => String(o.code) === e.target.value);
    if (!organo) return;
    setIntervGrilla(intervGrilla.map((c, i) =>
      i === fila ? filaParaOrgano(organo, c.medica) : c
    ));
  }

  // campo: "mtejido" | "msangre" | "tomo3d"
  function handleOnChangeChecked(fila, campo) {
    setIntervGrilla(intervGrilla.map((c, i) =>
      i === fila ? { ...c, [campo]: !c[campo] } : c
    ));
  }

  function handleMedicaChange(e, fila) {
    const medica = Number(e.target.value);
    setIntervGrilla(intervGrilla.map((c, i) =>
      i === fila ? { ...c, medica } : c
    ));
  }

  function handleEliminar(fila) {
    setIntervGrilla(intervGrilla.filter((_, i) => i !== fila));
  }

  /* ================= Presupuesto ================= */

  // Calcula costo, tiempo y errores. Devuelve el resultado para poder usarlo
  // enseguida (el estado de React no se actualiza en el momento).
  function calcularPresupuesto() {
    const errores = [];
    let costo = 0;
    let tiempo = 0;
    let cantMedic = 0;
    let orgRepetido = false;
    let sininterv = false;
    const repOrg = [];

    if (nombpaciente === "") errores.push("Ingresar Paciente");
    if (nombDoctor === "") errores.push("Ingresar Médico");

    if (fechInterv === "") {
      errores.push("Ingresar fecha de Intervención");
    } else if (!(new Date(fechInterv) > new Date())) {
      errores.push("La fecha de Intervención debe ser futura");
    }

    if (intervGrilla.length < 1) errores.push("Al menos cargar un órgano en la ruta");

    intervGrilla.forEach((c) => {
      let almenos1 = false;

      if (repOrg.includes(c.organo)) orgRepetido = true;
      repOrg.push(c.organo);

      if (c.mtejido) {
        costo += orgValores.tejido_costo || 0;
        tiempo += orgValores.tejido_tiempo || 0;
        almenos1 = true;
      }
      if (c.msangre) {
        costo += orgValores.sangre_costo || 0;
        tiempo += orgValores.sangre_tiempo || 0;
        almenos1 = true;
      }
      if (c.tomo3d) {
        costo += orgValores.tomo3d_costo || 0;
        tiempo += orgValores.tomo3d_tiempo || 0;
        almenos1 = true;
      }

      if (Number(c.medica) !== 0) cantMedic++;
      if (!almenos1) sininterv = true;
    });

    if (sininterv) errores.push("Órgano sin ninguna intervención");
    if (orgRepetido) errores.push("Órganos repetidos en la ruta");
    if (cantMedic > 2) errores.push("Más de 2 medicaciones seleccionadas");

    setPresupCosto(costo);
    setPresupTiempo(tiempo);
    setPresupErrMessage(errores);

    return { errores, costo, tiempo };
  }

  function handlePresup() {
    calcularPresupuesto();
  }

  async function handleConfirm() {
    const { errores, costo, tiempo } = calcularPresupuesto();
    if (errores.length > 0) return;

    const body = {
      paciente: codpaciente,
      doctor: coddoctor,
      fecint: fechInterv,
      costo,
      tiempo,
      ruta: intervGrilla.map((c) => ({
        organo: Number(c.organo),
        mtejido: c.mtejido,
        msangre: c.msangre,
        tomo3d: c.tomo3d,
        medica: Number(c.medica),
      })),
    };

    try {
      const response = await fetch(`${API}/interv/addnew`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        mode: "cors",
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await response.json();
      console.log("ruta add new", data);
      mostrarToast("Datos de intervención guardados");
    } catch (error) {
      console.error(error);
      mostrarToast("Error grabando datos de intervención");
    }
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

  function handleOnChangeDocActivo() {
    setSearchDocActivo(!searchDocactivo);
    setSearchDocMessage("");
  }

  async function handlesearchDoc() {
    const params = new URLSearchParams();
    let url;

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

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">

      {/* Header superior */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.5px" }}>
            Nueva Intervención
          </h3>
          <p className="text-muted small mb-0">
            Registro y presupuesto de intervenciones del sistema Robiotics.
          </p>
        </div>

      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">

          {/* ================= Tarjeta 1: Datos ================= */}
          <div className="card border-0 shadow-sm rounded-3 bg-white mb-4">
            <CabeceraTarjeta icono="bi-clipboard2-pulse" titulo="Datos de la Intervención"
              subtitulo="Seleccione el paciente, el médico y la fecha" />

            <div className="card-body p-4">
              <div className="row g-3">

                <div className="col-12 col-md-6">
                  <label htmlFor="intPaciente" className={labelClass} style={labelStyle}>Paciente</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><i className="bi bi-person"></i></span>
                    <input type="text" id="intPaciente" className="form-control bg-light"
                      value={nombpaciente} readOnly placeholder="Sin seleccionar" />
                    <button type="button" className="btn btn-outline-primary" onClick={handleSearchShow}>
                      <i className="bi bi-search me-1"></i>Buscar
                    </button>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="intMedico" className={labelClass} style={labelStyle}>Médico</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light text-muted"><i className="bi bi-person-badge"></i></span>
                    <input type="text" id="intMedico" className="form-control bg-light"
                      value={nombDoctor} readOnly placeholder="Sin seleccionar" />
                    <button type="button" className="btn btn-outline-primary" onClick={handleSearchDocShow}>
                      <i className="bi bi-search me-1"></i>Buscar
                    </button>
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="intervDate" className={labelClass} style={labelStyle}>Fecha de intervención</label>
                  <input id="intervDate" type="date" className="form-control py-2"
                    value={fechInterv} onChange={(e) => setFechInterv(e.target.value)} />
                </div>

              </div>
            </div>
          </div>

          {/* ================= Tarjeta 2: Ruta ================= */}
          <div className="card border-0 shadow-sm rounded-3 bg-white mb-4">
            <CabeceraTarjeta icono="bi-diagram-3" titulo="Ruta de Órganos"
              subtitulo="Agregue los órganos y marque los estudios a realizar">
              <button type="button" className="btn btn-primary fw-semibold"
                style={{ backgroundColor: "#0284c7", borderColor: "#0284c7" }}
                onClick={handleaddRuta}>
                <i className="bi bi-plus-lg me-1"></i>Agregar órgano
              </button>
            </CabeceraTarjeta>

            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead className="table-info">
                    <tr>
                      <th style={{ minWidth: "150px" }}>Órgano</th>
                      <th className="text-center">Tejido</th>
                      <th className="text-center">Sangre</th>
                      <th className="text-center">Tomografía</th>
                      <th style={{ minWidth: "150px" }}>Medicación</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {intervGrilla.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-3">
                          Todavía no hay órganos en la ruta. Use “Agregar órgano”.
                        </td>
                      </tr>
                    ) : (
                      intervGrilla.map((fila, index) => (
                        <tr key={index}>
                          <td>
                            <select className="form-select form-select-sm" aria-label="Órgano"
                              value={fila.organo} onChange={(e) => handleOrganoChange(e, index)}>
                              {listOrganos.map((o) => (
                                <option key={o.code} value={o.code}>{o.nombre}</option>
                              ))}
                            </select>
                          </td>
                          <td className="text-center">
                            {fila.mtejidovis
                              ? <input type="checkbox" className="form-check-input" aria-label="Tejido"
                                  checked={fila.mtejido} onChange={() => handleOnChangeChecked(index, "mtejido")} />
                              : <span className="text-muted">—</span>}
                          </td>
                          <td className="text-center">
                            {fila.msangrevis
                              ? <input type="checkbox" className="form-check-input" aria-label="Sangre"
                                  checked={fila.msangre} onChange={() => handleOnChangeChecked(index, "msangre")} />
                              : <span className="text-muted">—</span>}
                          </td>
                          <td className="text-center">
                            {fila.tomo3dvis
                              ? <input type="checkbox" className="form-check-input" aria-label="Tomografía"
                                  checked={fila.tomo3d} onChange={() => handleOnChangeChecked(index, "tomo3d")} />
                              : <span className="text-muted">—</span>}
                          </td>
                          <td>
                            <select className="form-select form-select-sm" aria-label="Medicación"
                              value={fila.medica} onChange={(e) => handleMedicaChange(e, index)}>
                              <option value={0}>Sin medicación</option>
                              {listMedica.map((m) => (
                                <option key={m.code} value={m.code}>{m.nombre}</option>
                              ))}
                            </select>
                          </td>
                          <td className="text-end">
                            <button type="button" className="btn btn-outline-danger btn-sm"
                              aria-label="Quitar órgano" title="Quitar órgano"
                              onClick={() => handleEliminar(index)}>
                              <i className="bi bi-trash"></i>
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

          {/* ================= Tarjeta 3: Presupuesto ================= */}
          <div className="card border-0 shadow-sm rounded-3 bg-white mb-4">
            <CabeceraTarjeta icono="bi-calculator" titulo="Presupuesto"
              subtitulo="Calcule el costo y el tiempo antes de confirmar" />

            <div className="card-body p-4">
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border h-100">
                    <div className={labelClass} style={labelStyle}>Costo</div>
                    <div className="fs-3 fw-bold text-dark">$ {presupCosto.toLocaleString("es-AR")}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-light rounded-3 border h-100">
                    <div className={labelClass} style={labelStyle}>Tiempo</div>
                    <div className="fs-3 fw-bold text-dark">
                      {presupTiempo.toLocaleString("es-AR")} <span className="fs-6 fw-semibold text-muted">min</span>
                    </div>
                    {presupTiempo >= 60 && (
                      <small className="text-muted">
                        ({Math.floor(presupTiempo / 60)} h{presupTiempo % 60 > 0 ? ` ${presupTiempo % 60} min` : ""})
                      </small>
                    )}
                  </div>
                </div>
              </div>

              {presupErrMessage.length > 0 && (
                <div className="alert alert-danger mb-0" role="alert">
                  <div className="fw-semibold mb-1">
                    <i className="bi bi-exclamation-triangle me-1"></i>Revise lo siguiente:
                  </div>
                  <ul className="mb-0 ps-3">
                    {presupErrMessage.map((msg) => <li key={msg}>{msg}</li>)}
                  </ul>
                </div>
              )}
            </div>

            <div className="card-footer border-top bg-light p-3 p-md-4">
              <div className="row g-2 justify-content-end">
                <div className="col-6 col-md-auto">
                  <button type="button" className="btn btn-outline-primary w-100 px-4 fw-semibold" onClick={handlePresup}>
                    <i className="bi bi-calculator me-2"></i>Presupuestar
                  </button>
                </div>
                <div className="col-6 col-md-auto">
                  <button type="button" className="btn btn-success w-100 px-4 fw-semibold" onClick={handleConfirm}>
                    <i className="bi bi-check-circle me-2"></i>Confirmar
                  </button>
                </div>
              </div>
            </div>
          </div>

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

      {/* ================= Toast ================= */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1100 }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
          <Toast.Body>{textoToast}</Toast.Body>
        </Toast>
      </ToastContainer>

    </div>
  );
};

export default Intervnueva;
