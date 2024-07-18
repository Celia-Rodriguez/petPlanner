<?php

    session_start();

    include('include/DB.php');
    
    $usuario = $_SESSION['user'];

    $petGender = "";
    $petChip = "";

    $petId = $_POST['pet_id'];
    $petName = $_POST['pet_name'];
    $petCode = $_POST['pet_code'];
    $petDate  = $_POST['pet_date'];
    $petType = $_POST['pet_type'];
    $petBreed = $_POST['pet_breed'];
    $petWeight = $_POST['pet_weight'];
    if(isset($_POST['pet_gender']) && $_POST['pet_gender'] !== ""){
        $petGender = $_POST['pet_gender'];
    }
    
    if(isset($_POST['pet_chip']) && $_POST['pet_chip'] !== ""){
        $petChip = $_POST['pet_chip'];
    }
    $petImg = $_FILES['pet_img'];
    $petImgBase64 = "";
    if($petImg['name'] != null || $petImg['name'] != ""){
        $petImgBase64 = convertirImgBase64($petImg);
    }

    try{
        if($petImg['name'] == null || $petImg['name'] == ""){
            $result = DB::updatePetSinFoto($petId,$petName,$petDate,$petType,$petBreed,$petWeight,$petGender,$petChip,$petImgBase64);
        }else{
            $result = DB::updatePet($petId,$petName,$petDate,$petType,$petBreed,$petWeight,$petGender,$petChip,$petImgBase64);
        }
        
        if($result == false){
            echo "false";
            exit();
        }
        $mascotas = $usuario['mascotas'];
        for($i=0;$i<count($mascotas);$i++){
            if ($mascotas[$i]['id'] == $petId) {
                $mascotas[$i]['nombre'] = $petName;
                $mascotas[$i]['tipo'] = $petType;
                $mascotas[$i]['raza'] = $petBreed;
                $mascotas[$i]['fecha_nacimiento'] = $petDate;
                $mascotas[$i]['peso'] = $petWeight;
                $mascotas[$i]['genero'] = $petGender;
                $mascotas[$i]['chip'] = $petChip;
                if($petImg['name'] != null || $petImg['name'] != ""){
                    $mascotas[$i]['foto'] = $petImgBase64;
                }
                break;
            }
        }
        
        $usuario['mascotas'] = $mascotas;
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