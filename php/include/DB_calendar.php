<?php
require_once('Reminder.php');
require_once('Pet.php');

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
            header('Location: /Log/errores/err_2002.html');
            exit();
        }

    }//fin ejecutaConsulta($sql)

/** Sacar datos de la mascota según el usuario */
    public static function petUser($email){
        $sql="SELECT pet.nombre, pet.id FROM \"user\" 
        JOIN \"user_pet\" ON \"user\".id= \"user_pet\".id_user 
        JOIN \"pet\" ON \"user_pet\".id_pet = \"pet\".id 
        WHERE \"user\".email= :email ORDER BY pet.id ";
        $params = [':email' => $email];

        $result = self::executeQuery($sql, $params);
        $pets= array();
        if($result) {
            // Saca TODOS los recordatorios de la mascota
            $row = $result->fetch();
            while ($row != null) {
                $pet_Object = new Pet($row);
                array_push($pets,[$pet_Object->getIdPet(), $pet_Object->getNamePet()]);
                $row = $result->fetch();
            }
        }
        return $pets;
    }

/****** Sacar Tipo de recordatorio ******/
    public static function typeReminder(){
        $sql="SELECT DISTINCT tipo FROM \"type_of_reminder\" ORDER BY tipo;";

        $result = self::executeQuery($sql);
        $types= array();
        if($result) {
            // Saca TODOS los recordatorios de la mascota
            $row = $result->fetch();
            while ($row != null) {
                array_push($types, $row['tipo']);
                $row = $result->fetch();
            }
        }
        return $types;
    }
/****** Sacar Nombre del Tipo de recordatorio ******/
    public static function nameTypeReminder($type){
        $sql="SELECT DISTINCT id, nombre_tipo FROM \"type_of_reminder\" 
        WHERE tipo = :type ORDER BY nombre_tipo;";
        $params = [':type' => $type];

        $result = self::executeQuery($sql, $params);
        $types= array();
        if($result) {
            // Saca TODOS los recordatorios de la mascota
            $row = $result->fetch();
            while ($row != null) {
                array_push($types, [$row['id'], $row['nombre_tipo']]);
                $row = $result->fetch();
            }
        }
        return $types;
    }

/****** Guardar Recordatorio ******/
    public static function addReminder($petName, $plannedDate, $details, $color, $typeReminder){
        $sql="INSERT INTO \"pet_reminder\"(id_pet, detalles, color_reminder, fecha_prevista, id_tipo) 
        VALUES (:petName, :details, :color, :plannedDate, :typeReminder);";
        $params=[
            ':petName' => $petName,
            ':details' => $details,
            ':color' => $color,
            ':plannedDate' => $plannedDate,
            ':typeReminder' => $typeReminder
        ];
        $result = self::executeQuery($sql, $params);
        if($result){
            return 'Recordatorio añadido corectamente';
        }else{
                return "Algo fue mal";
        }   
    }

    /****** Mostrar Recordatorio ******/
    public static function showReminder($idPet){
        $sql= "SELECT pet_reminder.*, type_of_reminder.tipo, type_of_reminder.nombre_tipo FROM \"pet_reminder\" 
        INNER JOIN \"type_of_reminder\" ON \"pet_reminder\".id_tipo = \"type_of_reminder\".id WHERE \"pet_reminder\".id_pet = :idPet;";
        $params=[':idPet' => $idPet];

        $result = self::executeQuery($sql, $params);
        $reminders= array();
        if($result) {
            // Saca TODOS los recordatorios de la mascota
            $row = $result->fetch();
            while ($row != null) {
                $reminder_Object=new Reminder($row);
                array_push($reminders, [
                    $reminder_Object->getIdPReminder(),
                    $reminder_Object->getIdPet(),
                    $reminder_Object->getDetails(),
                    $reminder_Object->getColor(),
                    $reminder_Object->getPlannedDate(),
                    $reminder_Object->getDoneDate(),
                    $reminder_Object->getTimePeriod(),
                    $reminder_Object->getIdTypeReminder(),
                    $reminder_Object->getTypeReminder()
                ]);
                $row = $result->fetch();
            }
        }
        //devuelve una array de objetos reminder
        return $reminders;
    }
/****** Mostrar TODOS los Recordatorios ******/
    public static function showAllReminders($id){
        $sql="SELECT pet_reminder.*, type_of_reminder.tipo, type_of_reminder.nombre_tipo 
            FROM \"user_pet\" 
            INNER JOIN \"pet_reminder\" ON \"user_pet\".id_pet = \"pet_reminder\".id_pet 
            INNER JOIN \"type_of_reminder\" ON \"pet_reminder\".id_tipo = \"type_of_reminder\".id 
            WHERE \"user_pet\".id_user = :id;";
        $params= [':id' => $id];

        $result = self::executeQuery($sql, $params);
        $reminders= array();
        if($result) {
            // Saca TODOS los recordatorios de la mascota
            $row = $result->fetch();
            while ($row != null) {
                $reminder_Object=new Reminder($row);
                array_push($reminders, [$reminder_Object->getIdPReminder(),
                $reminder_Object->getIdPet(),
                $reminder_Object->getDetails(),
                $reminder_Object->getColor(),
                $reminder_Object->getPlannedDate(),
                $reminder_Object->getDoneDate(),
                $reminder_Object->getTimePeriod(),
                $reminder_Object->getIdTypeReminder(),
                $reminder_Object->getTypeReminder()]);
                $row = $result->fetch();
            }
        }
        //devuelve una array de objetos reminder
        return $reminders;
    }// sacar todos los recordatorios del ususario

//sacar los datos de un recordatorio
    public static function dataReminder($id){
        $sql= "SELECT pet_reminder.*,pet.nombre, type_of_reminder.tipo, type_of_reminder.nombre_tipo FROM \"pet\" 
        INNER JOIN \"pet_reminder\"  ON \"pet\".id = \"pet_reminder\".id_pet 
        INNER JOIN \"type_of_reminder\" ON \"pet_reminder\".id_tipo = \"type_of_reminder\".id 
        WHERE \"pet_reminder\".id = :id;";
        $params=[':id' => $id];

        $result = self::executeQuery($sql, $params);
        $data_reminder = array();
        if($result) {
            
            $row=$result->fetch();

            array_push($data_reminder, $row['id'],
            $row['id_pet'],
            $row['nombre'],
            $row['detalles'],
            $row['fecha_prevista'],
            $row['fecha_realizada'],
            $row['periodo_tiempo'],
            $row['id_tipo'],
            $row['tipo'],
            $row['nombre_tipo'],
            $row['color_reminder'],);
        }
        //devuelve una array de objetos reminder
        return $data_reminder;
    }

/****** Editar Recordatorio ******/
    public static function editReminder($idReminder, $idPet, $plannedDate, $doneDate, $details, $color, $timePeriod, $typeReminder){
        $sql="UPDATE \"pet_reminder\" SET id_pet = :idPet, detalles= :details, color_reminder = :color,
        fecha_prevista = :plannedDate, fecha_realizada = :doneDate, periodo_tiempo = :timePeriod, id_tipo= :typeReminder 
        WHERE id = :idReminder;";
        $params=[
            ':idPet' => $idPet,
            ':details' => $details,
            ':color' => $color,
            ':plannedDate' => $plannedDate,
            ':doneDate' => $doneDate,
            ':timePeriod' => $timePeriod,
            ':typeReminder' => $typeReminder,
            ':idReminder' => $idReminder
        ];

        $result = self::executeQuery($sql, $params);
    if($result){
            return 'Recordatorio modificado corectamente';
        }else{
            return "Algo fue mal";
        } 
    }

/****** Eliminar Recordatorio ******/
    public static function deleteReminder($id){
        $sql="DELETE FROM \"pet_reminder\" WHERE id = :id;";
        $params = [':id' => $id];;

        $result = self::executeQuery($sql, $params);
        if($result){
            return 'Recordatorio eliminado';
        }else{
            return "Algo fue mal";
        }   
    }

}//fin class DB


?>