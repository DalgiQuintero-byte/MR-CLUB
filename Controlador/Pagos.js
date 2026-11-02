
// Obtener elementos del formulario
const formularioPago = document.getElementById('FormularioPago');
const selectPrestamo = document.getElementById('Prestamo');
const asociadoPago = document.getElementById('AsociadoPago');
const saldoPendiente = document.getElementById('SaldoPendiente');
const tablaPagos = document.getElementById('tablaPagos');
const mensajePago = document.getElementById('mensajePago');

// Recuperar información guardada
let prestamos = JSON.parse(localStorage.getItem('prestamos')) || [];
let pagos = JSON.parse(localStorage.getItem('pagos')) || [];


// CARGAR PRÉSTAMOS ACTIVOS
function cargarPrestamos() {

    selectPrestamo.innerHTML =
        '<option value="">Seleccione un préstamo</option>';

    prestamos.forEach(prestamo => {

        if (prestamo.estado === 'Activo' &&
            Number(prestamo.saldoPendiente) > 0) {

            const opcion = document.createElement('option');

            opcion.value = prestamo.codigo;

            opcion.textContent =
                prestamo.codigo + ' - ' +
                prestamo.nombreAsociado + ' - Saldo: $' +
                Number(prestamo.saldoPendiente).toLocaleString('es-CO');

            selectPrestamo.appendChild(opcion);
        }

    });

}


// MOSTRAR INFORMACIÓN DEL PRÉSTAMO SELECCIONADO
selectPrestamo.addEventListener('change', function() {

    const codigo = selectPrestamo.value;

    const prestamo = prestamos.find(p => p.codigo === codigo);

    if (prestamo) {

        asociadoPago.value = prestamo.nombreAsociado;

        saldoPendiente.value =
            '$' + Number(prestamo.saldoPendiente).toLocaleString('es-CO');

    } else {

        asociadoPago.value = '';
        saldoPendiente.value = '';

    }

});


// REGISTRAR PAGO
formularioPago.addEventListener('submit', function(e) {

    e.preventDefault();

    const codigoPrestamo = selectPrestamo.value;

    const prestamo = prestamos.find(
        p => p.codigo === codigoPrestamo
    );

    if (!prestamo) {
        mostrarMensaje('Debe seleccionar un préstamo válido.', 'red');
        return;
    }

    const valor = Number(document.getElementById('ValorPago').value);

    const fecha = document.getElementById('FechaPago').value;

    const metodo = document.getElementById('MetodoPago').value;

    const observacion =
        document.getElementById('ObservacionPago').value.trim();

    const saldoActual = Number(prestamo.saldoPendiente);

    // Validar valor del pago
    if (!Number.isFinite(valor) || valor <= 0) {
        mostrarMensaje('El valor del pago debe ser mayor a cero.', 'red');
        return;
    }

    // Evitar pagos superiores a la deuda
    if (valor > saldoActual) {
        mostrarMensaje(
            'El pago supera el saldo pendiente de $' +
            saldoActual.toLocaleString('es-CO'),
            'red'
        );
        return;
    }

    // Crear comprobante
    const nuevoPago = {

        comprobante: 'PAG-' + Date.now(),
        codigoPrestamo: codigoPrestamo,
        documentoAsociado: prestamo.documentoAsociado,
        nombreAsociado: prestamo.nombreAsociado,
        fecha: fecha,
        valor: valor,
        metodo: metodo,
        observacion: observacion

    };

    // Guardar pago
    pagos.push(nuevoPago);

    // Actualizar saldo del préstamo
    prestamo.saldoPendiente = saldoActual - valor;

    // Si el saldo llega a cero, marcar como pagado
    if (prestamo.saldoPendiente === 0) {
        prestamo.estado = 'Pagado';
    }

    // Actualizar información en localStorage
    localStorage.setItem('pagos', JSON.stringify(pagos));

    localStorage.setItem('prestamos', JSON.stringify(prestamos));

    // Actualizar pantalla
    mostrarPagos();

    cargarPrestamos();

    formularioPago.reset();

    asociadoPago.value = '';
    saldoPendiente.value = '';

    mostrarMensaje('¡Pago registrado correctamente!', 'green');

});


// MOSTRAR HISTORIAL DE PAGOS
function mostrarPagos() {

    tablaPagos.innerHTML = '';

    pagos.forEach(pago => {

        const fila = document.createElement('tr');

        const datos = [
            pago.comprobante,
            pago.nombreAsociado,
            pago.codigoPrestamo,
            pago.fecha,
            '$' + Number(pago.valor).toLocaleString('es-CO'),
            pago.metodo
        ];

        datos.forEach(dato => {

            const celda = document.createElement('td');

            celda.textContent = dato;

            fila.appendChild(celda);

        });

        tablaPagos.appendChild(fila);

    });

}


// MOSTRAR MENSAJES
function mostrarMensaje(texto, color) {

    mensajePago.textContent = texto;

    mensajePago.style.color = color;

}


// CARGAR INFORMACIÓN AL ABRIR
cargarPrestamos();

mostrarPagos();
