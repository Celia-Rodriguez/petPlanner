<?php

    session_start();

    include('include/DB.php');

    try{
        $user = "";

        if(!isset($_SESSION['user']) || empty($_SESSION['user']) || $_SESSION['user'] ==null){
            echo false;
            exit();
        }

        $user = $_SESSION['user'];
  
        echo json_encode($user);
    
    }catch(Exception $e){
        echo $e->getMessage();
        die();
    }

?>