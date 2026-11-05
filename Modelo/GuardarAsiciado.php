<?php
header("Content-Type: application/json; charset-utf-8");
require __DIR__ . '../Modelo/Asociados.php';

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);

        /*Saltar a catch y mostrar el mensaje de error en foemato JSON*/
        throw new Exception("Método HTTP no permitido");
    }
    /*Leer el contenido JSON del cuerpo de la solicitud*/
    $json = file_get_contents("php://input");

    /*Decodificar el JSON en un arreglo asociativo*/
    $datos= json_decode($json, true);

    /*Validar que los datos requeridos esten presentes*/
    if(!is_array($datos) || json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        throw new Exception("Datos inválidos");
    }

    /*Crear una intancia de la clase Asociados y guardar los datos en la base de datos*/
    $campos=['documento','Nombres','Apellidos','FechaNacimiento','DirecciónDeResidencia','Ciudad','Telefono','Email','genero']
    
    foreach($campos as $campo) {
        if (!isset($datos[$campo])) {
            http_response_code(400);
            throw new Exception("Falta el campo requerido:" . $campo);
        }
    }
    if (!filter_var($datos['Email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        throw new Exception("Formato de email inválido");
    }

    $asociado = new Asociados($datos);
    $resultado =$asociado->guardar();
    
    if ($resultado) {
        http_response_code(201);
        echo json_encode(["success" => true, "mensaje" => "Asociado guardado correctamnente"]);


        
    }else{
        http_response_code(500);
        echo json_encode(["success" => false, "mensaje" => "Error al guardar el asociado"]);
    }
  }catch (PDOException $e){
   if ($e->getcode() == 23000){ //codigo de eerr para datos duplicados es mysql
    http_response_code(409)//conflicto
    echo json_encode(["siccess" =>false, "mensaje" => "El documento ya esta registrado"]);
   }else{
    http_response_code(500);
    echo json_encode(["success" => false, "mensaje" => "Error en la base de datos:" . $e->getMessage()]);
   }

//Error de código po ejemplo metodoHTTP,datos invalidos
}catch (Exception $e){
   echo json_encode(["success" => false, "mensaje" => $e->getMessage()]);

}