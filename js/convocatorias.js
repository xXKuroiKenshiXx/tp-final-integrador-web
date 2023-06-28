document.addEventListener("DOMContentLoaded", function() {
  const convocatoriaForm = document.querySelector("#caja-convocatoria form");
  const fechaInput = document.getElementById("fecha");
  const rivalInput = document.getElementById("rival");
  const horarioInput = document.getElementById("horario");
  const convocatoriasBody = document.getElementById("convocatorias-body");

  let convocatorias = [];

  cargarTodasLasConvocatorias();

  convocatoriaForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const fecha = fechaInput.value.trim();
    const rival = rivalInput.value.trim();
    const horario = horarioInput.value.trim();

    if (fecha === "" || rival === "" || horario === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const convocatoria = {
      fecha,
      rival,
      horario
    };

    guardarConvocatoria(convocatoria);

    convocatoriaForm.reset();

    cargarTodasLasConvocatorias();
  });

  function guardarConvocatoria(convocatoria) {
    const convocatorias = obtenerConvocatorias();

    convocatorias.push(convocatoria);

    localStorage.setItem("convocatorias", JSON.stringify(convocatorias));
  }

  function obtenerConvocatorias() {
    const convocatoriasString = localStorage.getItem("convocatorias");
    return convocatoriasString ? JSON.parse(convocatoriasString) : [];
  }

  function agregarEventListeners(fila, index) {
    const eliminarButton = fila.querySelector(".eliminar-btn");
    const editarButton = fila.querySelector(".editar-btn");

    eliminarButton.addEventListener("click", function() {
      eliminarConvocatoria(index);
    });

    editarButton.addEventListener("click", function() {
      editarConvocatoria(index);
    });
  }

  function cargarTodasLasConvocatorias() {
    const convocatoriasString = localStorage.getItem("convocatorias");
    convocatorias = convocatoriasString ? JSON.parse(convocatoriasString) : [];

    convocatoriasBody.innerHTML = "";

    convocatorias.forEach(function(convocatoria, index) {
      const fila = document.createElement("tr");
      const convocatoriaId = index + 1; // Generar el ID de la convocatoria

      const idCell = document.createElement("td");
      idCell.textContent = convocatoriaId;
      fila.appendChild(idCell);

      const fechaCell = document.createElement("td");
      fechaCell.textContent = convocatoria.fecha;
      fila.appendChild(fechaCell);

      const horarioCell = document.createElement("td");
      horarioCell.textContent = convocatoria.horario;
      fila.appendChild(horarioCell);

      const rivalCell = document.createElement("td");
      rivalCell.textContent = convocatoria.rival;
      fila.appendChild(rivalCell);

      const jugadoresCell = document.createElement("td");
      jugadoresCell.textContent = "-";
      fila.appendChild(jugadoresCell);

      const accionesCell = document.createElement("td");

      const eliminarButton = document.createElement("button");
      eliminarButton.className = "eliminar-btn";
      eliminarButton.setAttribute("data-index", index);
      eliminarButton.textContent = "Eliminar";
      accionesCell.appendChild(eliminarButton);

      const editarButton = document.createElement("button");
      editarButton.className = "editar-btn";
      editarButton.setAttribute("data-index", index);
      editarButton.textContent = "Editar";
      accionesCell.appendChild(editarButton);

      const convocarButton = document.createElement("button");
      convocarButton.className = "convocar-btn";
      convocarButton.setAttribute("data-index", index);
      convocarButton.setAttribute("data-convocatoria-id", convocatoriaId);
      convocarButton.textContent = "Convocar";
      accionesCell.appendChild(convocarButton);

      fila.appendChild(accionesCell);

      convocatoriasBody.appendChild(fila);

      fila.classList.add("agregado");

      convocarButton.addEventListener("click", function() {
        const convocatoriaId = this.getAttribute("data-convocatoria-id");
        redirigirAConvocar(convocatoriaId);
      });

      agregarEventListeners(fila, index);
    });
  }

  function redirigirAConvocar(convocatoriaId) {
    // Redirigir a la página "convocar.html" y pasar el ID de la convocatoria como parámetro
    window.location.href = "convocar.html?id=" + convocatoriaId;
  }

  function eliminarConvocatoria(index) {
    const convocatorias = obtenerConvocatorias();

    convocatorias.splice(index, 1);

    localStorage.setItem("convocatorias", JSON.stringify(convocatorias));

    cargarTodasLasConvocatorias();
  }

  function editarConvocatoria(index) {
    const convocatorias = obtenerConvocatorias();
    const convocatoria = convocatorias[index];

    fechaInput.value = convocatoria.fecha;
    rivalInput.value = convocatoria.rival;
    horarioInput.value = convocatoria.horario;

    eliminarConvocatoria(index);
  }

  // Agregar evento de filtrar al formulario
  const filtroConvocatoriasForm = document.getElementById("filtro-convocatorias");
  filtroConvocatoriasForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const fechaInicio = document.getElementById("fecha-inicio").value;
    const fechaFin = document.getElementById("fecha-fin").value;

    filtrarConvocatoriasPorFecha(fechaInicio, fechaFin);
  });

  function filtrarConvocatoriasPorFecha(fechaInicio, fechaFin) {
    const convocatoriasFiltradas = convocatorias.filter(function(convocatoria) {
      const fechaConvocatoria = new Date(convocatoria.fecha);
      const fechaInicioFiltro = new Date(fechaInicio);
      const fechaFinFiltro = new Date(fechaFin);
      return fechaConvocatoria >= fechaInicioFiltro && fechaConvocatoria <= fechaFinFiltro;
    });

    convocatoriasBody.innerHTML = "";

    convocatoriasFiltradas.forEach(function(convocatoria, index) {
      const fila = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = index + 1;
      fila.appendChild(idCell);

      const fechaCell = document.createElement("td");
      fechaCell.textContent = convocatoria.fecha;
      fila.appendChild(fechaCell);

      const horarioCell = document.createElement("td");
      horarioCell.textContent = convocatoria.horario;
      fila.appendChild(horarioCell);

      const rivalCell = document.createElement("td");
      rivalCell.textContent = convocatoria.rival;
      fila.appendChild(rivalCell);

      const jugadoresCell = document.createElement("td");
      jugadoresCell.textContent = "-";
      fila.appendChild(jugadoresCell);

      const accionesCell = document.createElement("td");

      const eliminarButton = document.createElement("button");
      eliminarButton.className = "eliminar-btn";
      eliminarButton.setAttribute("data-index", index);
      eliminarButton.textContent = "Eliminar";
      accionesCell.appendChild(eliminarButton);

      const editarButton = document.createElement("button");
      editarButton.className = "editar-btn";
      editarButton.setAttribute("data-index", index);
      editarButton.textContent = "Editar";
      accionesCell.appendChild(editarButton);

      const convocarButton = document.createElement("button");
      convocarButton.className = "convocar-btn";
      convocarButton.setAttribute("data-index", index);
      convocarButton.textContent = "Convocar";
      accionesCell.appendChild(convocarButton);

      fila.appendChild(accionesCell);

      convocatoriasBody.appendChild(fila);

      fila.classList.add("agregado");

      convocarButton.addEventListener("click", function() {
        redirigirAConvocar();
      });

      agregarEventListeners(fila, index);
    });
  }
});
