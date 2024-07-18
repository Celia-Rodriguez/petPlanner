<?php

    session_start();

    include('../include/DB.php');
    include('../include/User.php');
    try{
        $result = DB::getAllUsers();

        $users = [];
        foreach ($result as $row) {
            $user = new User(
                $row['id'],
                $row['nombre'],
                $row['email'],
                $row['tipo']
            );
            $users[] = $user->toArrayUserAdmin();
        }

        echo json_encode($users);
        
    }catch(Exception $e){
        echo $e->getMessage();
        die();
     }

?>