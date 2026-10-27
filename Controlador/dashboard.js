document.addEventListener('DOMContentLoaded', () =>{
    const logueado = localStorage.getItem('logueado');

    if (logueado !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    const nombre = localStorage.getItem('nombre');
    const rol = localStorage.getItem('rol');

    document.getElementById('nombreUsuario').textContent = nombre;

    if (rol === 'admin') {
        document.getElementById('tarjetasadministrador').classList.remove('d-none');
        document.getElementById('Tarjetasasociado').classList.add('d-none');
    } else {
        document.getElementById('tarjetasadministrador').classList.add('d-none');
        document.getElementById('Tarjetasasociado').classList.remove('d-none');
    }
});


function cerrersesion() {
    localStorage.clear();
    window.location.href = '../vista/login.html';
}
