const formulario = document.getElementById("formLogin");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    const mensaje = document.getElementById("mensaje");

    // Usuario de prueba
    if (correo === "admin@mrclub.com" &&
        contrasena === "123456") {

        mensaje.textContent = "¡Inicio de sesión exitoso!";
        mensaje.style.color = "green";

    } else {
        mensaje.textContent = "Correo o contraseña incorrectos.";
        mensaje.style.color = "red";
    }
});