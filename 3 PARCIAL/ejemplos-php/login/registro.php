<?php



    $nombre= $_POST['nombre'];        //variable
    $contraseña = $_POST['pwd']; 

    include 'usuario.php';

    $usuario = new usuario("localhost", "", "minifb", "root", "");
    $usuario->agregar($usuario, $contraseña);

?>