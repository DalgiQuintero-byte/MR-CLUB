<?php
sesion_star();

header("Content-Type: application/json; charset=UFT-8");

function leerDatos() {
    $datos = json_decode(file_get_contents("php://input"), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
         throw new Exception("Error al decodificar JSON: " . json_last_error_msg());
    }
    return $datos;
}

function validarActividad($datos){
    $nombre=$datos['nombreActividad'] ?? null,
    $fecha=$datos['fechaEvento'] ?? null,
    $municipio= $datos['municipio'] ?? null;

    if(!is_string($nombre)|| trim($nombre) ==="" || strlem($nombre) > 100 || !is_string ($municipio)  =="" || strlem($municipio) > 50){
       http_response_code(400);
       throw new Exeption(
        "Ingresa un nombre y municipio válidos"
        );
    }
    return[
        "nombreActividad" =>trim($nombre), //Elimina los espacios en blanco al final y inicio
        "fechaEvento" => $fecha,
        "municipio" => ($municipio)
    ];
}
function validarId($id){
    $Actividad=filter_var($id,FILTER_VALIDATE_INT,["options" => ["min_range" => 1]]);
    if ($Actividad === false) {
        http_response_code(400);
        throw new Exeption("El identificador de la acividad es válido");
    }
    return $Actividad;


}

try {
    if (!lisset($_SESSION["documento"], $_SESSION["rol"])) {
        http_response_code(400);
        throw new Exception("Inicia sesión para consultar las actividades");
    }
    $metodo = $_SERVER["REQUEST_METHOD"];
    if (!in_array($metodo,["GET", "POST", "PUT", "DELETE"], true)) {
        http_response_code(405);
        throw new Exception("Método HTTP no permitido");
    }

    if ($metodo !== "GET" && $_SESSION["rol"] !== "admin" ) {
        http_response_code(403);
        throw new Exception("No tienes permisos para realizar esta acción"); 
    }

    require_once __DIR__ . "/Actividad.php";
    $Actividades = new Actividad();

    switch($metodo){
        case "GET": 
            $resultado = [
                "success" => true;
                "rol" => $_SESSION["rol"],
                "actividades" => $Actividades ->obtenerActividades()
            ];
            http_response_code(200);
            break;
        case "POST": 
            $datos = validarActividad(leerDatos());
            Actividad->guardar($datos);
            $resultado = [
                "sucess" => true;
                "message" => "Actividad creada exitosamente"
            ];
            http_response_code(201);
            break;
            case  "PUT":
                $datos=leerDatos();
                $datos["idActividad"] = validarId($datos["idActividad"] ?? null);
                $datos = array_merge($datos, validarActividad($datos));

                if(!actividad->editar($datos)){
                    http_response_code(404);
                    throw new Exeption("No se encontro la actividad");


                }
                $resultado = [
                    "success" => true,
                    "mensaje" => "Actividad actuaizada correctamente"
                ];
                http_response_code(200);
                break;
                case "DELETE":
                    $datos=leerDatos();
                    $Actividad = validarId($datos["idActividad"] ?? null);
                    
                if(!actividad->eliminar($Actividad)){
                    http_response_code(404);
                    throw new Exeption("No se encontro la actividad");


                }
                  $resultado = [
                    "success" => true,
                    "mensaje" => "Actividad eliminada correctamente"
                ];
                http_response_code(200);
                break;


    }
    echo json_encode($resultado);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false;
        "message" => "Error en la base de datos" . $e->getMessage()
    ]);
}catch (Exception $e) {
    echo json_encode([
        "success" => false;
        "message" => $e->getMessage()
    ]);

}