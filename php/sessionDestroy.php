<?php
session_start();
// Eliminar la variable de sesión
unset($_SESSION['user']);
if(!isset($_SESSION['user'])){
?>
<script>
    location.href= "../vistas/index.html";
</script>
<?php
}

?>