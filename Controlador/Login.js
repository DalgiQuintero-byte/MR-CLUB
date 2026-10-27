const Usuarios = [
    { usuario: 'admin@gmail.com', clave: '123', rol: 'admin', nombre: 'admin  MR' },
    { usuario: 'pepito@gmail.com', clave: '123', rol: 'asociado', nombre: 'juan pérez' }
];

document.getElementById('FormuLogin').addEventListener('submit', function (e) {
    e.preventDefault();

    const usuarioInput = document.getElementById('email').value;
    const claveInput = document.getElementById('Password').value;

    const usuarioEncontrado = Usuarios.find(
        u => u.usuario === usuarioInput && u.clave === claveInput
    );

    if (usuarioEncontrado) {
        localStorage.setItem('logueado', 'true');
        localStorage.setItem('rol', usuarioEncontrado.rol);
        localStorage.setItem('nombre', usuarioEncontrado.nombre);
        window.location.href = 'dashboard.html';
    }
    else {
        alert('Usuario o contraseña incorrectos');
    }
});
