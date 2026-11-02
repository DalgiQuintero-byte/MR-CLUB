
document.addEventListener('DOMContentLoaded', () => {

    // Verificar si el usuario inició sesión
    const logueado = localStorage.getItem('logueado');

    if (logueado !== 'true') {
        window.location.href = 'Login.html';
        return;
    }

    // Obtener información del usuario
    const nombre = localStorage.getItem('nombre');
    const rol = localStorage.getItem('rol');

    // Mostrar nombre del usuario
    document.getElementById('nombreUsuario').textContent = nombre || 'Usuario';

    // Obtener los módulos
    const administrador = document.getElementById('tarjetasadministrador');
    const asociado = document.getElementById('Tarjetasasociado');

    // Mostrar módulos según el rol
    if (rol === 'admin') {

        administrador.classList.remove('d-none');
        asociado.classList.add('d-none');

    } else {

        administrador.classList.add('d-none');
        asociado.classList.remove('d-none');

    }

});

// Cerrar sesión
function cerrarSesion() {

    localStorage.clear();

    window.location.href = 'Login.html';

}
