<?php

    session_start();

    include('../include/DB.php');
    include('../include/User.php');

    try{
        $id = $_POST["id"];
        $tipo = $_POST["tipo"];

        $result = DB::changeTypeUser($id,$tipo);

        echo $result;

    }catch(Exception $e){
        echo $e->getMessage();
        die();
     }
?>