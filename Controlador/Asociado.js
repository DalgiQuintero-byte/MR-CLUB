const formAsociado = document.getElementById("Contenedor-Formulario");

    formAsociado.addEventListener("submit", async function (event) {
        //Evitar que se envie el formulario por defecto//
        event.preventDefault();

        const botonGuardar = formAsociado.querySelector("button[type='submit']"); //Algo para que el usuario vea la vista//
        
        /*Lee los datos del formulario y los convierte en un objeto*/
        const asociado = Object.fromEntries(new FormData(formAsociado).entries());

        if(asociado.contraseña !== asociado.ConfirmarContraseña){
            document.getElementById("MensajeRegistro").textContent = "Las contraseñas no coinciden";
            document.getElementById("MensajeRegistro").dataset.tipo="error";
            return;
        }
        delete asociado.ConfirmarContraseña; /*Elimina la propiedad confirmarContraseña del objeto asociado*/

        botonGuardar.disabled = true; /*Desactiva el boton guardar para evitar que se envie varias veces el formulario*/
         
        try{
            const respuesta = await fetch(formAsociado.action,{method:'POST',headers:{'Content-Type': 'application/json'},body:JSON.stringify(asociado)});
            /*Pasar la respuesta json a un objeto de JavaScript*/
            const resultado = await respuesta.json();
            
            document.getElementById("MensajeRegistro").textContent = "Guardardo correctamente";
            document.getElementById("MensajeRegistro").dataset.tipo="";
            document.getElementById("MensajeRegistro").textContent = resultado.mensaje;


            if(respuesta.ok && resultado.success){
                fomularioAsociado.reset(); /*Limpia el formulario*/
            }
        
        }catch(error){
            console.error("Error al enviar el formulario:", error);
            document.getElementById("MensajeRegistro").textContent = "Error al enviar el formulario";
        }finally {
            botonGuardar.disabled = false; /*Reactiva el boton guardar*/
        }
     });