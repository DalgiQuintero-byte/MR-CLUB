
// Obtener el formulario
const formulario = document.getElementById('FormularioRegistro');

// Obtener la tabla y el mensaje
const tabla = document.getElementById('tablaAsociados');
const mensaje = document.getElementById('mensaje');

// Obtener los asociados guardados
let asociados = JSON.parse(localStorage.getItem('asociados')) || [];


// GUARDAR ASOCIADO
formulario.addEventListener('submit', function(e) {

    e.preventDefault();

    // Obtener los datos del formulario
    const documento = document.getElementById('Documento').value.trim();

    // Verificar si el documento ya existe
    const existe = asociados.some(a => a.documento === documento);

    if (existe) {
        mensaje.textContent = 'Este documento ya está registrado.';
        mensaje.style.color = 'red';
        return;
    }

    // Crear objeto del asociado
    const nuevoAsociado = {

        documento: documento,
        nombres: document.getElementById('Nombres').value.trim(),
        apellidos: document.getElementById('Apellidos').value.trim(),
        fechaNacimiento: document.getElementById('FechaNacimiento').value,
        direccion: document.getElementById('Direccion').value.trim(),
        ciudad: document.getElementById('Ciudad').value,
        telefono: document.getElementById('Telefono').value.trim(),
        email: document.getElementById('Email').value.trim(),
        genero: document.querySelector('input[name="Genero"]:checked').value

    };

    // Agregar el asociado
    asociados.push(nuevoAsociado);

    // Guardar en localStorage
    localStorage.setItem('asociados', JSON.stringify(asociados));

    mensaje.textContent = '¡Asociado registrado correctamente!';
    mensaje.style.color = 'green';

    // Limpiar formulario
    formulario.reset();

    // Actualizar tabla
    mostrarAsociados();

});


// MOSTRAR ASOCIADOS
function mostrarAsociados() {

    tabla.innerHTML = '';

    asociados.forEach((asociado, indice) => {

        const fila = document.createElement('tr');

        const datos = [
            asociado.documento,
            asociado.nombres,
            asociado.apellidos,
            asociado.telefono,
            asociado.ciudad
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
            eliminarAsociado(indice);
        });

        celdaAccion.appendChild(botonEliminar);
        fila.appendChild(celdaAccion);

        tabla.appendChild(fila);

    });

}


// ELIMINAR ASOCIADO
function eliminarAsociado(indice) {

    const confirmar = confirm('¿Desea eliminar este asociado?');

    if (confirmar) {

        asociados.splice(indice, 1);

        localStorage.setItem('asociados', JSON.stringify(asociados));

        mostrarAsociados();

        mensaje.textContent = 'Asociado eliminado correctamente.';
        mensaje.style.color = 'green';

    }

}


// MOSTRAR LOS DATOS AL ABRIR LA PÁGINA
mostrarAsociados();
