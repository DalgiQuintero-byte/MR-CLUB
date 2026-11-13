const formularioactividad = document.getElementById("listaActividades");
let esAdministrador = false;
let actividades = [];

async function solicitarApi(metodo, datos) {
    const opciones = {
        method: metodo,
        headers: { 'content-Type': 'application/json' },
    };

    if (datos) {
        opciones.body = JSON.stringify(datos);
    }

    const respuesta = await fetch("../Modelo/gestionarActividades.php", opciones);
    const resultado = await respuesta.json();

    if (respuesta.status === 401) {
        window.location.href = "login.html";
    }

    if (!respuesta.ok || !resultado.success) {
        throw new Error(resultado.mensaje || "Error en la solicitud");
    }

    return resultado;
}

async function cargarActividades() {
    try {
        const resultado = await solicitarApi("GET");
        esAdministrador = resultado.rol === "admin";

        configuardarAcciones();

        actividades = resultado.activodades;
    } catch (error) {
        alert("Error al cargar las actividades: " + error.message);
    }
    function mostrarActividades() {
        formularioactividad .replaceChildren();

        if (actividades.length === 0) {
            const fila = document.createElement("tr");
            const celda = document.createElement("td");
            celda.colSpan = esAdministrador ? 5 : 4;
            celda.className = "text-center py-4 text-muted";
            celda.textContent = "No hay actividades disponibles.";
            fila.append(celda);
            formularioactividad .append(fila);
            return;
        }

        actividades.forEach((actividad) => {

            const fila = document.createElement("tr");
            fila.append(
                crearCelda(actividades.nombreActividad),
                crearCelda(actividades.fechaEvento),
                crearCelda(actividades.municipio),
                crearCelda(actividades.totalRecaudo === null ? "pendiente" : Number(actividad.totalRecaudado).toLocaleString("es-CO", { style: "currency", currency: "COP" })),

            );
            if (esAdministrador) {
                const acciones = document.createElement("td");
                acciones.className = "tex-nowrap";

                const botonEditar = document.createElement("button");
                botonEditar.type = "button";
                botonEditar.className = "btn btn-sm btn-outline-primary me-2";
                botonEditar.innerHTML = '<i class="bi bi-pencil-square"></i>';
                botonEditar.addEventListener("click", () => abrieEdicion(actividad));

                const botonEliminar = document.createElement("button");
                botonEliminar.type = "button";
                botonEliminar.className = "btn btn-sm btn-outline-primary me-2";
                botonEliminar.innerHTML = '<i class="bi bi-trash3-fill"></i>';
                botonEliminar.addEventListener("click", () => eliminarActividad(actividad));

                acciones.append(botonEditar, botonEliminar);
                fila.append(acciones);

            }
            formularioactividad .append(fila);

        });
    }
    function crearCelda(texto){
        const celda = document.createElement("td");
        celda.textContent = texto;
        return celda;
    }
    cargarActividades();
}

