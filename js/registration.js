$(document).ready(function(){

    
    //Pulsar botón con Enter
    pulsarBtnRetornoCarro();

    //evitar pegar texto
    noPegar();

    //envío del formulario
    $("#formularioRegistro").on("submit",function(event){
        //evitamos acción predeterminada
        event.preventDefault();
        //eliminamos todos los espacios de antes y después
        let userNameValue = $("#userName").val().trim();
        $("#userName").val(userNameValue);
        let emailValue = $("#email").val().trim();
        $("#email").val(emailValue);
        let passwordValue = $("#password").val().trim();
        $("#password").val(passwordValue);
        let repeatPasswordValue = $("#repeatPassword").val().trim();
        $("#repeatPassword").val(repeatPasswordValue);
        let questionValue = $("#securityAnswer").val().trim();
        $("#securityAnswer").val(questionValue);
        //validamos los campos del formulario
        let valName = validateName($("#userName").val());
        let valEmail = validateEmail($("#email").val());
        let valPassword = validatePassword($("#password").val());
        let valAnswer = validateInputText($("#securityAnswer").val());
        let valCheck = validateCheck($("#checkPrivacy"));
        let validationUserName,validationEmail,validationPassword,validationRepPass, validationQuestion, validationAnswer, validationCheck = false;

        //nombre de usuario
        if(!valName || $("#userName").val()==""){
            $("#errorName").text("Debe escribir un nombre válido");
            $("#errorName").css("display","block");
            $("#userName").addClass("error");
            $("#userName").removeClass("borderCajaTexto");
            validationUserName = false;
        }else{
            $("#errorName").text("");
            $("#errorName").css("display","none");
            $("#userName").removeClass("error");
            $("#userName").addClass("borderCajaTexto");
            validationUserName = true;
        }    

        //email
        if(!valEmail || $("#email").val()==""){
            $("#errorEmail").html("Debe escribir un email válido");
            $("#errorEmail").css("display","block");
            $("#email").addClass("error");
            $("#email").removeClass("borderCajaTexto");
            validationEmail = false;
        }else{
            $("#errorEmail").text("");
            $("#errorEmail").css("display","none");
            $("#email").removeClass("error");
            $("#email").addClass("borderCajaTexto");
            validationEmail = true;
        }    

        //contraseña
        if(!valPassword || $("#password").val()==""){
            $("#errorPassword").text("Debe escribir una contraseña válida");
            $("#errorPassword").css("display","block");
            $("#password").addClass("error");
            $("#password").removeClass("borderCajaTexto");
            validationPassword = false;
        }else{
            $("#errorPassword").text("");
            $("#errorPassword").css("display","none");
            $("#password").removeClass("error");
            $("#password").addClass("borderCajaTexto");
            validationPassword = true;
        }

        //repetir contraseña
        if($("#password").val() !== $("#repeatPassword").val() || $("#repeatPassword").val() == ""){
            $("#errorRepeatPassword").text("Debe coincidir con la contraseña");
            $("#errorRepeatPassword").css("display","block");
            $("#repeatPassword").addClass("error");
            $("#repeatPassword").removeClass("borderCajaTexto");
            validationRepPass = false;
        }else{
            $("#errorRepeatPassword").text("");
            $("#errorRepeatPassword").css("display","none");
            $("#repeatPassword").removeClass("error");
            $("#repeatPassword").addClass("borderCajaTexto");
            validationRepPass = true;
        }

        //Pregunta seguridad
        if($("#securityQuestion").val() == "" || $("#securityQuestion").val() == null){
            $("#errorSecurityQuestion").text("Debe elegir una pregunta");
            $("#errorSecurityQuestion").css("display","block");
            $("#securityQuestion").addClass("error");
            $("#securityQuestion").removeClass("borderCajaTexto");
            validationQuestion = false;
        }else{
            $("#errorSecurityAnswer").text("");
            $("#errorSecurityAnswer").css("display","none");
            $("#securityQuestion").removeClass("error");
            $("#securityQuestion").addClass("borderCajaTexto");
            validationQuestion = true;
        }

        //Respuesta seguridad
        if(!valAnswer || $("#securityAnswer").val() == ""){
            $("#errorSecurityAnswer").text("Debe escribir una respuesta válida");
            $("#errorSecurityAnswer").css("display","block");
            $("#securityAnswer").addClass("error");
            $("#securityAnswer").removeClass("borderCajaTexto");
            validationAnswer = false;
        }else{
            $("#errorSecurityQuestion").text("");
            $("#errorSecurityQuestion").css("display","none");
            $("#securityAnswer").removeClass("error");
            $("#securityAnswer").addClass("borderCajaTexto");
            validationAnswer = true;
        }

        //política de privacidad
        if(!valCheck){
            $("#errorCheck").text("Debe aceptar la política de privacidad");
            $("#errorCheck").css("display","block");
            $("#checkPrivacy").addClass("error");
            $("#checkPrivacy").removeClass("borderCajaTexto");
            validationCheck = false;
        }else{
            $("#errorCheck").text("");
            $("#errorCheck").css("display","none");
            $("#checkPrivacy").removeClass("error");
            $("#checkPrivacy").addClass("borderCajaTexto");
            validationCheck = true;
        }
        //si la validación es correcta, enviamos formulario
        if(validationUserName === true && validationEmail  === true && validationPassword === true && validationRepPass === true && validationCheck === true && validationQuestion === true && validationAnswer === true){
            var formData = new FormData($(this).get(0)); //get(0) porque solo queremos los datos del form   
            //enviamos form            
            $.ajax({
                url: '../php/registration.php',
                type: 'POST',
                processData: false,
                contentType: false,
                data: formData,
                success: function(data){ //lo que vuelve del php
                    if(data){
                        if(data === "userExists"){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Ya existe un usuario con ese email"
                            });
                        }else{
                            Swal.fire({
                                icon: "success",
                                text: "¡Su registro se ha realizado correctamente!"
                              }).then(function() {
                                window.location = "inicioSesion.html";
                            });
                        }
                    }
                    else{
                        console.log("No se ha podido realizar el registro.");
                    }  
                },
                error: function(error){ //error
                    console.log("error ",error);
                }
            });
        }//fin validación
    });//fin submit

    //posición del pie
    ajustarPosicionPie();
    $(window).resize(ajustarPosicionPie);

});//fin $(document).ready

//evitar pegar texto
function noPegar(){
    $("#userName").on("paste",function(e){
        e.preventDefault();
    });
    $("#email").on("paste",function(e){
        e.preventDefault();
    });
    $("#password").on("paste",function(e){
        e.preventDefault();
    });
    $("#repeatPassword").on("paste",function(e){
        e.preventDefault();
    });
}

//Pulsar botón con Enter
function pulsarBtnRetornoCarro(){
    $(window).on("keydown",function(e){
        if(e.keyCode == 13){
            $("#btnRegistro").click();
        }
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