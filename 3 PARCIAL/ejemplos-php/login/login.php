<?php
    
/*     echo " <br> contenido del arreglo GET <br>";
var_dump($_GET);        //var_dump observar la variable

echo " <br> contenido del arreglo POST <br>";
var_dump($_POST); */

$nombre= $_POST['nombre'];        //variable

$dsn = "mysql:host=localhost;dbname=minifb";
$username_db = "root";
$password_db="";

$db =  new PDO($dsn, $username_db, $password_db);

$sql =  "SELECT * FROM `usuarios` WHERE nombre = '$nombre'";

$resultado= $db->query($sql);
$renglon =$resultado->fetch();

if($renglon[0] === $nombre){
echo " <br> Bienvenido $nombre";
}

else{
    echo"Usuario no detectado";
}


?>