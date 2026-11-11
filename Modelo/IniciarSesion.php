<?php

session_start();

header("Content-Type: application/json; charset=utf-8");

try {
    if ($_SERVER["REQUEST_METHOD"] !== "POST") {
        http_response_code(405);
        //saltar a catch y mostrar el mensaje de eeror
        throw new Exception("Método HTTP no permitido");
    }

    /* Leer el contenido JSON del cuerpo de la solicitud */
    $datos = json_decode(file_get_contents("php://input"), true);

    if (!is_array($datos) || json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        throw new Exception("Datos inválidos");
    }

    $email = $datos['email'] ?? "";
    $contraseña = $datos['contraseña'] ?? "";

    /* CORREGIDO: is_string con guion bajo */
    if (!is_string($email) || !is_string($contraseña) || $email === "" || $contraseña === "") {
        http_response_code(400);
        throw new Exception("email o contraseña inválidos");
    }

    require_once __DIR__ . '/../Config/conexion.php';
    $conexion = (new Conexion())->conectar();

    $consulta = $conexion->prepare("SELECT * FROM asociados WHERE email = :email");
    $consulta->execute([':email' => $email]);
    $asociado = $consulta->fetch();

    /* CORREGIDO: password_verify en inglés y apuntando a la columna 'contraseña' */
    if (!$asociado || !password_verify($contraseña, $asociado['contraseña']) || empty($asociado['contraseña'])) {
        http_response_code(401);
        throw new Exception("email o contraseña incorrectos");
    }

    /* CORREGIDO: paréntesis agregados en strtolower */
    $_SESSION["rol"] = strtolower($asociado['rol'] ?? 'asociado'); 
    $_SESSION["documento"] = $asociado['documento'];

    echo json_encode([
        "success" => true,
        "rol" => $_SESSION["rol"],
        "nombre" => $asociado["nombres"] . " " . $asociado["apellidos"],
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    $errorMenssage = "error: " . $e->getMessage();
    echo json_encode([
        "success" => false,
        "mensaje" => $errorMenssage
    ]); /* CORREGIDO: Faltaba punto y coma aquí */

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        "success" => false, 
        "mensaje" => $e->getMessage()
    ]);
}