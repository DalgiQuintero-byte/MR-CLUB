<?php
require_once __DIR__ .'/../Config/conexion.php';

class Asociado {
    private $documento;
    private $nombres;
    private $apellidos;
    private $fechaNacimiento;
    private $direccionResidencia;
    private $ciudad;
    private $telefono;
    private $email;
    private $contraseña;
    private $genero;
    private $conexion;
    
public function __construct($datos){
   $this->documento           = $datos['documento'];
   $this->nombres             = $datos['nombres'];
   $this->apellidos           = $datos['apellidos'];
   $this->fechaNacimiento     = $datos['fechaNacimiento'];
   $this->direccionResidencia = $datos['direccionResidencia'];
   $this->ciudad              = $datos['ciudad'];
   $this->telefono            = $datos['telefono'];
   $this->email               = $datos['email'];
   $this->contraseña          = password_hash($datos['contraseña'], PASSWORD_DEFAULT); //encripta la contraseña antes de guardarla en la base de datos //
   $this->genero             = $datos['genero'];

   $conexionDB = new conexion();
   $this->conexion = $conexionDB->conectar();
}
public function guardar(){
    $sql = "INSERT INTO asociados 
    (documento, nombres, apellidos, fechaNacimiento, direccionResidencia, ciudad, telefono, email, contraseña,  genero) 
    VALUES 
    (:documento, :nombres, :apellidos, :fechaNacimiento, :direccionResidencia, :ciudad, :telefono, :email, :contraseña, :genero)";
    
    $consulta = $this->conexion->prepare($sql);
    
     return $consulta->execute([
        ':documento'           => $this->documento,
        ':nombres'             => $this->nombres,
        ':apellidos'           => $this->apellidos,
        ':fechaNacimiento'     => $this->fechaNacimiento,
        ':direccionResidencia' => $this->direccionResidencia,
        ':ciudad'             => $this->ciudad,
        ':telefono'            => $this->telefono,
        ':email'               => $this->email,
        ':contraseña'          => $this->contraseña,
        ':genero'              => $this->genero
   
    ]);
   }
}