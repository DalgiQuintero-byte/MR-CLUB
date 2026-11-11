<?php
require_once __DIR__ .'/../config/conexion.php';
class Asociado
{
    private $documento;
    private $nombres;
    private $apellidos;
    private $fechaNacimiento;
    private $genero;
    private $direccionResidencia;
    private $ciudad;
    private $telefono;
    private $email;
    private $contraseña;
   


    private $conexion;
    
public function __construct($datos)
{
   $this->documento = $datos['documento'];
   $this->nombres = $datos['nombres'];
   $this->apellidos = $datos['apellidos'];
   $this->fechaNacimiento = $datos['fechaNacimiento'];
   $this->genero = $datos['genero'];
   $this->direccionResidencia = $datos['direccionResidencia'];
   $this->ciudad = $datos['ciudad'];
   $this->telefono = $datos['telefono'];
   $this->email = $datos['email'];
   $this->contraseña = password_hash($datos['contraseña'], PASSWORD_DEFAULT);

   $conexionDB = new conexion();
   $this->conexion = $conexionDB->conectar();
}

public function guardar()
{
    $sql = "INSERT INTO asociados (documento, nombres, apellidos, fechaNacimiento, genero, direccionResidencia, ciudad, telefono, email, contraseña) VALUES (:documento, :nombres, :apellidos, :fechaNacimiento, :genero, :direccionResidencia, :ciudad, :telefono, :email, :contraseña)";
    $consulta = $this->conexion->prepare($sql);
    
    return $consulta->execute([
        $this->documento,
        $this->nombres,
        $this->apellidos,
        $this->fechaNacimiento,
        $this->genero,
        $this->direccionResidencia,
        $this->ciudad,
        $this->telefono,
        $this->email,
        $this->contraseña,
   
    ]);
}
}