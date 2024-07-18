<?php

 include('../include/DB_calendar.php');
 try{
    $id = $_POST['id_reminder_edit_reminder'];//recoge el id de la mascota 

    $result= DB::deleteReminder($id);

    echo 'Se ha eliminado correctamente';
    
 }catch(Exception $e){
    echo $e->getMessage();
    die();
 }

?>