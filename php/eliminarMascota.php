<?php

    session_start();

    include('include/DB.php');
    
    $usuario = $_SESSION['user'];

    $petId = "";
    if(isset($_POST['id'])){
        $petId = $_POST['id'];
    }

    //primero buscamos a ver cuantos usuarios tienen asociada esta mascota
    try{
        $usuarios = DB::numeroUsuariosMascota($petId);
        $userId = $usuario['id'];
        $resultado[] = "";
        //eliminamos la asociación usuario-mascota
        $eliminarAsociacion = DB::eliminarAsociacionUserPet($userId,$petId);

        if(!$eliminarAsociacion){
            $resultado['result'] = $eliminarAsociacion;
            echo json_encode($resultado);
            exit();
        }

        //Actualizamos la variable de sesión
        $mascotas = $usuario['mascotas'];
        for($i=0;$i<count($mascotas);$i++){
            if ($mascotas[$i]['id'] == $petId) {
                unset($mascotas[$i]);
                break;
            }
        }
        //unset elimina el elemento, pero deja su posición vacía, es decir, si está en la posición 1, después quedaría: 0,2,3... Para evitar esto, reindexamos el array mascotas
        $mascotas = array_values($mascotas);
        $usuario['mascotas'] = $mascotas; //sustituimos mascotas
        $_SESSION['user'] = $usuario; //sustituimos sesion usuario

        $resultado['result'] = true;
        $resultado['data'] = $usuario;

        //si la mascota solo estaba asociada a un usuario, eliminamos también la mascota de la tabla mascotas
        if($usuarios<=1){
            $recordatorios = DB::numeroRecordatoriosMascota($petId);

            //Para eliminar de forma definitiva una mascota, hay que eliminar los recordatorios asociados primero
            if($recordatorios>0){
                $eliminarRecordatorios = DB::eliminarRecordatoriosMascota($petId);
                if(!$eliminarRecordatorios){
                    $resultado['result'] = "noRecordatorios";
                    echo json_encode($resultado);
                    exit();
                }
                $eliminarMascota = DB::eliminarMascota($petId);
                $resultado['result']=$eliminarMascota;
                echo json_encode($resultado);
                exit();
            }
        }
        echo json_encode($resultado);

    }catch(Exception $e){
        echo $e->getMessage();
        die();
    }


    ?>