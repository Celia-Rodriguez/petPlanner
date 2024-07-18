let usuario = "";

$(document).ready(function(){

    ajustarContenedor();

    //comprobamos si hay datos de sesión, si no, redirigimos a inicio de sesión
    //Em caso de existir sesión, nos traemos los datos del usuario y sus mascotas
    $.ajax({
        url: '../php/principal.php',
        type: 'POST',
        async: false,
        processData: false,
        contentType: false,
        success: function(data){
            if(data == false){
                window.location ='../vistas/inicioSesion.html';
            }else{
                usuario = JSON.parse(data);
                //permisos
                if(usuario["tipo"] == "admin"){ //si el usuario es admin, se muestra esta opción
                    $("#adminUsuarios").css("display","block");
                }else{
                    window.location ='../vistas/principal.html';
                }
            }
        }
    });

    $.ajax({
        url: '../php/admin/tablaUsuarios.php',
        type: 'POST',
        processData: false,
        contentType: false,
        success: function(data){ //lo que vuelve del php
            let datos = JSON.parse(data);
            for(let pos=0;pos<datos.length;pos++){
                let fila = `<tr>
                    <td>${datos[pos]["userName"]}</td>
                    <td>${datos[pos]["email"]}</td>
                    <td>
                        <select name="" id="select${datos[pos]["idUser"]}" onchange="cambiarTipo(\'${datos[pos]["idUser"]}\')">
                            <option value="admin" ${datos[pos]["role"] === "admin" ? "selected" : ""}>Administrador</option>
                            <option value="user" ${datos[pos]["role"] === "user" ? "selected" : ""}>Usuario</option>
                        </select>
                        <!--<button>Guardar</button>-->
                    </td>
                </tr>`;
                $("tbody").append(fila);// Agregamos la fila al tbody
            }
        },
        error: function(error){ //error
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Se ha producido un fallo"
            });
        }
        
    });

    buscadorTabla("#inputBuscador", "#tablaUsuarios");

    //volver a página principal al pulsar Volver
    volverAprincipal();

    //posición del pie
    ajustarPosicionPie();
    $(window).resize(ajustarPosicionPie);

    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('#btnArriba').fadeIn();
        } else {
            $('#btnArriba').fadeOut();
        }
    });

    let alturaTabla = $(".contenedorTablaUsuarios").outerHeight();
    if(alturaTabla > $(window).height()){
        $('#btnArriba').css("display","block");
    }

});//fin document.ready

function ajustarContenedor(){
    var alturaVentana = $(window).height();
    var alturaPie = $('footer').outerHeight();
    var alturaContainer = alturaVentana - alturaPie;

    $(".container").css("min-height",alturaContainer);
}

//volver a página principal
function volverAprincipal(){
    $("#btnVolver").on("click",function(){
        window.location ='../vistas/principal.html';
    })
}

//posición del pie
function ajustarPosicionPie(){
    var windowHeight = $(window).height(); //tamaño de la ventana
    var pageHeight = $(document.body).height(); //Tamaño de la página
    if(pageHeight < windowHeight){
        $(".pie").css("position","fixed"); //si la página es más pequena que la ventana -> pie pegado a la parte inferior
    }else{
        $(".pie").css("position","static");
    }
}

function cambiarTipo(id){
    
    $.ajax({
        url: '../php/admin/cambiarTipoUsuario.php',
        type: 'POST',
        dataType: 'json',
        data: {id: id, tipo: $(`#select${id}`).val()},
        success: function(data){ //lo que vuelve del php
            if(data == true){
                Swal.fire({
                    icon: "success",
                    title: "Tipo de usuario cambiado",
                    text: "Los cambios serán efectivos la próxima vez que el usuario inicie sesión"
                })
                .then(function(){
                    $(`#select${email}`).val($(`#select${email}`).val());
                });
            }else{
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "No se ha podido cambiar el tipo de usuario"
                }); 
            }
        },
        error: function(error){ //error
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Se ha producido un fallo"
            });
        }
    });
}

//buscador para la tabla
function buscadorTabla(inputBuscador, tabla) {
    $(inputBuscador).on("keyup", function() {
        var value = $(this).val().toLowerCase();//al escribir, tomamos el valor del input y lo pasamos a minúsculas
        $(tabla + " tbody tr").filter(function() {//recorremos con filter los tr de la tabla
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);//con toggle mostramos u ocultamos las filas en función de si el texto de sus celdas contiene o no el texto del input
        });
    });
}

//función para subir al inicio de la página
function subir(){
    $('html, body').animate({scrollTop: 0}, 'slow');
        return false;
}