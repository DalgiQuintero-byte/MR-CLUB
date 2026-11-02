
// Obtener elementos
const formularioActividad = document.getElementById('FormularioActividades');
const tablaActividades = document.getElementById('tablaActividades');
const mensajeActividad = document.getElementById('mensajeActividad');

// Recuperar actividades guardadas
let actividades = JSON.parse(localStorage.getItem('actividades')) || [];


// GUARDAR ACTIVIDAD
formularioActividad.addEventListener('submit', function(e) {

    e.preventDefault();

    const codigo = document.getElementById('IdActividad').value.trim();

    // Verificar código repetido
    const existe = actividades.some(a => a.codigo === codigo);

    if (existe) {
        mostrarMensaje('Este código de actividad ya existe.', 'red');
        return;
    }

    // Crear actividad
    const nuevaActividad = {

        codigo: codigo,
        nombre: document.getElementById('NombreActividad').value.trim(),
        descripcion: document.getElementById('Descripcion').value.trim(),
        fecha: document.getElementById('FechaActividad').value,
        lugar: document.getElementById('Lugar').value.trim(),
        valor: Number(document.getElementById('ValorRecaudado').value),
        estado: document.getElementById('Estado').value

    };

    if (nuevaActividad.valor < 0) {
        mostrarMensaje('El valor no puede ser negativo.', 'red');
        return;
    }

    actividades.push(nuevaActividad);

    // Guardar información
    localStorage.setItem('actividades', JSON.stringify(actividades));

    mostrarActividades();

    formularioActividad.reset();

    mostrarMensaje('¡Actividad registrada correctamente!', 'green');

});


// MOSTRAR ACTIVIDADES
function mostrarActividades() {

    tablaActividades.innerHTML = '';

    actividades.forEach((actividad, indice) => {

        const fila = document.createElement('tr');

        const datos = [
            actividad.codigo,
            actividad.nombre,
            actividad.fecha,
            actividad.lugar,
            '$' + actividad.valor.toLocaleString('es-CO'),
            actividad.estado
        ];

        datos.forEach(dato => {

            const celda = document.createElement('td');
            celda.textContent = dato;
            fila.appendChild(celda);

        });

        const celdaAccion = document.createElement('td');
        const botonEliminar = document.createElement('button');

        botonEliminar.type = 'button';
        botonEliminar.textContent = 'Eliminar';

        botonEliminar.addEventListener('click', function() {
            eliminarActividad(indice);
        });

        celdaAccion.appendChild(botonEliminar);
        fila.appendChild(celdaAccion);

        tablaActividades.appendChild(fila);

    });

}


// ELIMINAR ACTIVIDAD
function eliminarActividad(indice) {

    if (confirm('¿Desea eliminar esta actividad?')) {

        actividades.splice(indice, 1);

        localStorage.setItem('actividades', JSON.stringify(actividades));

        mostrarActividades();

        mostrarMensaje('Actividad eliminada correctamente.', 'green');

    }

}


// MOSTRAR MENSAJES
function mostrarMensaje(texto, color) {

    mensajeActividad.textContent = texto;
    mensajeActividad.style.color = color;

}


// CARGAR ACTIVIDADES AL ABRIR
mostrarActividades();
