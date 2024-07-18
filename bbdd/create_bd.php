<?php
//CREAR BASE DE DATOS
try{
    //Creamos la conexion con el servidor con el usuario root para  poder crear la base de datos
    $enlace  = new PDO('mysql:host=localhost','root','');
    //sentencia SQL para crear la bbdd, También creamos el usuario y le damos toso los privilegios
    $enlace->exec("CREATE DATABASE IF NOT EXISTS `petPlanner`DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci;");

}catch(Exception $e){ //mensaje de error
    echo $e->getMessage();
}
//RELLENAR LA BASE DE DATOS

 /******** TABLA USUARIO ********/
try{ //nos conectamos a la base de datos creada anteriormente
    $db  = new PDO('mysql:host=localhost;dbname=petPlanner','root','');
    //sentencia SQL para crear la tabla FAMILIA
    $sql= "CREATE TABLE IF NOT EXISTS `user` (
    `id` int NOT NULL AUTO_INCREMENT,
    `nombre` varchar(50) NOT NULL,
    `password` varchar(70),
    `email` varchar(50),
    `foto` longtext,
    `pregunta_seguridad` varchar(200),
    `respuesta_seguridad` varchar(200),
    `tipo` varchar(5),
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;";
    //ejecutamos la sentencia
    $db->exec($sql);


    //Introducimos un usuario de ejemplo
    // $sql="INSERT INTO `user` (`nombre`,`password`, `email`) VALUES
    // ('Manolo', '1234' ,'manolo@petplanner.com');";
    //ejecutamos la sentencia sql
    // $db->exec($sql);

}catch(Exception $e){ //mensaje de error
    echo $e->getMessage();
}

 /******** TABLA MASCOTA ********/
 try{ //nos conectamos a la base de datos creada anteriormente
    $db  = new PDO('mysql:host=localhost;dbname=petPlanner','root','');
    //sentencia SQL para crear la tabla FAMILIA
    $sql= "CREATE TABLE IF NOT EXISTS `pet` (
    `id` int NOT NULL AUTO_INCREMENT,
    `tipo` varchar(50),
    `nombre` varchar(50) NOT NULL,
    `raza` varchar(50),
    `genero` varchar(50),
    `peso` decimal,
    `fecha_nacimiento` date,
    `chip` varchar(2),
    `foto` longtext,
    `codigo` varchar(6) NOT NULL,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;";
    //ejecutamos la sentencia
    $db->exec($sql);

        //metemos una mascota al usuario de manolo
    // $sql="INSERT INTO `pet` (`nombre`,`tipo`, `raza`, `codigo`) VALUES
    // ('Paco', 'perro' ,'chihuahua', 'PACOPERRO'),
    // ('Amancio', 'gato' ,'persa','AMANCIOGATO');";
    //ejecutamos la sentencia sql
    // $db->exec($sql);

}catch(Exception $e){ //mensaje de error
    echo $e->getMessage();
}

/******** TABLA USUARIO / MASCOTA ********/
try{ //nos conectamos a la base de datos creada anteriormente
    $db  = new PDO('mysql:host=localhost;dbname=petPlanner','root','');
    //sentencia SQL para crear la tabla FAMILIA
    $sql= "CREATE TABLE IF NOT EXISTS `user_pet` (
    `id` int NOT NULL AUTO_INCREMENT,
    `id_user` int NOT NULL,
    `id_pet` int NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`id_user`) REFERENCES `user` (`id`)
        ON UPDATE CASCADE 
        ON DELETE RESTRICT,
    FOREIGN KEY(`id_pet`) REFERENCES `pet` (`id`)
        ON UPDATE CASCADE 
        ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;";
    //ejecutamos la sentencia
    $db->exec($sql);

    //Introducimos un usuario de ejemplo
    // $sql="INSERT INTO `user_pet` (`id_user`,`id_pet`) VALUES
    // ('1', '1');";
    //ejecutamos la sentencia sql
    // $db->exec($sql);

}catch(Exception $e){ //mensaje de error
    echo $e->getMessage();
}

/******** TABLA PLANTILLA_RECORDATORIOS ********/
try{ //nos conectamos a la base de datos creada anteriormente
    $db  = new PDO('mysql:host=localhost;dbname=petPlanner','root','');
    //sentencia SQL para crear la tabla FAMILIA
    $sql= "CREATE TABLE IF NOT EXISTS `type_of_reminder` (
    `id` int NOT NULL,
    `tipo` varchar (150) NOT NULL,
    `nombre_tipo` varchar(250),
    `periodo_tiempo_tipo` int,
    PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;";
    //ejecutamos la sentencia
    $db->exec($sql);

    //metemos unrecordatorio a paco perrete de manolo
    $sql="INSERT IGNORE INTO `type_of_reminder` (`id`,`tipo`,`nombre_tipo`,`periodo_tiempo_tipo`) VALUES
    (1, 'Desparasitación', 'Interna',3), (2, 'Desparasitación', 'Externa',0),
    (3, 'Vacuna', 'Bivalente',0), 
    (4, 'Vacuna', 'Polivalente 1 (cachorro)',0),
    (5, 'Vacuna', 'Polivalente 2 (cachorro)',0),
    (6, 'Vacuna', 'Polivalente (recordatorio)',12), 
    (7, 'Vacuna', 'Antirrábica (cachorro)',0), 
    (8, 'Vacuna', 'Antirrábica (recordatorio)',12),
    (9, 'Vacuna', 'Leishmaniosis',12),
    (10, 'Aseo', 'Baño',0),
    (11, 'Aseo', 'Limpieza Bucal',0),
    (12, 'Aseo', 'Limpieza Oídos',0), 
    (13, 'Aseo', 'Dentista',0),
    (14, 'Aseo', 'Peluquería',0),
    (15, 'Aseo', 'Corte de uñas',0), 
    (16, 'Medicación', 'Diabetes',0), 
    (17, 'Medicación', 'Epilepsia',0),
    (18, 'Medicación', 'Insuficiencia cardiaca',0),
    (19, 'Medicación', 'Moquillo',0), 
    (20, 'Medicación', 'Leptospirosis',0), 
    (21, 'Medicación', 'Tos de las perreras',0),
    (22, 'Medicación', 'Alergia',0),
    (23, 'Medicación', 'Otros',0),
    (24, 'Otros', 'Chip',0),
    (25, 'Otros', 'Licencia admin. PPP',0),
    (26, 'Otros', 'Seguro obligatorio',0),
    (27, 'Otros', 'Otros',0);";
    //ejecutamos la sentencia sql
    $db->exec($sql);

}catch(Exception $e){ //mensaje de error
    echo $e->getMessage();
}

 /******** TABLA RECORDATORIO_MASCOTA ********/
 try{ //nos conectamos a la base de datos creada anteriormente
    $db  = new PDO('mysql:host=localhost;dbname=petPlanner','root','');
    //sentencia SQL para crear la tabla FAMILIA
    $sql= "CREATE TABLE IF NOT EXISTS `pet_reminder` (
    `id` int NOT NULL AUTO_INCREMENT,
    `id_pet` int NOT NULL,
    `detalles` varchar(250),
    `color_reminder` varchar (100),
    `fecha_prevista` date NOT NULL,
    `fecha_realizada` date,
    `periodo_tiempo` int,
    `id_tipo` int NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY(`id_pet`) 
    REFERENCES `pet` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY(`id_tipo`) 
    REFERENCES `type_of_reminder` (`id`)
    ON UPDATE CASCADE ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;";
    //ejecutamos la sentencia
    $db->exec($sql);

    //metemos unrecordatorio a paco perrete de manolo
    // $sql="INSERT INTO `pet_reminder` (`id_pet`, `detalles`,`fecha_prevista`,`id_tipo`) VALUES 
    // (1, 'Paco ha sido vacunado', '2024-04-01',  5);";
    //ejecutamos la sentencia sql
    // $db->exec($sql);

}catch(Exception $e){ //mensaje de error
    echo $e->getMessage();
}

/******** FUNCIÓN GUARDAR MASCOTA Y ENLAZAR CON USUARIO QUE LA HA CREADO ********/
try {
    $sql = "
        DROP FUNCTION IF EXISTS addNuevaMascota;
        CREATE FUNCTION addNuevaMascota(user_id INT, petName VARCHAR(50), petDate DATE, petType VARCHAR(50), petBreed VARCHAR(50), petWeight DECIMAL, petGender VARCHAR(50), petChip VARCHAR(2), petCode VARCHAR(6), petImg LONGTEXT) 
        RETURNS INT
        BEGIN
            DECLARE pet_id INT;
            INSERT INTO pet (nombre, fecha_nacimiento,tipo, raza, peso, genero, chip, codigo,foto) VALUES (petName, petDate, petType, petBreed, petWeight, petGender, petChip, petCode, petImg);
            SET pet_id = LAST_INSERT_ID();
            INSERT INTO user_pet (id_user, id_pet) VALUES (user_id, pet_id);
            RETURN pet_id;
        END";
    $db->exec($sql);
} catch (Exception $e) {
    echo $e->getMessage();
}

/******** USUARIOS ADMINISTRADORES ********/
    $password = password_hash(1234,PASSWORD_DEFAULT);
    $sql="INSERT INTO `user` (`nombre`,`password`, `email`,`tipo`) VALUES
    ('CELIA', '$password' ,'celia@petplanner.com','admin');";
    $db->exec($sql);
    $sql="INSERT INTO `user` (`nombre`,`password`, `email`,`tipo`) VALUES
    ('PATRICIA', '$password' ,'patricia@petplanner.com','admin');";
    $db->exec($sql);
    $sql="INSERT INTO `user` (`nombre`,`password`, `email`,`tipo`) VALUES
    ('ADMIN', '$password' ,'admin@petplanner.com','admin');";
    $db->exec($sql);



?>