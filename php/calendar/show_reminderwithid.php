<?php

 include('../include/DB_calendar.php');
 try{
    //esto selo paso a la base de datos para sacar los recordatorios
    $id=$_POST['id'];

    //DB me devuelve un objeto, lo guardo en una variable
    $reminder=DB::dataReminder($id);
    
    echo json_encode($reminder);

}catch(Exception $e){
    echo $e->getMessage();
    die();
 }
?>