<?php
session_start();

header("content-Type: application/json ;charset=UTF-8");

function leerDatos()
{
$datos = json_decode(file_get_contents("php://input"), true);
if(json_last_error() !== JSON_ERROR_NONE){
    http_response_code(400);
    throw new Exception("Error al decodificar JSON:" .json_last_error_msg());
}
return $datos;
}

function validarActividad($datos){
    $nombre = $datos['nombreActividad'] ?? null;
    $fecha = $datos['fechaEvento'] ?? null;
    $municipio = $datos['municipio'] ?? null;
    if(!is_string($nombre)|| trim($nombre) === "" || strlen($nombre) > 100 || !is_string($municipio) || trim($municipio) ==="" || strlen($municipio ) > 50){
      http_response_code(400);
      throw new Exception(
        "Ingresa un nombre y municipio válidos"
      );
    }
    return[
        "nombreActividad" => trim($nombre),
        "fechaEvento" => $fecha,
        "municipio" => trim($municipio)
    ];
}

function validarId($id){
    $idActividad=filter_var($id, FILTER_VALIDATE_INT,["options" => ["min_range" => 1]]);
    if($idActividad === false ){
        http_response_code(400);
        throw new Exception("El identificador de la actividad no es válido");   
    }
    return $idActividad;
}
try {
if(!isset($_SESSION["documento"], $_SESSION["rol"])){
    http_response_code(401);
    throw new Exception("Iniciar sesión para consultar las actividades"),
}

$metodo = $_SERVER["REQUEST_METHOD"];

if(!in_array($metodo, ["GET", "POST", "PUT", "DELETE"], true)){
    http_response_code(405);
    throw new Exception ("Método HTTP mo permitido");
}

if($metodo !== "GET" && $_SESSION["rol"] !== "admin"){
    http_response_code(403);
    throw new Exception ("No tiene permisos para realizar esta acción");
}

require_once __DIR__ . "/Actividad.php";
$actividad = new Actividad();

switch ($metodo) {


    case "GET":
    $resultado=[
     "success" => true,
     "rol" => $_SESSION["rol"],
     "actividades" =>$actividad->obtenerActividades()
        ];  
        http_response_code(200);
        break;
    case "POST":  
        $datos = validarActividad(leerDatos()); 
        $actividad->guardar($datos);
        $resultado = [
            "success" => true,
            "message" => "Actividad creada exitosamente"

        ];
        http_response_code(201);

        break;
        case "DELETE":
            $datos=leerDatos();
            $idActividad = validarId($datos["idActividad"] ?? null);
            if (!$actividad->eliminar(idAactividad)) {
              http_response_code(404);
              throw new Exception("No se encontro la actividad");
              
            }
            $resultado =[
                "success" => true,
                "mensaje" => "Actividad eliminada correctamenete"
            ];
            http_response_code(200);
         
            break;
        case "PUT": 
            $datos=leerDatos();
            $datos["idActividad"]=validarId($datos["idActividad"] ?? null);
            $datos = array_merge($datos,validarActividad($datos));
            if(!$actividad->editar($datos)){
                http_response_code(404);
                throw new Exception("No se encontro la actividad");
            }
            $resultado = [
                "success" => true,
                "mensaje" => "Actividad actualizada correctamente"
            ]


}
echo json_encode($resultado),


} catch (PDOException $e) {
    http_response_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);

}

