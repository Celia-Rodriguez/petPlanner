<?php
class DB{

    //Ejecutar consulta sql
    protected static function executeQuery($sql, $params = []){
        $opc = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
        $host = 'aws-0-eu-west-3.pooler.supabase.com'; // Cambia esto si es necesario
        $port = '6543'; // Puerto por defecto de PostgreSQL
        $dbname = 'postgres'; // El nombre de tu base de datos
        $user = 'postgres.zfbdzsckvnxknahipvnh'; // El nombre de usuario (generalmente "postgres")
        $password = 'PetPlanner_proyect'; // Tu contraseña o la clave anónima
        
        try {
            // Crear una conexión PDO
            $dsn = "pgsql:host=$host;port=$port;dbname=$dbname;user=$user;password=$password";
            $dbPetPlanner = new PDO($dsn);
            $dbPetPlanner->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            //al preaprar la query se protege contra inyecciones SQL
            $stmt = $dbPetPlanner->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        }catch(PDOException $e){
            $date_time = date('d-m-Y H:i:s');
            error_log($date_time . '-- PDO Exception: ' . $e->getMessage() . PHP_EOL , 3 , __DIR__ . '/Log/error.log');
            exit();
        }
    }//fin ejecutaConsulta($sql)


/*-----------------------------------------------------------------------------*/
/*--- LOGIN -------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/

        //comprobar usuario
        public static function issetEmail($email){
            $sql = "SELECT email FROM \"user\" WHERE email= :email;";
            $params= [':email' => $email];

            $result = self::executeQuery($sql, $params);
            if(isset($result)){
                $row = $result -> fetch();
                if($row == false){
                    return true; //no se ha encontrado email
                }else{
                    return false; //se ha encontrado email
                }
            }
        }

        //Comprobar usuario y contraseña
        public static function checkUser($email, $password){
            if(empty($email)){return "nop";}
            $sql = "SELECT email, password FROM \"user\"  WHERE email= :email;";
            $params = [':email' => $email];

            $result = self::executeQuery($sql, $params);
            if ($result !== false) {
                $row = $result->fetch();
                if ($row) {
                    $hashPassword = $row['password'];
                    if (password_verify($password, $hashPassword)) {
                        return true; // Devuelve true si la contraseña coincide
                    } else {
                        return "noPassword"; // Contraseña incorrecta
                    }
                } else {
                    return false; // No se encontró el usuario
                }
            } else {
                return "Error en la consulta"; // Error en la ejecución de la consulta
            }
        }

        //Obtener los datos del usuario
        static public function getUser($userEmail){
            $sql = "SELECT * FROM \"user\"  WHERE email = '$userEmail'"; 
            $params = [':userEmail' => $userEmail];

            $result = self::executeQuery($sql);
            return $result;
        }


/*-----------------------------------------------------------------------------*/
/*--- REGISTRO USUARIO --------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/

        //insertar registro Usuario
        static public function insertUser($userName,$email,$password,$question,$answer){
            $password = password_hash($password,PASSWORD_DEFAULT);
            $sql = "INSERT INTO \"user\"  (nombre, email, password, pregunta_seguridad, respuesta_seguridad, tipo) 
            VALUES (:userName, :email, :password, :question, :answer,'user');";
            $params= [
                ':userName' => $userName,
                ':email' => $email,
                ':password' => $password,
                ':question' => $question,
                ':answer' => $answer
            ];

            $result = self::executeQuery($sql, $params);
            if($result){
                return true;
            }else{
                return false;
            }
        }

/*-----------------------------------------------------------------------------*/
/*--- RECUPERAR CONTRASEÑA ----------------------------------------------------*/
/*-----------------------------------------------------------------------------*/
        //comprobar datos
        public static function getDataUser($email){
            $sql = "SELECT id, email, pregunta_seguridad, respuesta_seguridad FROM \"user\"  WHERE email= :email;";
            $params = [':email' => $email];

            $result = self::executeQuery($sql, $params);
            if(isset($result)){
                $row = $result -> fetch();
                return $row;
            }else{
                return false;
            }
        }

        //cambiar contraseña
        public static function updatePassword($id, $password){
            try{
                $password = password_hash($password,PASSWORD_DEFAULT);
                $sql = "UPDATE \"user\"  SET password = :password WHERE id = :id;";
                $params = [
                    ':id' => $id,
                    ':password' => $password
                ];
        
                $result = self::executeQuery($sql, $params);
                if($result){
                    return true;
                }else{
                    return false;
                }
            }catch(Exception $e){
                echo $e->getMessage();
                die();
            }
        }

/*-----------------------------------------------------------------------------*/
/*--- EDITAR USUARIO  ---------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/

        public static function updateUser($id,$name,$img){
            try{
                $sql = "UPDATE \"user\"  SET nombre= :name, foto = :img WHERE id = :id;";
                $params= [
                    ':name' => $name,
                    ':img' => $img,
                    ':id' => $id
                ];

                $result = self::executeQuery($sql, $params);
                if($result){
                    return true;
                }else{
                    return false;
                }
            }catch(Exception $e){
                echo $e->getMessage();
                die();
            }
        }

        public static function updateUserSinFoto($id, $name){ 
            try{
                $sql = "UPDATE \"user\"  SET nombre= :name WHERE id= :id;";
                $params=[
                    ':name' => $name,
                    ':id' => $id
                ];

                $result = self::executeQuery($sql, $params);
                if($result){
                    return true;
                }else{
                    return false;
                }
            }catch(Exception $e){
                echo $e->getMessage();
                die();
            }
        }

        //Comprobar usuario y contraseña
        public static function checkUserPassword($idUser, $password){
            try{
                $sql = "SELECT password FROM \"user\"  WHERE id= :idUser;";
                $params=[
                    ':idUser' => $idUser
                ];

                $result = self::executeQuery($sql, $params);
                if ($result !== false) {
                    $row = $result->fetch();
                    if ($row) {
                        $hashPassword = $row['password'];
                        if (password_verify($password, $hashPassword)) {
                            return true; // Devuelve true si la contraseña coincide
                        } else {
                            return false; // Contraseña incorrecta
                        }
                    } else {
                        return false; // No se encontró el usuario
                    }
                } else {
                    return false; // Error en la ejecución de la consulta
                }    
            }catch(Exception $e){
                echo $e->getMessage();
                die();
            }
            
        }

        public static function updateEmailUser($userId,$userEmail){
            try{
                $sql = "UPDATE \"user\"  SET email= :userEmail WHERE id = :userId;";
                $params=[
                    ':userEmail' => $userEmail,
                    ':userId' => $userId
                ];

                $result = self::executeQuery($sql, $params);
                if($result){
                    return true;
                }else{
                    return false;
                }
            }catch(Exception $e){
                echo $e->getMessage();
                die();
            }
        }
        
/*-----------------------------------------------------------------------------*/
/*--- ELIMINAR USUARIO  -------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/
        //Ver si el usuario tiene mascotas asociadas
        static public function numeroMascotasUsuario($userId){
            try{
                $sql = "SELECT COUNT(*) FROM \"user_pet\" WHERE id_user= :userId";
                $params=[':userId' => $userId];

                $result = self::executeQuery($sql, $params);
                $users = $result->fetch();
                return $users['COUNT(*)'];
            }catch(Exception $e){
                echo $e->getMessage();
                die();
            }
        }

        static public function eliminarUsuario($userId){
            try{
                $sql = "DELETE FROM \"user\" WHERE id= :userId";
                $params=[':userId' => $userId];

                $result = self::executeQuery($sql, $params);
                if ($result->rowCount() > 0) {
                    // Al menos una fila eliminada
                    return true;
                } else {
                    // Ninguna fila eliminada
                    return false;
                }
            }catch(Exception $e){
                echo $e->getMessage();
                die();
            }
        }


/*-----------------------------------------------------------------------------*/
/*--- REGISTRO MASCOTA --------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/

        //Obtener listado de códigos de las mascotas
        static public function getCodigos(){
            $sql = "SELECT codigo FROM \"pet\"";
            $result = self::executeQuery($sql);
            $codigos = [];
            while ($row = $result->fetch()) {
                $codigos[] = $row;
            }
            return $codigos;
        }

        //Insertar datos de mascota
        static public function insertPet($id_user,$petName,$petDate,$petType,$petBreed,$petWeight,$petGender,$petChip,$petCode,$petImg){
            try{
                $sql = "SELECT addNuevaMascota('$id_user','$petName','$petDate','$petType','$petBreed','$petWeight','$petGender','$petChip','$petCode','$petImg')";
                $result = self::executeQuery($sql);
                $returnValue = $result->fetch();
                return $returnValue[0];
            }catch(Exception $e){
                echo $e->getMessage();
                die();
            }
            
        }

        //asociar mascota a usuario
        static public function linkUserPet($idUser,$idPet){
            $sql = "INSERT INTO \"user_pet\" (id_user,id_pet) VALUES (:idUser, :idPet);";
            $params=[
                ':idUser' => $idUser,
                ':idPet' => $idPet
            ];

            $result = self::executeQuery($sql, $params);
            if($result){
                return true;
            }else{
                return false;
            }
        }


/*-----------------------------------------------------------------------------*/
/*--- OBTENER DATOS MASCOTA ---------------------------------------------------*/
/*-----------------------------------------------------------------------------*/

        //Obtener mascotas de usuario por su id
        static public function getPets($idUser){
            $sql = "SELECT id_pet FROM \"user_pet\" WHERE id_user = :idUser;";
            $params=[':idUser' => $idUser];

            $result = self::executeQuery($sql, $params);
            $petIds = [];
            while ($row = $result->fetch()) {
                $petIds[] = $row['id_pet'];
            }
            return $petIds;
        }

        //Obtener datos de mascota a partir de su id
        static public function getPet($idPet){
            $sql = "SELECT * FROM \"pet\" WHERE id = :idPet;";
            $params=[':idPet' => $idPet];

            $result = self::executeQuery($sql, $params);
            $pet = $result->fetch();
            return $pet;
        }

        //Obtener datos de mascota a partir de su código
        static public function getPetByCode($petCode){
            $sql = "SELECT * FROM \"pet\" WHERE codigo = :petCode;";
            $params=[':petCode' => $petCode];

            $result = self::executeQuery($sql, $params);
            $pet = $result->fetch();
            return $pet;
        }

        //obtener registro de mascota con usuario
        static public function getUserPet($idUser, $idPet){
            $sql = "SELECT * FROM \"user_pet\" WHERE id_user = :idUser AND id_pet = :idPet;";
            $params =[
                ':idUser' => $idUser,
                ':idPet' => $idPet
            ];

            $result = self::executeQuery($sql, $params);
            $pet = $result->fetch();
            return $pet;
        }

/*-----------------------------------------------------------------------------*/
/*--- ACTUALIZAR MASCOTA ------------------------------------------------------*/
/*-----------------------------------------------------------------------------*/
    static public function updatePet($petId,$petName,$petDate,$petType,$petBreed,$petWeight,$petGender,$petChip,$petImg){
        try{
            $sql = "UPDATE \"pet\" SET nombre= :petName, fecha_nacimiento = :petDate, tipo= :petType, raza= :petBreed, peso= :petWeight,
             genero= :petGender, chip= :petChip, foto= :petImg WHERE id= :petId;";
            $params=[
                ':petName' => $petName,
                ':petDate' => $petDate,
                ':petType' => $petType,
                ':petBreed' => $petBreed,
                ':petWeight' => $petWeight,
                ':petGender' => $petGender,
                ':petChip' => $petChip,
                ':petImg' => $petImg,
                ':petId' => $petId
            ];

            $result = self::executeQuery($sql, $params);
            if($result){
                return true;
            }else{
                return false;
            }
        }catch(Exception $e){
            echo $e->getMessage();
            die();
        }
    }

    static public function updatePetSinFoto($petId,$petName,$petDate,$petType,$petBreed,$petWeight,$petGender,$petChip){
        try{
            $sql = "UPDATE \"pet\" SET nombre= :petName, fecha_nacimiento= :petDate, tipo= :petType, raza= :petBreed,
             peso= :petWeight, genero= :petGender, chip= :petChip WHERE id= :petId;";
            $params=[
                ':petName' => $petName,
                ':petDate' => $petDate,
                ':petType' => $petType,
                ':petBreed' => $petBreed,
                ':petWeight' => $petWeight,
                ':petGender' => $petGender,
                ':petChip' => $petChip,
                ':petId' => $petId
            ];
            $result = self::executeQuery($sql, $params);
            if($result){
                return true;
            }else{
                return false;
            }
        }catch(Exception $e){
            echo $e->getMessage();
            die();
        }
    }

    /*-----------------------------------------------------------------------------*/
    /*--- ELIMINAR MASCOTA --------------------------------------------------------*/
    /*-----------------------------------------------------------------------------*/
    //obtener cuantos usuarios tienen esta mascota
    static public function numeroUsuariosMascota($petId){
        try{
            $sql = "SELECT COUNT(*) FROM \"user_pet\" WHERE id_pet= :petId;";
            $params=[':petId' => $petId];

            $result = self::executeQuery($sql, $params);
            $users = $result->fetch();
            return $users['COUNT(*)'];
        }catch(Exception $e){
            echo $e->getMessage();
            die();
        }
    }

    //eliminar registro
    static public function eliminarAsociacionUserPet($userId, $petId){
        try{
            $sql = "DELETE FROM \"user_pet\" WHERE id_pet= :petId AND id_user= :userId;";
            $params=[
                ':petId' => $petId,
                ':userId' => $userId
            ];

            $result = self::executeQuery($sql, $params);
            if ($result->rowCount() > 0) {
                // Al menos una fila eliminada
                return true;
            } else {
                // Ninguna fila eliminada
                return false;
            }
        }catch(Exception $e){
            echo $e->getMessage();
            die();
        }
    }

    //obtener cuantos recordatorios tienen esta mascota
    static public function numeroRecordatoriosMascota($petId){
        try{
            $sql = "SELECT COUNT(*) FROM \"pet_reminder\" WHERE id_pet= :petId;";
            $params=[':petId' => $petId];

            $result = self::executeQuery($sql, $params);
            $reminders = $result->fetch();
            return $reminders['COUNT(*)'];
        }catch(Exception $e){
            echo $e->getMessage();
            die();
        }
    }

    //eliminar recordatorios mascota
    static public function eliminarRecordatoriosMascota($petId){
        try{
            $sql = "DELETE FROM \"pet_reminder\" WHERE id_pet= :petId;";
            $params=[':petId' => $petId];

            $result = self::executeQuery($sql, $params);    
            if ($result->rowCount() > 0) {
                // Al menos una fila eliminada
                return true;
            } else {
                // Ninguna fila eliminada
                return false;
            }
        }catch(Exception $e){
            echo $e->getMessage();
            die();
        }
    }

    //eliminar mascota
    static public function eliminarMascota($petId){
        try{
            $sql = "DELETE FROM \"pet\" WHERE id= :petId;";
            $params=[':petId' => $petId];

            $result = self::executeQuery($sql, $params);
            if ($result->rowCount() > 0) {
                // Al menos una fila eliminada
                return true;
            } else {
                // Ninguna fila eliminada
                return false;
            }
        }catch(Exception $e){
            echo $e->getMessage();
            die();
        }
    }

    
    /*-----------------------------------------------------------------------------*/
    /*--- ADMINISTRAR USUARIOS ----------------------------------------------------*/
    /*-----------------------------------------------------------------------------*/

    static public function getAllUsers(){
        try{
            $sql = "SELECT id,nombre,email,tipo FROM \"user\";";
            $result = self::executeQuery($sql);
            $users = $result->fetchAll();
            return $users;
        }catch(Exception $e){
            echo $e->getMessage();
            die();
        }
    }

    static public function changeTypeUser($id, $tipo){
        try{
            $sql = "UPDATE \"user\" SET tipo= :tipo WHERE id= :id;"; 
            $params=[
                ':tipo' => $tipo,
                ':id' => $id
            ];

            $result = self::executeQuery($sql, $params);
            if($result){
                return true;
            }else{
                return false;
            }
        }catch(Exception $e){
            echo $e->getMessage();
            die();
        }
    }

    }//fin class DB

?>