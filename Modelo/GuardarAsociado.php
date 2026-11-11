<?php
header("Content-Type: application/json; charset=utf-8"); // Corregido el guion por igual en charset
require_once __DIR__ . '/Asociado.php';

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        throw new Exception("Método HTTP no permitido");
    }

    /* Leer el contenido JSON del cuerpo de la solicitud */
    $json = file_get_contents("php://input");
    $datos = json_decode($json, true);

    /* Si los datos llegan por POST clásico de formulario tradicional ($_POST), los usamos como respaldo */
    if (empty($datos) && !empty($_POST)) {
        $datos = $_POST;
    }

    /* Validar que los datos requeridos estén presentes */
    if (!is_array($datos)) {
        http_response_code(400);
        throw new Exception("Datos inválidos");
    }

    /* Campos requeridos (asegurando 'contraseña' en minúscula) */
    $campos = ['documento', 'nombres', 'apellidos', 'fechaNacimiento', 'direccionResidencia', 'ciudad', 'telefono', 'email', 'contraseña', 'genero'];
    
    foreach ($campos as $campo) {
        if (!isset($datos[$campo]) || trim($datos[$campo]) === '') {
            http_response_code(400);
            throw new Exception("Falta el campo requerido: " . $campo);
        }
    }

    /* CORREGIDO: 'email' en minúscula */
    if (!filter_var($datos['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        throw new Exception("Formato de email inválido");
    }

    $asociado = new Asociado($datos);
    $resultado = $asociado->guardar();
    
    if ($resultado) {
        http_response_code(201);
        echo json_encode(["success" => true, "mensaje" => "Asociado guardado correctamente"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "mensaje" => "Error al guardar el asociado"]);
    }

} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Código de error para datos duplicados en MySQL
        http_response_code(409); // Conflicto
        echo json_encode(["success" => false, "mensaje" => "El documento ya está registrado"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "mensaje" => "Error en la base de datos: " . $e->getMessage()]);
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "mensaje" => $e->getMessage()]);
}