$(document).ready(function(){
    //Pulsar botón con Enter
    pulsarBtnRetornoCarro();

    //evitar pegar texto
    noPegar();

    //envío del formulario
    $("#formularioInicioSesion").on("submit",function(event){
        //evitamos acción predeterminada
        event.preventDefault();
        //eliminamos todos los espacios de antes y después
        let emailValue = $("#email").val().trim();
        $("#email").val(emailValue);
        let passwordValue = $("#password").val().trim();
        $("#password").val(passwordValue);
        //validamos los campos del formulario
        let valEmail = validateEmail($("#email").val());
        let valPassword = validatePassword($("#password").val());
        let validationEmail,validationPassword = false;

        if(!valEmail || $("#email").val()==""){ //validación del email 
            $("#errorEmail").html("Formato no permitido");
            $("#errorEmail").css("display","block");
            $("#email").addClass("error");
            $("#email").removeClass("borderCajaTexto");
            $("#errorLogin").css("display","none");
            validationEmail = false;
        }else{
            $("#errorEmail").text("");
            $("#errorEmail").css("display","none");
            $("#email").removeClass("error");
            $("#email").addClass("borderCajaTexto");
            $("#errorLogin").css("display","none");
            validationEmail = true;
        }     
        if(!valPassword || $("#userPassword").val()==""){ //validación de la contraseña 
            $("#errorPassword").text("Formato no permitido");
            $("#errorPassword").css("display","block");
            $("#password").addClass("error");
            $("#password").removeClass("borderCajaTexto");
            $("#errorLogin").css("display","none");
            validationPassword = false;
        }else{
            $("#errorPassword").text("");
            $("#errorPassword").css("display","none");
            $("#password").removeClass("error");
            $("#password").addClass("borderCajaTexto");
            $("#errorLogin").css("display","none");
            validationPassword = true;
        }
        
        //si la validación es correcta, enviamos formulario
        if(validationEmail === true && validationPassword === true){
            var formData = new FormData($(this).get(0)); //get(0) porque solo queremos los datos del form   
            //enviamos form            
            $.ajax({
                url: '../php/login.php',
                type: 'POST',
                processData: false,
                contentType: false,
                data: formData,
                success: function(data){ //lo que vuelve del php
                    if(data){
                        if(data === "noPassword"){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "La contraseña es incorrecta"
                            });
                            
                        }else if(data){
                            window.location ='../vistas/principal.html';
                        }
                    }else{
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "No hay coincidencia con los datos aportados"
                        });
                    }
                },
                error: function(error){ //error
                    console.log("error ",error);
                }
            });
        }
    });

    //redirección a página de registro
    redireccionInicio();

    //posición del pie
    ajustarPosicionPie();
    $(window).resize(ajustarPosicionPie);
    
});//fin $(document).ready


//redirigir a página de registro
function redireccionInicio(){
    $("#registrarse").on("click",function(){
        window.location = "../vistas/registro.html";
    });
}

//Pulsar botón con Enter
function pulsarBtnRetornoCarro(){
    $(window).on("keydown",function(e){
        if(e.keyCode == 13){
            $("#btnInicioSesion").click();
        }
    });
}

//evitar pegar texto
function noPegar(){
    $("#email").on("paste",function(e){
        e.preventDefault();
    });
}

//posición del pie
function ajustarPosicionPie(){
    var windowHeight = $(window).height(); //tamaño de la ventana
    var pageHeight = $(document.body).height(); //Tamaño de la página
    if(pageHeight < windowHeight){
        $('.pie').css("position","fixed"); //si la página es más pequena que la ventana -> pie pegado a la parte inferior
    }else{
        $('.pie').css("position","static");
    }
}