// Organos.js
import React, { useState, useEffect } from "react";

const API = "http://localhost:8080/robiotics/org";

const Organos = (props) => {

  // ficha órgano
  const [codigo, setCodigo] = useState("");
  const [nombre, setNombre] = useState("");
  const [mtejido, setMtejido] = useState(false);   // permite muestra de tejido
  const [msangre, setMsangre] = useState(false);   // permite muestra de sangre
  const [tomo3d, setTomo3d] = useState(false);     // permite tomografía 3D
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

  // toast
  const [showToast, setShowToast] = useState(false);
  const [textoToast, setTextoToast] = useState("");

  // toast se oculta a los 3 segundos
  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  function mostrarToast(texto) {
    setTextoToast(texto);
    setShowToast(true);
  }

  // carga en el formulario un órgano que vino desde back
  function cargarOrgano(o) {
    if (!o) return;
    setCodigo(o.code ?? "");
    setNombre(o.nombre ?? "");
    setMtejido(!!o.mtejido);
    setMsangre(!!o.msangre);
    setTomo3d(!!o.tomo3d);
    setActivo(!!o.activo);
  }

  function limpiarFicha() {
    setCodigo("");
    setNombre("");
    setMtejido(false);
    setMsangre(false);
    setTomo3d(false);
    setActivo(false);
    setErrores({});
  }

  // validación

  const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;

  // true si todo está bien; si no, marca error en los campos 
  function validarFicha() {
    const e = {};
    const n = nombre.trim();

    if (!n) e.nombre = "El nombre es obligatorio";
    else if (n.length < 2) e.nombre = "El nombre debe tener al menos 2 letras";
    else if (!SOLO_LETRAS.test(n)) e.nombre = "El nombre solo puede contener letras";

    if (!mtejido && !msangre && !tomo3d) {
      e.estudios = "Marque al menos un estudio permitido";
    }

    setErrores(e);
    return Object.keys(e).length === 0;
  }

  function cambiarNombre(e) {
    setNombre(e.target.value);
    if (errores.nombre) setErrores({ ...errores, nombre: undefined });
  }

  function cambiarEstudio(setter, valor) {
    setter(!valor);
    if (errores.estudios) setErrores({ ...errores, estudios: undefined });
  }

  // búsqueda

  function handleOnChangeActivo() {
    setSearchActivo(!searchactivo);
    setSearchMessage("");
  }

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

  function handleSearchClose() {
    setVermodal(false);
  }

  function handleOrgSelected(fila) {
    cargarOrgano(searchgrilla[fila]);
    setVermodal(false);
  }

  // back de órganos solo tiene /org/traertodos (findall, findname y findcode dan 404). traemos todos y filtramos.
  async function traerTodosLosOrganos() {
    const response = await fetch(`${API}/traertodos`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.lista) ? data.lista : [];
  }

  // compara sin mayúsculas ni tildes (higado encuentra Hígado)
  function normalizar(texto) {
    return String(texto ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }

  async function handlesearchOrg() {
    try {
      let lista = await traerTodosLosOrganos();

      if (searchcodigo.trim()) {
        lista = lista.filter((o) => String(o.code) === searchcodigo.trim());
      } else if (searchnombre.trim()) {
        const buscado = normalizar(searchnombre);
        lista = lista.filter((o) => normalizar(o.nombre).includes(buscado));
      }

      // órganos campo activo, se ocultan los inactivos excepto si se pide incluirlos
      if (!searchactivo) {
        lista = lista.filter((o) => o.activo !== false);
      }

      setSearchGrilla(lista);
      if (!lista.length) setSearchMessage("No hay coincidencias");
    } catch (error) {
      console.error(error);
      setSearchGrilla([]);
      setSearchMessage("Error al buscar órganos");
    }
  }

  // botones de la ficha
  function handleNew() {
    limpiarFicha();
    setActivo(true);
    setNotEditable(false);
  }

  function handleEdit() {
    setNotEditable(false);
  }

  function handleRemove() {
    setVermodalConf(true);
  }

  function handleConfirmClose() {
    setVermodalConf(false);
  }

  //confirmación de eliminación
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
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await response.json();
      limpiarFicha();
      setNotEditable(true);
      mostrarToast("Órgano eliminado");
    } catch (error) {
      console.error(error);
      mostrarToast("Error al eliminar el órgano");
    }
  }

  // guardar (alta o modificación) 
  async function handleSave() {
    if (!validarFicha()) {
      mostrarToast("Revise los campos marcados en rojo");
      return;
    }

    const body = {
      nombre: nombre.trim(),
      mtejido,
      msangre,
      tomo3d,
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
      const data = await response.json().catch(() => ({}));

      // error del back (por ej: nombre repetido): se muestra su mensaje
      if (!response.ok) {
        if (response.status === 409) {
          setErrores((prev) => ({ ...prev, nombre: data.message }));
        }
        mostrarToast(data.message || "Error al guardar el órgano");
        return;
      }

      if (Array.isArray(data.data) && data.data.length) {
        cargarOrgano(data.data[0]);
      }
      setNotEditable(true);
      mostrarToast("Órgano guardado");
    } catch (error) {
      console.error(error);
      mostrarToast("Error al guardar el órgano");
    }
  }

  //cancelar edición: vuelve a traer el registro desde el back
  async function handleCancel() {
    setNotEditable(true);
    setErrores({});

    if (!codigo) {
      limpiarFicha();
      return;
    }

    try {
      const lista = await traerTodosLosOrganos();
      cargarOrgano(lista.find((o) => String(o.code) === String(codigo)));
    } catch (error) {
      console.error(error);
    }
  }

  // pantalla

  const labelClass = "form-label text-uppercase text-secondary fw-bold small";
  const labelStyle = { fontSize: "0.75rem" };

  // interruptor de estudio permitido
  const estudio = (id, texto, valor, setter) => (
    <div className="col-12 col-md-4" key={id}>
      <div className={`form-check form-switch p-3 bg-light rounded-3 border d-flex align-items-center justify-content-between ${errores.estudios ? "border-danger" : ""}`}>
        <label className="form-check-label fw-semibold text-dark mb-0 ms-2" htmlFor={id}>{texto}</label>
        <input className="form-check-input ms-0 fs-5" type="checkbox" role="switch" id={id}
          checked={valor} disabled={noteditable}
          onChange={() => cambiarEstudio(setter, valor)} />
      </div>
    </div>
  );

  return (
    <div className="container-fluid py-4 px-4 bg-light min-vh-100">

      // header superior 
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <div>
          <h3 className="fw-bold text-dark mb-1" style={{ letterSpacing: "-0.5px" }}>
            Gestión de Órganos
          </h3>
          <p className="text-muted small mb-0">
            Administración de órganos y estudios permitidos del sistema Robiotics.
          </p>
        </div>
        <span className="badge bg-primary px-3 py-2 rounded-pill fw-semibold">
          <i className="bi bi-shield-check me-1"></i> Módulo Activo
        </span>
      </div>

     // tarjeta principal 
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card border-0 shadow-sm rounded-3 overflow-hidden bg-white">

            <div className="card-header border-0 bg-white pt-4 px-4 pb-0">
              <div className="d-flex align-items-center">
                <div className="rounded-3 p-2 me-3 text-white d-flex align-items-center justify-content-center"
                  style={{ backgroundColor: "#0284c7", width: "42px", height: "42px" }}>
                  <i className="bi bi-heart-pulse fs-5"></i>
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-dark">Ficha del Órgano</h5>
                  <small className="text-muted">Complete o busque la información del órgano</small>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="row g-3">

                  <div className="col-12 col-md-4">
                    <label htmlFor="code" className={labelClass} style={labelStyle}>Código</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted">#</span>
                      <input type="text" id="code" className="form-control bg-light"
                        value={codigo} disabled placeholder="Se asigna automáticamente" />
                    </div>
                  </div>

                  <div className="col-12 col-md-5">
                    <label htmlFor="nombre" className={labelClass} style={labelStyle}>Nombre</label>
                    <input type="text" id="nombre" maxLength={50}
                      className={`form-control py-2 ${errores.nombre ? "is-invalid" : ""}`}
                      value={nombre} onChange={cambiarNombre}
                      disabled={noteditable} placeholder="Ej.: Corazón" />
                    <div className="invalid-feedback">{errores.nombre}</div>
                  </div>

                  <div className="col-12 col-md-3 d-flex align-items-end">
                    <div className="form-check p-2 ps-4">
                      <input className="form-check-input" type="checkbox" id="activo"
                        checked={activo} disabled readOnly />
                      <label className="form-check-label fw-semibold" htmlFor="activo">Activo</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className={labelClass} style={labelStyle}>Estudios permitidos</div>
                  </div>
                  {estudio("estTejido", "Muestra de tejido", mtejido, setMtejido)}
                  {estudio("estSangre", "Muestra de sangre", msangre, setMsangre)}
                  {estudio("estTomo", "Tomografía 3D", tomo3d, setTomo3d)}
                  {errores.estudios && (
                    <div className="col-12 text-danger small mt-1">{errores.estudios}</div>
                  )}

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

      //modal de búsqueda
      {(vermodal || vermodalconf) && <div className="modal-backdrop fade show"></div>}

      <div className={vermodal ? "modal fade show d-block" : "modal fade"}
        id="orgSearchModal" tabIndex="-1" role="dialog"
        aria-labelledby="orgSearchModalLabel" aria-hidden={!vermodal}>
        <div className="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down" role="document">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title" id="orgSearchModalLabel">Buscar órgano</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={handleSearchClose}></button>
            </div>

            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handlesearchOrg(); }}>
                <div className="mb-3">
                  <label htmlFor="inpOrgCode" className="form-label">Código:</label>
                  <input type="text" className="form-control" id="inpOrgCode"
                    value={searchcodigo}
                    onChange={(e) => { setSearchCodigo(e.target.value); setSearchMessage(""); }} />
                </div>
                <div className="mb-3">
                  <label htmlFor="inpOrgNombre" className="form-label">Nombre:</label>
                  <input type="text" className="form-control" id="inpOrgNombre"
                    value={searchnombre}
                    onChange={(e) => { setSearchNombre(e.target.value); setSearchMessage(""); }} />
                </div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="inpOrgActivo"
                    checked={searchactivo} onChange={handleOnChangeActivo} />
                  <label className="form-check-label" htmlFor="inpOrgActivo">Incluir inactivos</label>
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
                      <th className="text-center">Tejido</th>
                      <th className="text-center">Sangre</th>
                      <th className="text-center">Tomo 3D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchgrilla.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted">Sin resultados</td>
                      </tr>
                    ) : (
                      searchgrilla.map((o, index) => (
                        <tr key={o.code ?? index} style={{ cursor: "pointer" }}
                          onClick={() => handleOrgSelected(index)}>
                          <td>{o.code}</td>
                          <td>{o.nombre}</td>
                          <td className="text-center">{o.mtejido ? "✓" : "—"}</td>
                          <td className="text-center">{o.msangre ? "✓" : "—"}</td>
                          <td className="text-center">{o.tomo3d ? "✓" : "—"}</td>
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
        id="orgConfModal" tabIndex="-1" role="dialog"
        aria-labelledby="orgConfModalLabel" aria-hidden={!vermodalconf}>
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="orgConfModalLabel">¿Eliminar órgano?</h5>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={handleConfirmClose}></button>
            </div>
            <div className="modal-body">
              <p className="mb-0">
                Se eliminará <strong>{nombre}</strong>. Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-footer">
              <div className="row g-2 w-100 justify-content-end m-0">
                <div className="col-6 col-md-auto">
                  <button type="button" className="btn btn-secondary w-100" onClick={handleConfirmClose}>Cancelar</button>
                </div>
                <div className="col-6 col-md-auto">
                  <button type="button" className="btn btn-danger w-100" onClick={handleConfirmEliminar}>Confirmar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      //toast 
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

export default Organos;
