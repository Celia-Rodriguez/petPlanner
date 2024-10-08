<?php
    include('include/DB.php');

    $email = $_POST['email'];
    $password  = $_POST['password'];

    try{
        $result = DB::checkUser($email,$password); //comprobamos email y contraseña
        
        //si es correcto, obtenemos los datos del usuario y los guardamos en una variable de sesión.
        if($result){
            $userInfo = DB::getUser($email);
            $userData = $userInfo->fetch();
            if($userData){
                $usuario = [];
                //Datos del usuario
                $usuario['id'] = $userData['id'];
                $usuario['nombre'] = $userData['nombre'];
                $usuario['email'] = $userData['email'];
                $usuario['foto'] = $userData['foto'];
                $usuario['tipo'] = $userData['tipo'];
                //obtenemos las mascotas
                $petIds = DB::getPets($usuario['id']); 
                $userPets = [];
                for($i=0;$i<count($petIds);$i++){
                    $petData = DB::getPet($petIds[$i]);
                    $datosMascota = [];
                    $datosMascota['id'] = $petData['id'];
                    $datosMascota['nombre'] = $petData['nombre'];
                    $datosMascota['tipo'] = $petData['tipo'];
                    $datosMascota['raza'] = $petData['raza'];
                    $datosMascota['fecha_nacimiento'] = $petData['fecha_nacimiento'];
                    $datosMascota['peso'] = $petData['peso'];
                    $datosMascota['genero'] = $petData['genero'];
                    $datosMascota['chip'] = $petData['chip'];
                    $datosMascota['foto'] = $petData['foto'];
                    $datosMascota['codigo'] = $petData['codigo'];
                    $userPets[$i] = $datosMascota;   
                }
                //Añadimos las mascotas al usuario
                $usuario['mascotas'] = $userPets;
                //Guardamos en sesión
                $_SESSION['user'] = $usuario;
            }
        }
        echo $result;
    }catch(Exception $e){
        echo $e->getMessage();
        die();
    }

?>