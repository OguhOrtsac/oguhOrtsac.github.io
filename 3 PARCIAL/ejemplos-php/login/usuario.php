<?php
class Usuario
{
    private $db;

    public function __construct($host, $port, $dbname, $dbuser, $passwd)
    {
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;";
        $this->db =  new PDO($dsn, $dbuser, $passwd);
      #  $this->setAttribute(PDDO:ATTR_ERRMODE,);
    }


    public function agregar($usuario, $contraseña)
    {
        try
        {
            $sql = "INSERT INTO `usuarios` (`nombre`, `password`) VALUES (?, ?)";
            $instruccion =  $this->db->prepare($sql);
            $instruccion->execute(array($usuario, $contraseña));
        }
        catch  (PDOException $e){
            echo "Error en la insercion" . $e->getMessage();
         }
    }
    public function verificar($usuario, $contraseña)
    {
        try{
            $resultado = $this->db->prepare("SELECT * FROM `usuarios` WHERE `nombre` = ? AND `password` = ?");
            $resultado->execute(array($usuario, $contraseña));     
            $renglon =$resultado->fetchAll();   //regresa un array

            if(count($renglon)===1){
            return true;      
            }      
            else{
                return false;
            }
        }
        catch  (PDOException $e){
           echo "Error en la consulta" . $e->getMessage();
        }

    }
}

?>