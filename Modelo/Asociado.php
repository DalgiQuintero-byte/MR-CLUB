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

$conexionDB = new conexion();
$this->conexion = $conexionDB->conectar();

}

public function guardar()
{
    $sql = "INSERT INTO asociados (documento, nombres,apellidos,fechaNacimuento,genero, direccionResidencia, ciudad, telefono, email) VALUES (:documento, :nombres, :apellidos, :fechaNacimiento, :genero, :direccionResidencia, :ciudad, :telefono, :email)";
    $consulta = $this->conexion->prepare($sql);
    return $consulta->execute([
        ":documento" => $this->docuemento,
        ":nombres" => $this->nombres,
        ":apellidos" => $this->apellidos,
        ":fechaNacimiento" => $this->fechaNacimiento,
        ":genero" => $this->genero,
        ":direccionResidencia" => $this->direccionResidencia,
        ":ciudad" => $this->ciudad,
        ":telefono" => $this->telefono,
        ":email" => $this->email
    ]);
}
}
