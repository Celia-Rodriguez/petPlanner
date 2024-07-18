<?php

    session_start();

    include('include/DB.php');

    $petCode = $_POST['pet_code'];

    $idUser = $_SESSION['user']['id'];

    try{
        $codigos = DB::getCodigos();
        $existeMascota = false;
        for($i=0;$i<count($codigos);$i++){
            if($codigos[$i]['codigo'] == $petCode){
                $existeMascota = true;
                break;
            }
        }
        if($existeMascota == false){
            echo "noCodigo";
        }else{
            $mascota = DB::getPetByCode($petCode);
            $userPet = DB::getUserPet($idUser,$mascota['id']);
            if($userPet == true){
                echo "yaMascota";
            }else{
                $link = DB::linkUserPet($idUser,$mascota['id']);
                $datosMascota = [];
                $datosMascota['id'] = $mascota['id'];
                $datosMascota['nombre'] = $mascota['nombre'];
                $datosMascota['tipo'] = $mascota['tipo'];
                $datosMascota['raza'] = $mascota['raza'];
                $datosMascota['fecha_nacimiento'] = $mascota['fecha_nacimiento'];
                $datosMascota['peso'] = $mascota['peso'];
                $datosMascota['genero'] = $mascota['genero'];
                $datosMascota['chip'] = $mascota['chip'];
                $datosMascota['foto'] = $mascota['foto'];
                $datosMascota['codigo'] = $mascota['codigo'];
                array_push($_SESSION['user']['mascotas'],$datosMascota);

                
                echo "true";
            }
        }
    }catch(Exception $e){
        echo $e->getMessage();
        die();
    }