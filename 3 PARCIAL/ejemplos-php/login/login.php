<?php


$nombre= $_POST['nombre'];        //variable
$contraseña = $_POST['pwd']; 

$login = new Login("localhost", "", "minifb", "root", "");
#$db =  new PDO($dsn, $username_db, $password_db);


if($login->verificar($nombre, $contraseña))
{
   echo " <br> Bienvenido $nombre";
}
else{
    echo"Usuario no detectado";
}
class Login
{
    private $db;

    public function __construct($host, $port, $dbname, $dbuser, $passwd)
    {
        $dsn = "mysql:host=$host;port=$port;dbname=$dbname;";
        $this->db =  new PDO($dsn, $dbuser, $passwd);
      #  $this->setAttribute(PDDO:ATTR_ERRMODE,);
    }

    public function consultar($consulta)
    {
        $resultado = $this->db->query($consulta);  #query regresa un conjunto de datos
        return $resultado;
    }

    /**
    * Verifica si el usuario existe en la BD con la contraseña indicada
    */
    public function verificar($usuario, $contraseña)
    {
        #Inyeccion SQL Hugo'; DROP TABLE usuarios; #
        #$Usuario = Hugo'; DROP TABLE usuarios; #"
        #consulta original
        #"SELECT * FROM `usuarios` WHERE nombre = '$usuario'"
        #consulta Inyectada
        #"SELECT * FROM `usuarios` WHERE nombre = 'Hugo'; DROP TABLE usuarios; #"

       # $resultado =$this->consultar("SELECT * FROM `usuarios` WHERE nombre = '$usuario'");
        try{
            $resultado = $this->db->prepare("SELECT * FROM `usuarios` WHERE `nombre` = ? AND `password` = ?");
            $resultado->execute(array($usuario, $contraseña));
            
            $renglon =$resultado->fetchAll();   //regresa un array
            
           // if($renglon[0] === $usuario && $renglon[1]=== $contraseña){
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