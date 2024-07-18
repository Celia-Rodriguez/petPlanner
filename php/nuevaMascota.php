<?php

    session_start();

    include('include/DB.php');

    //Variables del formulario
    $petGender = $petChip = "";

    $petName = $_POST['pet_name']; 
    $petDate = $_POST['pet_date'];
    $petType = $_POST['pet_type'];
    $petBreed = $_POST['pet_breed'];
    $petWeight = $_POST['pet_weight'];
    if($_POST['pet_gender'] !== ""){
        $petGender = $_POST['pet_gender'];
    }
    if($_POST['pet_chip'] !== ""){
        $petChip = $_POST['pet_chip'];
    }
    $petImg = $_FILES['pet_img'];
    
    if($petImg['name'] != null || $petImg['name'] != ""){
        $petImgBase64 = convertirImgBase64($petImg);
    }else{
        $petImgBase64 = "";
    }

    var_dump($petImgBase64);



    $petCode = generarCodigoAleatorio();
    $id_user = $_SESSION['user']['id'];

   try{
        $result = DB::insertPet($id_user,$petName,$petDate,$petType,$petBreed,$petWeight,$petGender,$petChip,$petCode,$petImgBase64);
        if($result == false){
            echo "false";
            exit();
        }

        //Añadimos los datos de la nueva mascota a la sesión
        $datosMascota = [];
        $datosMascota['id'] = $result;
        $datosMascota['nombre'] = $petName;
        $datosMascota['tipo'] = $petType;
        $datosMascota['raza'] = $petBreed;
        $datosMascota['fecha_nacimiento'] = $petDate;
        $datosMascota['peso'] = $petWeight;
        $datosMascota['genero'] = $petGender;
        $datosMascota['chip'] = $petChip;
        $datosMascota['foto'] = $petImgBase64;
        $datosMascota['codigo'] = $petCode;
        array_push($_SESSION['user']['mascotas'],$datosMascota);

        echo "true";
    }catch(Exception $e){
        echo $e->getMessage();
        die();
    }

    function generarCodigoAleatorio(){
        $caracteres = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $codigo = "";
        for($i=0;$i<6;$i++){
            $codigo .= $caracteres[rand(0,strlen($caracteres)-1)];
        }

        $codigosUtilizados = codigosUtilizados();
        if(in_array($codigo,$codigosUtilizados)){
            generarCodigoAleatorio();
        }else{
            return $codigo;
        } 
    }

    //obtener los códigos de las mascotas de la tabla para evitar su repetición
    function codigosUtilizados(){
        $codigos = DB::getCodigos();
        return $codigos;
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