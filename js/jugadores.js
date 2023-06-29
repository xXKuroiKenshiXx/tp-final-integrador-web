document.addEventListener("DOMContentLoaded", function() {
  const jugadorForm = document.getElementById("jugador-form");
  const documentoInput = document.getElementById("documento");
  const nombreInput = document.getElementById("nombre");
  const apellidoInput = document.getElementById("apellido");
  const posicionSelect = document.getElementById("posicion");
  const dorsalInput = document.getElementById("dorsal");
  const pieHabilSelect = document.getElementById("pie_habil");
  const jugadoresBody = document.getElementById("jugadores-body");

  let jugadores = []; // Variable global para almacenar los jugadores

  // Cargar jugadores almacenados en localStorage al cargar la página
  cargarTodosLosJugadores();

  jugadorForm.addEventListener("submit", function(e) {
    e.preventDefault();
    // Obtener los valores ingresados en el formulario
    const documento = documentoInput.value.trim();
    const nombre1 = nombreInput.value.trim();
    const apellido1 = apellidoInput.value.trim();
    const posicion = posicionSelect.value;
    const dorsal = dorsalInput.value;
    const pieHabil = pieHabilSelect.value;

    // Capitalizar la primera letra de cada palabra en el nombre
    const nombre = capitalizarPrimeraLetra(nombre1);

    // Capitalizar la primera letra de cada palabra en el apellido
    const apellido = capitalizarPrimeraLetra(apellido1);

    // Validar que se hayan ingresado todos los campos
    if (documento === "" || nombre === "" || apellido === "" || posicion === "" || dorsal === "" || pieHabil === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }
    // Validar el número de documento (solo números)
    if (!/^\d+$/.test(documento)) {
      alert('El número de documento debe ser numérico');
      return;
    }

    // Validar el nombre (no debe contener números)
    if (/\d/.test(nombre)) {
      alert('El nombre no debe contener números');
      return;
    }

    // Validar el apellido (no debe contener números)
    if (/\d/.test(apellido)) {
      alert('El apellido no debe contener números');
      return;
    }

    // Validar el dorsal (no debe ser mayor a 99)
    if (parseInt(dorsal) > 99) {
      alert('El dorsal no puede ser mayor a 99');
      return;
    }

    // Verificar si ya existe un jugador con el mismo documento
    const documentoExistente = jugadores.find((jugadorExistente) => jugadorExistente.documento === documento);
    if (documentoExistente) {
      alert('Ya existe un jugador con ese documento. Por favor, elige otro documento.');
      return;
    }

    // Verificar si ya existe un jugador con el mismo dorsal
    const dorsalExistente = jugadores.find((jugadorExistente) => jugadorExistente.dorsal === dorsal);
    if (dorsalExistente) {
      alert('Ya existe un jugador con ese dorsal. Por favor, elige otro dorsal.');
      return;
    }

    // Crear un objeto jugador con los datos ingresados
    const jugador = {
      documento,
      nombre,
      apellido,
      posicion,
      dorsal,
      pieHabil
    };

    // Guardar el jugador en localStorage
    guardarJugador(jugador);

    // Limpiar el formulario
    jugadorForm.reset();

    // Actualizar la tabla de jugadores
    cargarTodosLosJugadores();
  });

  function capitalizarPrimeraLetra(string) {
    return string
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function guardarJugador(jugador) {
    // Obtener los jugadores existentes almacenados en localStorage
    const jugadores = obtenerJugadores();

    // Agregar el nuevo jugador al array de jugadores si no existe
    const documentoExistente = jugadores.find((jugadorExistente) => jugadorExistente.documento === jugador.documento);
    if (documentoExistente) {
      return;
    }
    // Agregar el nuevo jugador al array de jugadores si no existe
    const dorsalExistente = jugadores.find((jugadorExistente) => jugadorExistente.dorsal === jugador.dorsal);
    if (dorsalExistente) {
      return;
    }

    jugadores.push(jugador);

    // Guardar el array de jugadores actualizado en localStorage
    localStorage.setItem("jugadores", JSON.stringify(jugadores));
  }

  function obtenerJugadores() {
    const jugadoresString = localStorage.getItem("jugadores");
    return jugadoresString ? JSON.parse(jugadoresString) : [];
  }

  function agregarEventListeners() {
    const editarButtons = document.getElementsByClassName("editar-btn");
    const eliminarButtons = document.getElementsByClassName("eliminar-btn");

    for (let i = 0; i < editarButtons.length; i++) {
      editarButtons[i].addEventListener("click", function() {
        const documento = this.getAttribute("data-documento");
        editarJugador(documento);
      });
      eliminarButtons[i].addEventListener("click", function() {
        const documento = this.getAttribute("data-documento");
        eliminarJugador(documento);
      });
    }
  }

  function cargarTodosLosJugadores() {
    // Obtener los jugadores almacenados en localStorage
    const jugadoresString = localStorage.getItem("jugadores");
    jugadores = jugadoresString ? JSON.parse(jugadoresString) : [];
  
    // Limpiar el cuerpo de la tabla de jugadores
    while (jugadoresBody.firstChild) {
      jugadoresBody.firstChild.remove();
    }
  
    // Filtrar los jugadores en función de los criterios de búsqueda
    const nombre = document.getElementById('buscar-nombre-input').value.trim();
    const apellido = document.getElementById('buscar-apellido-input').value.trim();
    const posicion = document.getElementById('buscar-posicion-select').value;
    const dorsal = document.getElementById('buscar-dorsal-input').value.trim();
  
    const jugadoresFiltrados = jugadores.filter(function(jugador) {
      return (
        (nombre === '' || jugador.nombre.includes(nombre)) &&
        (apellido === '' || jugador.apellido.includes(apellido)) &&
        (posicion === '' || jugador.posicion === posicion) &&
        (dorsal === '' || jugador.dorsal === dorsal)
      );
    });
  
    // Recorrer los jugadores filtrados y crear filas en la tabla
    jugadoresFiltrados.forEach(function(jugador, index) {
      const fila = document.createElement("tr");
      const celdaNumero = document.createElement("td");
      const celdaDocumento = document.createElement("td");
      const celdaNombre = document.createElement("td");
      const celdaApellido = document.createElement("td");
      const celdaPosicion = document.createElement("td");
      const celdaDorsal = document.createElement("td");
      const celdaPieHabil = document.createElement("td");
      const celdaBotones = document.createElement("td");
      const editarButton = document.createElement("button");
      const eliminarButton = document.createElement("button");
  
      celdaNumero.textContent = index + 1;
      celdaDocumento.textContent = jugador.documento;
      celdaNombre.textContent = jugador.nombre;
      celdaApellido.textContent = jugador.apellido;
      celdaPosicion.textContent = jugador.posicion;
      celdaDorsal.textContent = jugador.dorsal;
      celdaPieHabil.textContent = jugador.pieHabil;
  
      editarButton.textContent = "Editar";
      editarButton.classList.add("editar-btn");
      editarButton.setAttribute("data-documento", jugador.documento);
  
      eliminarButton.textContent = "Eliminar";
      eliminarButton.classList.add("eliminar-btn");
      eliminarButton.setAttribute("data-documento", jugador.documento);
  
      celdaBotones.appendChild(editarButton);
      celdaBotones.appendChild(eliminarButton);
  
      fila.appendChild(celdaNumero);
      fila.appendChild(celdaDocumento);
      fila.appendChild(celdaNombre);
      fila.appendChild(celdaApellido);
      fila.appendChild(celdaPosicion);
      fila.appendChild(celdaDorsal);
      fila.appendChild(celdaPieHabil);
      fila.appendChild(celdaBotones);
  
      jugadoresBody.appendChild(fila);
  
      fila.classList.add("agregado");

      // Agregar event listeners a los botones de editar y eliminar
      agregarEventListeners();
    });
  }

    // Obtener referencia al botón "Limpiar Filtros"
  const limpiarFiltrosBtn = document.getElementById("limpiar-filtros-btn");
  
  // Agregar event listener al botón "Limpiar Filtros"
  limpiarFiltrosBtn.addEventListener("click", function() {
    // Limpiar los valores de los campos de búsqueda
    document.getElementById('buscar-nombre-input').value = '';
    document.getElementById('buscar-apellido-input').value = '';
    document.getElementById('buscar-posicion-select').value = '';
    document.getElementById('buscar-dorsal-input').value = '';
  
    // Volver a cargar todos los jugadores
    cargarTodosLosJugadores();
  });

  function editarJugador(documento) {
    // Obtener los jugadores almacenados en localStorage
    const jugadores = obtenerJugadores();

    // Buscar el jugador correspondiente al documento proporcionado
    const jugador = jugadores.find(function(jugador) {
      return jugador.documento === documento;
    });

    // Llenar el formulario con los datos del jugador
    documentoInput.value = jugador.documento;
    nombreInput.value = jugador.nombre;
    apellidoInput.value = jugador.apellido;
    posicionSelect.value = jugador.posicion;
    dorsalInput.value = jugador.dorsal;
    pieHabilSelect.value = jugador.pieHabil;

    // Eliminar el jugador del array de jugadores
    const index = jugadores.indexOf(jugador);
    jugadores.splice(index, 1);

    // Guardar el array de jugadores actualizado en localStorage
    localStorage.setItem("jugadores", JSON.stringify(jugadores));

    // Actualizar la tabla de jugadores
    cargarTodosLosJugadores();
  }

  function eliminarJugador(documento) {
    // Obtener los jugadores almacenados en localStorage
    const jugadores = obtenerJugadores();

    // Filtrar el array de jugadores para eliminar el jugador correspondiente al documento proporcionado
    const jugadoresFiltrados = jugadores.filter(function(jugador) {
      return jugador.documento !== documento;
    });

    // Guardar el array de jugadores filtrado en localStorage
    localStorage.setItem("jugadores", JSON.stringify(jugadoresFiltrados));
    // Actualizar la tabla de jugadores
    cargarTodosLosJugadores();
  }

  // Funcion para buscar jugadores
  document.getElementById('buscar-jugadores-btn').addEventListener('click', function() {
    buscarJugadores();
  });

  function buscarJugadores() {
    const nombre = document.getElementById('buscar-nombre-input').value.trim();
    const apellido = document.getElementById('buscar-apellido-input').value.trim();
    const posicion = document.getElementById('buscar-posicion-select').value;
    const dorsal = document.getElementById('buscar-dorsal-input').value.trim();

    // Filtrar los jugadores en función de los criterios de búsqueda
    const jugadoresFiltrados = jugadores.filter(function(jugador) {
      return (
        (nombre === '' || jugador.nombre.includes(nombre)) &&
        (apellido === '' || jugador.apellido.includes(apellido)) &&
        (posicion === '' || jugador.posicion === posicion) &&
        (dorsal === '' || jugador.dorsal === dorsal)
      );
    });

    // Mostrar los jugadores filtrados en la tabla
    cargarTodosLosJugadores(jugadoresFiltrados);

    // Agregar event listeners a los botones de editar y eliminar
    agregarEventListeners();
  }
});
