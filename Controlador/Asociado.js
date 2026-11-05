const formulario =document.getElementById("Contenedor-Formulario")

formulario.addEventListener("submit", function (event){
//evita recargar la águina cuando se envia un formulario
    event.preventDefault();
//bloqueo de botton
    const botonGuardar = formulario.querySelector('button[type="submit"]');

    //lee los campos del formulario y los cinvierte en un objeto
const asociado = object.fromEntries(new formData(formulario).entries());

botonGuardar.disabled = true; //Deshabilirtar el botón mientras se procesa la solicitud

try{
    const respusta = await fetch(formulario.action,{
        method:'POST' ,
        headers:{'content-Type':'application/json'},
        body:JSON.stringify(asociado),
    });
   
   //pasar la respuesta JSON a un objeto de JavaScript
    const resultado = await respuesta.json();
    document.getElementById("mensajeRegistro").textContent = "Guardando...";

    document.getElementById("mensajeRegistro").dataset.tipo='';

    document.getElementById("mensajeRegistro").texcontent = resultado.mensaje;

    if(respuesta.ok && resultado.seccess){
        formulario.reset(); //Limpiar el formulario si la solicitud fue exitosa 
    }
} catch (error){
  console.error("Error al enviar el formulario:", error);
  document.getElementById("mensajeRegistro").textcontent =
  "Ocurrio un error al enviar el formulario. Por favor, inténtalo de nuevo.";
}finally{
    botonGuardar.disabled = false; //Habilitar el boton despues de procesar la solicitud.
}
});
