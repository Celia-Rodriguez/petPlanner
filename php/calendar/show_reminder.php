<?php

 include('../include/DB_calendar.php');
 try{
    //esto selo paso a la base de datos para sacar los recordatorios
    $idPet=$_POST['id_pet'];
    //DB me devuelve un array de objeto, lo guardo en una variable
    $reminder=DB::showReminder($idPet);

    echo json_encode($reminder);
 }catch(Exception $e){
    echo $e->getMessage();
    die();
 }
?>