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

    $id =$user['id'];
    
    $remindersAll = DB::showAllReminders($id);
    
    echo json_encode ($remindersAll);
    
}catch(Exception $e){
    echo $e->getMessage();
    die();
}


?>