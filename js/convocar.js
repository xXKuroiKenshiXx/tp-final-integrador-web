window.addEventListener("load", function () {
    buscarInfo();
  });
  
  document.getElementById('convocar').addEventListener('click', convocarJugadores);

  // aun no esta finalizada... 
  // no actualiza una convocatoria, agrega no mas...
  function convocarJugadores(){

    const idConvocatoria = parseInt(localStorage.getItem('convocatoria'));

    // lista de checks de la tabla
    const checks = document.getElementsByClassName('checkbox');
    // para almacenar los convocados
    let convocados = [];

    // recorro la lista de checks de la tabla
    for(let i=0; i < checks.length; i++){
      if(checks[i].checked){
        const convocado = {
          'idJugador': parseInt(checks[i].getAttribute("id")),
          'idConvocarotia': idConvocatoria
        };
        
        convocados.push(convocado);
      }
    }

    // las convocatoriasJugadores del localstorage
    const datosLocalStorage = JSON.parse(localStorage.getItem('convocatorias'));
    
    if(datosLocalStorage === null){
      // como no hay convocatoriasJugadores seteo no mas
      localStorage.setItem('convocatorias',JSON.stringify(convocados));  
    }else{
      // si tenia convocatoriasJugadores agrego las de ahora
      convocados.forEach(element => {
        datosLocalStorage.push(element);
      });
      localStorage.setItem('convocatorias',JSON.stringify(datosLocalStorage));  
    }

    
    window.location.href = './convocatorias.html';
  }

  function buscarInfo(){
    const idConvocatoria = parseInt(localStorage.getItem('id'));
    const datosLocalStorage = JSON.parse(localStorage.getItem('convocatorias'));

    const convocatorias = JSON.parse(localStorage.getItem('convocatorias'));
    const convocatoria = convocatorias.find(item => item.id === idConvocatoria);

    document.getElementById('titulo').
      appendChild(document.createTextNode(`Convocatoria vs ${convocatoria.rival} (${convocatoria.fecha})`))


    const body = document.getElementById('body');
    fetch('/jugadores.json')
    .then((res) => {
        return res.json()
    })
    .then((data) => {
      data.forEach(element => {
        const tr = document.createElement('tr');

        const id = document.createElement('td');
        const dni = document.createElement('td');
        const apellido = document.createElement('td');
        const nombre = document.createElement('td');
        const pieHabil = document.createElement('td');
        const convocar = document.createElement('td');

        id.appendChild(document.createTextNode(element.id));

        // otros datos
        dni.appendChild(document.createTextNode(element.dni));
        apellido.appendChild(document.createTextNode(element.apellido));
        nombre.appendChild(document.createTextNode(element.nombre));
        pieHabil.appendChild(document.createTextNode(element.pieHabil));


        // checkbox
        const check = document.createElement('input');
        check.type = 'checkbox';
        check.id = element.id;
        
        // si hay datos de jugadores para la convocatoria
        if(datosLocalStorage !== null){                
          // verifico si el jugador ya esta en la covocatoria 
          const yaEstaConvocado = datosLocalStorage.find
            (item => item.idJugador === element.id 
              && item.idConvocarotia === idConvocatoria);
          
          // si esta hago check 
          if(yaEstaConvocado){
            check.checked = true;
          }
        }

        check.classList.add('checkbox');
        // agrego el check al td
        convocar.appendChild(check);

        tr.appendChild(id);
        tr.appendChild(dni);
        tr.appendChild(apellido);
        tr.appendChild(nombre);
        tr.appendChild(pieHabil);
        tr.appendChild(convocar);
        body.appendChild(tr);

      });
    }).catch((error) => {
        console.log('error', error)
    });
  }