<?php

    session_start();

    include('../include/DB.php');

    $usuario = $_SESSION['user'];
    $userId = $usuario['id'];
    $email = $usuario['email'];

    $password  = $_POST['password'];
    $question = $_POST['security_question'];
    $answer = $_POST['security_answer'];

    try{
        //comprobamos que la contraseña sea correcta
        $result = DB::checkUserPassword($userId,$password);

        if($result == false){
            echo "noPassword";
            exit();
        }

        $result = DB::getDataUser($email);

        if(!$result){
            exit();
        }

        if($question !== $result['pregunta_seguridad'] || $answer !== $result['respuesta_seguridad']){
            echo "noPregunta";
            exit();
        }

        $mascotas = DB::numeroMascotasUsuario($userId);

        if($mascotas>0){
            echo "tieneMascotas";
            exit();
        }

        $result = DB::eliminarUsuario($userId);
        echo $result;

    }catch(Exception $e){
        echo $e->getMessage();
        die();
    }

?>