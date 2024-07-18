<?php
 session_start();
 include('../include/DB_calendar.php');
 try{
    $user = "";

    if(!isset($_SESSION['user']) || empty($_SESSION['user'])){
        echo false;
    }

    $user = $_SESSION['user'];

    $user_json= json_encode($user);

    $email =$user['email'];

    
     $pets = DB::petUser($email);
    
     echo json_encode ($pets);
    
 }catch(Exception $e){
    echo $e->getMessage();
    die();
 }

?>