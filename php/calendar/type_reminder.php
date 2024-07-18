<?php
 include('../include/DB_calendar.php');
 try{
    $types=DB::typeReminder();

    echo json_encode ($types);
 }catch(Exception $e){
    echo $e->getMessage();
    die();
 }
?>