<?php

    session_start();

    include('../include/DB.php');
    
    $usuario = $_SESSION['user'];
    $userId = $usuario['id'];

    $userName = $_POST['user_name'];
    $userEmail = $_REQUEST['user_email'];
    $userImg = $_FILES['user_img'];
    $userImgBase64 = "";
    if($userImg['name'] != null || $userImg['name'] != ""){
        $userImgBase64 = convertirImgBase64($userImg);
    }

    try{
        if($userImg['name'] == null || $userImg['name'] == ""){
            $result = DB::updateUserSinFoto($userId,$userName);
        }else{
            $result = DB::updateUser($userId,$userName,$userImgBase64);
        }

        if($result == false){
            echo "false";
            exit();
        }

        $usuario['nombre'] = $userName;
        if($userImg['name'] != null || $userImg['name'] != ""){
            $usuario['foto'] = $userImgBase64;
        }
        
        $_SESSION['user'] = $usuario;

        $resultado = [];
        $resultado['result'] = true;
        $resultado['data'] = $usuario;
        $resultado['result'] = true;
        echo json_encode($resultado);
    }catch(Exception $e){
        echo $e->getMessage();
        die();
    }

    function convertirImgBase64($petImg){
        if($petImg != ""){
            $archivo_tmp = $petImg['tmp_name'];
            $nombre_archivo = $petImg['name'];
            $contenidoFile = file_get_contents($archivo_tmp); //leemos el contenido del archivo
            $imgBase64 = base64_encode($contenidoFile);
            return $imgBase64;
        }
    }

?>