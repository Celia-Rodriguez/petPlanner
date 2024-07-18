<?php
 include('../include/DB_calendar.php');
 try{
    $type =$_POST['tipo'];

    $name_types=DB::nameTypeReminder($type);

    echo json_encode ($name_types);
    
 }catch(Exception $e){
    echo $e->getMessage();
    die();
 }   
?>