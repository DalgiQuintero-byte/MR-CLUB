<?php

require_once __DIR__ . '/../confing/conexion.php';

class Actividad{
    private $conexion;
    public function__construc()
    {
        $conexionDB = new Conexion();
        $this->conexion = $conexionDB->conectar();
        }
        public function obtenerActividades(){
            $sql = "SELECT * FROM actividades ORDER BY fechaEvento ASC";
            $consulta = $this->conexion->prepare(sql);
            $consulta->execute();
            return $consulta->fetchAll();
        }
        public function guardar(){
            $sql "INSERT INTO actividades (nombreActividad. fechaEvento, municipio)
            VALUES (:nombreActividad, :fecvhaEvento, :municipio)";
            $consulta =$this->conexion->prepare(sql);
            return $consulta->execute([
                ":nombreActividad" => $datos['nombreActividad'],
                ":fechaEvento" => $datos['fechaEvento'],
                ":municipio" => $datos['municipio'],
            ])
        }
        public function eliminar($idAdtividad){
            $sql ="DELETE *FROM actividades WHERE idAdtividad =:idAdtividad ";
            $consulta->execute([':idAdtividad' => $idAdtividad]);
            return $consulta->rowCount() > 0; //Retorna true si se elimino una fila 
        }
        public function editar($datos){
           $sql ="DELETE *FROM actividades SET nombreAdtividad = :nombreAdtividad, fechaEvento = :fechaEvento, municipio = :municipio, totalRecaudado = :totalRecaudado WHERE idAdtividad =:idAdtividad ";
           $consulta = $this->conexion->prepare(sql);
           return $consulta->execute([
            ":nombreActividad" => $datos['nombreActividad'],
            ":fechaEvento" => $datos['fechaEvento'],
            ":municipio" => $datos['municipio'],
            ":totalRecaudado" => $datos['totalRecaudado'],
            ":idAdtividad" => $datos['idAdtividad']
           ])
          if ($consulta->rowCount() > 0){
            return true;
          }

          $verificar = $this->conexion->prepare("SELECT 1 FROM actividades WHERE idAdtividad =:idAdtividad");
           $verificar->execute([':idAdtividad' => $datos['idAdtividad']]);

           return (bool)$->verificar->fetchcolum(); //Retorna true si el registro existe, false si no
        }
    }
