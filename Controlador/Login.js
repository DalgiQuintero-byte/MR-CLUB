const formulario = document.getElementById('formuLogin');
formulario.addEventListener('submit', async function (e) {
    e.preventDefault();

    const botton = document.querySelector('button[type="submit"]');
    const mensaje = formulario.querySelector("mensajeLogin");

botton.disabled = true;

try{
const respuesta = await fetch (formulario.action,{
    method: "POST",
    headers:{"content-Type": "application/json"},
    body: JSON.stringify(Object.fromEntries(new FormData(formulario).entries()),
),
});

const resultado = await respuesta.json();

if(!resultado.success){
mensaje.textContent = "No fue posible iniciar sesion. po favor, verificar tis credenciales";
botton.disabled = false;
return;
}

localStorage.setItem("logueado", "true");
localStorage.setItem("rol", resultado.rol);
localStorage.setItem("nombre", resultado.nombre);

window.location.href = "dashboard.html";
}catch (error) {
console.error("Error al iniciar sesión", error);
mensaje.textContent = "Ocurrio un error al intentar iniciar sesión. por favor, inténtalo de nuevo más tarde.";
}finally{
    botton.disabled = false;
}
   
});
