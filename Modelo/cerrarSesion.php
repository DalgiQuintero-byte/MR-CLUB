<?php

header("content-Type: applicaton/json; charset=utf-8")

if($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    //saltar a catch y mostrar el mensahje de errror 
    throww new Exeption("Método HTTP no permitido");
}

session_start();
$_SESSION = [];

if (ini_get("sessiom.use_cookies")){
    $params = session_get_cookie_params();

    setcookie(session_name(), '', time() - 42000, $params["path"], $params["domain"], $params["secure"], $params["httponly"]);
}

session_destroy();

echo json_encode([
    "success" => true,
]);

