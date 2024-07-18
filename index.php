<?php

    session_start();

    if(isset($_SESSION['email']) && $_SESSION['email'] !== ""){
        header("Location: vistas/principal.html");
    }else{
        header("Location: vistas/index.html");
    }

?>