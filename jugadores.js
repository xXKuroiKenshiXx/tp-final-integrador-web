/* function validaryAgregar(){
    let tabla = document.getElementById("jugadores-table");

    let fila = tabla.insertRow(-1);

    let celdas1 = fila.insertCell(0);
    let celdas2 = fila.insertCell(0);
    let celdas3 = fila.insertCell(0);

    celdas1.innerHTML = 'celda1';
    celdas2.innerHTML = 'celda2';
    celdas3.innerHTML = 'celda3';
} */



document.addEventListener("DOMContentLoaded", function() {
    const jugadorForm = document.getElementById("jugador-form");
    const documentoInput = document.getElementById("documento");
    const nombreInput = document.getElementById("nombre");
    const apellidoInput = document.getElementById("apellido");
    const posicionSelect = document.getElementById("posicion");
    const dorsalInput = document.getElementById("dorsal");
    const pieHabilSelect = document.getElementById("pie_habil");
    const jugadoresBody = document.getElementById("jugadores-body");
  
    // Cargar jugadores almacenados en localStorage al cargar la página
    cargarJugadores();

    jugadorForm.addEventListener("submit", function(e) {
      e.preventDefault();
      // Obtener los valores ingresados en el formulario
      const documento = documentoInput.value.trim(); //.trim() es para eliminar los espacios en blanco al inicio y al final de una cadena de texto
      const nombre = nombreInput.value.trim();
      const apellido = apellidoInput.value.trim();
      const posicion = posicionSelect.value;
      const dorsal = dorsalInput.value;
      const pieHabil = pieHabilSelect.value;
      // Capitalizar la primera letra de cada palabra en el nombre
      const nombreCapitalizado = nombre
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Capitalizar la primera letra de cada palabra en el apellido
      const apellidoCapitalizado = apellido
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  
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
  
      // Crear un objeto jugador con los datos ingresados
      const jugador = {
        documento,
        nombreCapitalizado,
        apellidoCapitalizado,
        posicion,
        dorsal,
        pieHabil
      };
  
      // Guardar el jugador en localStorage
      guardarJugador(jugador);
  
      // Limpiar el formulario
      jugadorForm.reset();
  
      // Actualizar la tabla de jugadores
      cargarJugadores();
    });
  
    function guardarJugador(jugador) {
      // Obtener los jugadores existentes almacenados en localStorage
      const jugadores = obtenerJugadores();
  
      // Agregar el nuevo jugador al arreglo de jugadores
      jugadores.push(jugador);
  
      // Guardar el arreglo de jugadores actualizado en localStorage
      localStorage.setItem("jugadores", JSON.stringify(jugadores));
    }
  
    function obtenerJugadores() {
      const jugadoresString = localStorage.getItem("jugadores");
      return jugadoresString ? JSON.parse(jugadoresString) : [];
    }
  
    function cargarJugadores() {
      // Obtener los jugadores almacenados en localStorage
      const jugadores = obtenerJugadores();
  
      // Limpiar el cuerpo de la tabla de jugadores
      jugadoresBody.innerHTML = "";
  
      // Recorrer los jugadores y crear filas en la tabla
      jugadores.forEach(function(jugador) {
        const fila = document.createElement("tr");
        fila.innerHTML = `
          <td>${jugador.documento}</td>
          <td>${jugador.nombreCapitalizado}</td>
          <td>${jugador.apellidoCapitalizado}</td>
          <td>${jugador.posicion}</td>
          <td>${jugador.dorsal}</td>
          <td>${jugador.pieHabil}</td>
          <td>
            <button class="editar-btn" data-documento="${jugador.documento}">Editar</button>
            <button class="eliminar-btn" data-documento="${jugador.documento}">Eliminar</button>
          </td>
        `;
  
        jugadoresBody.appendChild(fila);

        fila.classList.add("agregado"); //<---- agrega como clase "agregado" para poder dar estilo a las filas agregadas


      });
      

      // Agregar event listeners a los botones de editar y eliminar
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
  
    function editarJugador(documento) {
      // Obtener los jugadores almacenados en localStorage
      const jugadores = obtenerJugadores();
  
      // Buscar el jugador correspondiente al documento proporcionado
      const jugador = jugadores.find(function(jugador) {
        return jugador.documento === documento;
      });
  
      // Llenar el formulario con los datos del jugador
      documentoInput.value = jugador.documento;
      nombreInput.value = jugador.nombreCapitalizado;
      apellidoInput.value = jugador.apellidoCapitalizado;
      posicionSelect.value = jugador.posicion;
      dorsalInput.value = jugador.dorsal;
      pieHabilSelect.value = jugador.pieHabil;
  
      // Eliminar el jugador del arreglo de jugadores
      const index = jugadores.indexOf(jugador);
      jugadores.splice(index, 1);
  
      // Guardar el arreglo de jugadores actualizado en localStorage
      localStorage.setItem("jugadores", JSON.stringify(jugadores));
  
      // Actualizar la tabla de jugadores
      cargarJugadores();
    }
  
    function eliminarJugador(documento) {
      // Obtener los jugadores almacenados en localStorage
      const jugadores = obtenerJugadores();
  
      // Filtrar el arreglo de jugadores para eliminar el jugador correspondiente al documento proporcionado
      const jugadoresFiltrados = jugadores.filter(function(jugador) {
        return jugador.documento !== documento;
      });
  
      // Guardar el arreglo de jugadores filtrado en localStorage
      localStorage.setItem("jugadores", JSON.stringify(jugadoresFiltrados));
      // Actualizar la tabla de jugadores
      cargarJugadores();
    }


    //funcion para buscar jugadores
    function buscarJugador(){

    }
  });









