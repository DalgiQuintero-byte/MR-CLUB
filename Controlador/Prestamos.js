
// Obtener elementos del formulario
const formularioPrestamo = document.getElementById('FormularioPrestamo');
const selectAsociado = document.getElementById('Asociado');
const tablaPrestamos = document.getElementById('tablaPrestamos');
const mensajePrestamo = document.getElementById('mensajePrestamo');

// Recuperar información guardada
let asociados = JSON.parse(localStorage.getItem('asociados')) || [];
let prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];


// CARGAR ASOCIADOS EN LA LISTA
function cargarAsociados() {

    selectAsociado.innerHTML = '<option value="">Seleccione un asociado</option>';

    asociados.forEach(asociado => {

        const opcion = document.createElement('option');

        opcion.value = asociado.documento;
        opcion.textContent = asociado.nombres + ' ' +
            asociado.apellidos + ' - ' + asociado.documento;

        selectAsociado.appendChild(opcion);

    });

}


// GUARDAR PRÉSTAMO
formularioPrestamo.addEventListener('submit', function(e) {

    e.preventDefault();

    const documento = selectAsociado.value;
    const valor = Number(document.getElementById('ValorPrestamo').value);
    const fecha = document.getElementById('FechaPrestamo').value;
    const interes = Number(document.getElementById('Interes').value);
    const cuotas = Number(document.getElementById('Cuotas').value);
    const observaciones = document.getElementById('Observaciones').value.trim();

    // Buscar asociado
    const asociado = asociados.find(a => a.documento === documento);

    if (!asociado) {
        mostrarMensaje('Debe seleccionar un asociado registrado.', 'red');
        return;
    }

    // Validar valor
    if (valor <= 0 || valor > 80000000) {
        mostrarMensaje('El préstamo debe ser mayor a cero y no superar $80.000.000.', 'red');
        return;
    }

    // Obtener préstamos activos del asociado
    const prestamosActivos = prestamos.filter(p =>
        p.documentoAsociado === documento && p.estado === 'Activo'
    );

    // Validar máximo de tres préstamos
    if (prestamosActivos.length >= 3) {
        mostrarMensaje('El asociado ya tiene 3 préstamos activos.', 'red');
        return;
    }

    // Calcular saldo total pendiente
    const deudaActual = prestamosActivos.reduce(
        (total, p) => total + Number(p.saldoPendiente), 0
    );

    // Validar límite de 80 millones
    if (deudaActual + valor > 80000000) {
        mostrarMensaje(
            'El asociado supera el límite de $80.000.000. Deuda actual: $' +
            deudaActual.toLocaleString('es-CO'),
            'red'
        );
        return;
    }

    // Crear nuevo préstamo
    const nuevoPrestamo = {

        codigo: 'PRE-' + Date.now(),
        documentoAsociado: documento,
        nombreAsociado: asociado.nombres + ' ' + asociado.apellidos,
        valor: valor,
        fecha: fecha,
        interes: interes,
        cuotas: cuotas,
        observaciones: observaciones,
        saldoPendiente: valor,
        estado: 'Activo'

    };

    // Guardar préstamo
    prestamos.push(nuevoPrestamo);

    localStorage.setItem('prestamos', JSON.stringify(prestamos));

    mostrarPrestamos();

    formularioPrestamo.reset();

    mostrarMensaje('¡Préstamo registrado correctamente!', 'green');

});


// MOSTRAR PRÉSTAMOS
function mostrarPrestamos() {

    tablaPrestamos.innerHTML = '';

    prestamos.forEach(prestamo => {

        const fila = document.createElement('tr');

        const datos = [
            prestamo.codigo,
            prestamo.nombreAsociado,
            '$' + Number(prestamo.valor).toLocaleString('es-CO'),
            prestamo.fecha,
            prestamo.cuotas,
            '$' + Number(prestamo.saldoPendiente).toLocaleString('es-CO'),
            prestamo.estado
        ];

        datos.forEach(dato => {

            const celda = document.createElement('td');
            celda.textContent = dato;
            fila.appendChild(celda);

        });

        tablaPrestamos.appendChild(fila);

    });

}


// MOSTRAR MENSAJES
function mostrarMensaje(texto, color) {

    mensajePrestamo.textContent = texto;
    mensajePrestamo.style.color = color;

}


// CARGAR INFORMACIÓN AL ABRIR
cargarAsociados();
mostrarPrestamos();
