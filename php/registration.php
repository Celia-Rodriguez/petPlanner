<?php
    include('include/DB.php');
    include('include/User.php');

    $userName = $_POST['user_name'];
    $email = $_POST['email'];
    $password  = $_POST['password'];
    $question = $_POST['security_question'];
    $answer = $_POST['security_answer'];

    try{
        $result1 = DB::issetEmail($email);
        if($result1){ //el usuario no existe en la base de datos
            $result2 = DB::insertUser($userName,$email,$password,$question,$answer);
            echo $result2;
        }else{        
            echo "userExists"; 
        }
    }catch(Exception $e){
        echo $e->getMessage();
        die();
    }

?>