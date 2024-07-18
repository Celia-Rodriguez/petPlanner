<?php

    session_start();

    include('../include/DB.php');
    
    $usuario = $_SESSION['user'];
    $userId = $usuario['id'];

    $userEmail = $_REQUEST['email_cambio_email'];
    $userPassword = $_REQUEST['password_cambio_email'];

    try{
        //comprobamos que la contraseña sea correcta
        $result = DB::checkUserPassword($userId,$userPassword);

        if($result == false){
            echo "noPassword";
            exit();
        }

        //comprobamos que el nuevo email no esté en uso
        $result = DB::issetEmail($userEmail);

        if($result == false){
            echo "existeEmail";
            exit();
        }

        //Actualizamos email del usuario
        $result = DB::updateEmailUser($userId,$userEmail);
        
        if($result == false){
            echo "false";
            exit();
        }

        $usuario['email'] = $userEmail;
        $_SESSION['user'] = $usuario;

        $resultado = [];
        $resultado['result'] = true;
        $resultado['data'] = $usuario;
        $resultado['result'] = true;

        echo json_encode($resultado);
        
    }catch(Exception $e){
        echo $e->getMessage();
        die();
    }

?>