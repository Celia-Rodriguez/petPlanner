<?php

 include('../include/DB_calendar.php');

 try{    

    $idReminder= $_POST['id_reminder_edit_reminder']; //id del recordatorio
    $idPet= $_POST['pet_edit_reminder'];//recoge el id de la mascota
    $plannedDate= $_POST['date_planned_edit_reminder'];//recoge la fecha esperada
    $doneDate= $_POST['date_donne_edit_reminder'];//recoge la fecha realizada
    $details = $_POST['details_edit_reminder'];// recoge los detalles
    $color= $_POST['color_pet_edit_reminder'];//recoge el color del recordatorio
    $timePeriod=$_POST['time_period_edit_reminder'];//recoge el periodo de tiempo
    $typeReminder= $_POST['type_name_edit_reminder'];//recoge el id del tipo de recordatorio


    $result= DB::editReminder($idReminder, $idPet, $plannedDate, $doneDate, $details, $color, $timePeriod, $typeReminder);

    echo $result;

 }catch(Exception $e){
    echo $e->getMessage();
    die();
 }

?>