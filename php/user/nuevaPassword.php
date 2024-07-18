<?php

    session_start();

    include('../include/DB.php');

    $usuario = $email = "";
    if(isset($_POST['email'])){
        $email = $_POST['email'];
    }else if(isset($_SESSION['user'])){
        $usuario = $_SESSION['user'];
        $email = $usuario['email'];
    }
    
    $password  = $_POST['password'];
    $question = $_POST['security_question'];
    $answer = $_POST['security_answer'];

    try{
        $result = DB::getDataUser($email);


        if(!$result){//No existe el email en la base de datos
            echo "noEmail"; 
            exit();
        }

        if($question !== $result['pregunta_seguridad'] || $answer !== $result['respuesta_seguridad']){
            echo "noPregunta";
            exit();
        }

        $result = DB::updatePassword($result['id'],$password);
        echo $result;

    }catch(Exception $e){
        echo $e->getMessage();
        die();
    }

?>