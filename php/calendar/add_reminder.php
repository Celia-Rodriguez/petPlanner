<?php

 include('../include/DB_calendar.php');
 try{
    $petName= $_POST['pet_add_reminder'];//recoge el id de la mascota
    $plannedDate= $_POST['date_add_reminder'];//recoge la fecha esperada
    $details = $_POST['details_add_reminder'];// recoge los detalles
    $color= $_POST['color_pet_reminder'];//recoge el color del recordatorio
    $typeReminder= $_POST['name_type_add_reminder'];//recoge el id del tipo de recordatorio

    $result= DB::addReminder($petName,$plannedDate, $details, $color, $typeReminder);

    echo 'Se ha añadido correctamente';

 }catch(Exception $e){
    echo $e->getMessage();
    die();
 }

?>