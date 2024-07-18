let usuario ="";
let imgUsuario = "";
$(document).ready(function(){

    //evitamos drag and drop si no se ha pulsado Subir imagen
    $(".contenedorImagenUsuario").off('dragover');
    $(".contenedorImagenUsuario").off('dragleave');
    $(".contenedorImagenUsuario").off('drop')
    

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
                }
            }
        }
    });


    bloquearForm(); //bloqueamos formulario
    cargarDatosUsuario(usuario); //mostramos los datos del usuario en el formulario

    actualizarUsuario(); //actualizar nombre y foto usuario

    datosCambioEmail(usuario); //mostramos el email en el modal email

    actualizarEmail(); //actualizar email
    cambiarPassword(); //actualizar contraseña
    eliminarUsuario(); //eliminar usuario

});//document ready


function bloquearForm(){
    $("#btnActualizarUsuario").css("display","none"); //ocultamos botón actualizar mascota
    $("#btnCancelarUsuario").css("display","none");
    $(".contenedorInputs input").attr("disabled", true); //bloqueamos inputs formulario
    $("#subirImg").css("display","none");
    $("#btnEditarUsuario").css("display","block");
}

function cargarDatosUsuario(usuario){
    $("#userName").val(usuario["nombre"]);
    $("#userEmail").val(usuario["email"]);
    
    //mostramos la foto en función de si tiene una guardada o no
    $(".contenedorImagenUsuario").html("");//primero vacíamos el contenedor de la imagen por si había alguna foto
    if(usuario.foto !== "" && usuario["foto"] !== null){
        imagen = `<img class='imgMascota' src='data:image/jpg;base64,${usuario["foto"]}' alt='${usuario["nombre"]}'>`;
        $(".contenedorImagenUsuario").html(imagen);
    }
}

function editarUsuario(){
    $("#btnEditarUsuario").css("display","none");
    $("#btnCancelarUsuario").css("display","block");
    $("#btnActualizarUsuario").css("display","block");
    $(".contenedorInputs input").attr("disabled", false);
    $("#subirImg").css("display","block");
    imgUsuario = $(".contenedorImagenUsuario").html();
    dragAndDropImagen();
}

function cancelarEditar(){
    $("#btnEditarUsuario").css("display","block");
    $("#btnActualizarUsuario").css("display","none");
    $("#btnCancelarUsuario").css("display","none");
    $(".contenedorInputs input").attr("disabled", true);
    $("#subirImg").css("display","none");
    $(".contenedorImagenUsuario").off('dragover');
    $(".contenedorImagenUsuario").off('dragleave');
    $(".contenedorImagenUsuario").off('drop');
    $("#userName").val(usuario["nombre"]).removeClass("error");
    $("#errorUserName").css("display","none")
    $(".contenedorImagenUsuario").html(imgUsuario);
}

//para abrir input file al hacer click en el botón Subir imagen
function pulsarFile(){
    $("#userImg").trigger('click');
    $(".contenedorImagenUsuario").off('dragover');
    $(".contenedorImagenUsuario").off('dragleave');
    $(".contenedorImagenUsuario").off('drop');
}

/*------- funciones relativas a la imagen ---------*/
//arrastrar y soltar la imagen
function dragAndDropImagen(){

    var dropArea = $('.contenedorImagenUsuario');//contenedor imagen
    var fileElem = $('#userImg');//input tipo file

    dropArea.on('dragover', function(e) {
        e.preventDefault();
        dropArea.addClass('dragover');
    });

    dropArea.on('dragleave', function(e) {
        e.preventDefault();
        dropArea.removeClass('dragover');
    });

    dropArea.on('drop', function(e) {
        e.preventDefault();
        dropArea.removeClass('dragover');
        
        var files = e.originalEvent.dataTransfer.files;//obtenemos los elementos que se soltaron
        handleFile(files[0]);//cogemos el primero, ya que solo vamos a permitir uno

        //Creamos una lista de archivos con el archivo seleccionado
        var fileList = new DataTransfer();
        fileList.items.add(files[0]);
        // Guardamos la lista de archivos en el input file
        fileElem[0].files = fileList.files;
        // Actualizamos el input file
        fileElem.trigger('change');
    });

    fileElem.on('change', function(e) {//si cambia el contenido del input, recogemos el nuevo
        var files = e.target.files;
        handleFile(files[0]);
    });

    //manejamos del archivo. Comprobamos tamano, cargamos en conteneor de imagen y en el input.
    function handleFile(file) {
        // Tamaño máximo de la imagen 
        var maxSize = 788000; // 1 MB(1 * 1024 * 1024)/1.33 Máximo en mysql por defecto un 1mg, hay que reducirlo porque 1mg = 1,33 en base64

        // Verificamos el tamaño de la imagen
        if (file.size > maxSize) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "El tamaño de la imagen no puede exceder de 788Kb"
            });
            exit;
        }

        //Verificamos si tiene formato de imagen y la mostramos
        if (file.type.match('image.*')) {
            var reader = new FileReader();
            reader.onload = function(e) {
                dropArea.empty();
                $('<img>').attr('src', e.target.result).css("width","100%").css("height","100%").css("object-fit","cover").appendTo(dropArea);
            };
            reader.readAsDataURL(file);
        } else {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Por favor, selecciona solo archivos de imagen"
            });
            exit;
        }
    }
}

//Actualizar datos de usuario (nombre e imagen)
function actualizarUsuario(){
    $("#formularioModificarUsuario").on("submit",function(event){
        //evitamos acción predeterminada
        event.preventDefault();
        //validamos campos
        let valName = validateName($("#userName").val());
        let validationUserName = false;

        //nombre de usuario
        if(!valName || $("#userName").val()==""){
            $("#errorUserName").text("Debe escribir un nombre válido");
            $("#errorUserName").css("display","block");
            $("#userName").addClass("error");
            $("#userName").removeClass("borderCajaTexto");
            validationUserName = false;
        }else{
            $("#errorUserName").text("");
            $("#errorUserName").css("display","none");
            $("#userName").removeClass("error");
            $("#userName").addClass("borderCajaTexto");
            validationUserName = true;
        }    

        //si la validación es correcta, enviamos formulario
        if(validationUserName === true){
            var formData = new FormData($(this).get(0)); //get(0) porque solo queremos los datos del form   
            //enviamos form 
            $.ajax({
                url: '../php/user/actualizarUsuario.php',
                type: 'POST',
                processData: false,
                contentType: false,
                data: formData,
                success: function(data){ //lo que vuelve del php
                    if(data){
                        if(data == false){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "No se han podido actualizar los datos"
                            });
                        }else{
                            Swal.fire({
                                icon: "success",
                                title: "¡Genia!",
                                text: "¡Sus datos se han actualizado correctamente!"
                            }).then(function() {
                                bloquearForm();
                                let datos = JSON.parse(data);
                                usuarioActualizado = datos["data"];
                                usuario = usuarioActualizado;
                                cargarDatosUsuario(usuario);
                                datosCambioEmail(usuario);
                                //evitamos drag and drop si no se ha pulsado Subir imagen
                                $(".contenedorImagenUsuario").off('dragover');
                                $(".contenedorImagenUsuario").off('dragleave');
                                $(".contenedorImagenUsuario").off('drop')
                            });
                        }
                    }
                    else{
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "No se ha podido realizar el registro."
                        });
                    }  
                },
                error: function(error){ //error
                    console.log("error ",error);
                }
            });
        }
    })
}

// Cerrar modal
function cerrarModal(modal){
    switch (modal) {
        case "email":
            $("#modalCambioEmail").css("display","none");
            break;
        case "password":
            $("#modalCambioPassword").css("display","none");
            break;    
        case "delete":
            $("#modalEliminarUsuario").css("display","none");
    }
}

/*------- FUNCIONES RELATIVAS A CAMBIAR EMAIL --------*/
function abrirModalCambioEmail(){
    datosCambioEmail(usuario);
    $("#modalCambioEmail").css("display","block");
    datosCambioEmail(usuario);
}

function datosCambioEmail(usuario){
    $("#emailCambioEmail").val(usuario.email);
    $("#passwordCambioEmail").val("");
    $("#errorPasswordCambioEmail").css("display","none");
    $("#passwordCambioEmail").removeClass("error");
    $("#passwordCambioEmail").addClass("borderCajaTexto");

}

function actualizarEmail(){
    $("#formCambioEmail").on("submit",function(event){
        //evitamos acción predeterminada
        event.preventDefault();
        //eliminamos todos los espacios de antes y después
        let emailValue = $("#emailCambioEmail").val().trim();
        $("#emailCambioEmail").val(emailValue);
        let passwordValue = $("#passwordCambioEmail").val().trim();
        $("#passwordCambioEmail").val(passwordValue);
        //validamos los campos del formulario
        let valEmail = validateEmail($("#emailCambioEmail").val());
        let valPassword = validatePassword($("#passwordCambioEmail").val());
        let validationEmail,validationPassword = false;
        //email
        if(!valEmail || $("#emailCambioEmail").val()==""){
            $("#errorEmailCambioEmail").html("Debes escribir un email válido");
            $("#errorEmailCambioEmail").css("display","block");
            $("#emailCambioEmail").addClass("error");
            $("#emailCambioEmail").removeClass("borderCajaTexto");
            validationEmail = false;
        }else{
            $("#errorEmailCambioEmail").text("");
            $("#errorEmailCambioEmail").css("display","none");
            $("#emailCambioEmail").removeClass("error");
            $("#emailCambioEmail").addClass("borderCajaTexto");
            validationEmail = true;
        }     
        if(!valPassword || $("#passwordCambioEmail").val()==""){
            $("#errorPasswordCambioEmail").text("Debes escribir una contraseña válida");
            $("#errorPasswordCambioEmail").css("display","block");
            $("#passwordCambioEmail").addClass("error");
            $("#passwordCambioEmail").removeClass("borderCajaTexto");
            validationPassword = false;
        }else{
            $("#errorPasswordCambioEmail").text("");
            $("#errorPasswordCambioEmail").css("display","none");
            $("#passwordCambioEmail").removeClass("error");
            $("#passwordCambioEmail").addClass("borderCajaTexto");
            validationPassword = true;
        }

        if(validationEmail === true && validationPassword === true){
            var formData = new FormData($(this).get(0)); //get(0) porque solo queremos los datos del form   
            //enviamos form            
            $.ajax({
                url: '../php/user/actualizarEmail.php',
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
                        }else if(data == "existeEmail"){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "El email ya está en uso"
                            });
                        }else if(data == "false"){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "No se ha podido actualizar el email"
                            });
                        }else{
                            Swal.fire({
                                icon: "success",
                                title: "¡Genia!",
                                text: "¡Sus email se ha actualizado correctamente!"
                            }).then(function() {
                                bloquearForm();
                                let datos = JSON.parse(data);
                                usuarioActualizado = datos["data"];
                                usuario = usuarioActualizado;
                                cargarDatosUsuario(usuario);
                                cerrarModal("email");
                            });
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
    })
}

/*------- FUNCIONES RELATIVAS A CAMBIAR CONTRASEÑA --------*/
function abrirModalCambioPassword(){
    //limpiamos el formulario
    $("#securityQuestion").val("");
    $("#securityAnswer").val("");
    $("#repeatRecoveryPassword").val("");
    $("#recoveryPassword").val("");

    $("#errorrecoveryPassword").css("display","none");
    $("#recoveryPassword").removeClass("error");
    $("#recoveryPassword").addClass("borderCajaTexto");

    $("#errorRepeatRecoveryPassword").css("display","none");
    $("#repeatRecoveryPassword").removeClass("error");
    $("#repeatRecoveryPassword").addClass("borderCajaTexto");

    $("#errorSecurityQuestion").css("display","none");
    $("#securityQuestion").removeClass("error");
    $("#securityQuestion").addClass("borderCajaTexto");

    $("#errorSecurityAnswer").css("display","none");
    $("#securityAnswer").removeClass("error");
    $("#securityAnswer").addClass("borderCajaTexto");

    //Abrimos el modal
    $("#modalCambioPassword").css("display","block");

}

function cambiarPassword(){
    $("#formCambioPassword").on("submit",function(event){
        //evitamos acción predeterminada
        event.preventDefault();
        let passwordValue = $("#recoveryPassword").val().trim();
        $("#recoveryPassword").val(passwordValue);
        let repeatPasswordValue = $("#repeatRecoveryPassword").val().trim();
        $("#repeatRecoveryPassword").val(repeatPasswordValue);
        let answerValue = $("#securityAnswer").val().trim();
        $("#securityAnswer").val(answerValue);
        //validamos los campos del formulario
        let valPassword = validatePassword($("#recoveryPassword").val());
        let valAnswer = validateInputText($("#securityAnswer").val());
        let validationPassword,validationRepPass, validationQuestion, validationAnswer = false;    

        //contraseña
        if(!valPassword || $("#recoveryPassword").val()==""){
            $("#errorrecoveryPassword").text("Debe escribir una contraseña válida");
            $("#errorrecoveryPassword").css("display","block");
            $("#recoveryPassword").addClass("error");
            $("#recoveryPassword").removeClass("borderCajaTexto");
            validationPassword = false;
        }else{
            $("#errorrecoveryPassword").text("");
            $("#errorrecoveryPassword").css("display","none");
            $("#recoveryPassword").removeClass("error");
            $("#recoveryPassword").addClass("borderCajaTexto");
            validationPassword = true;
        }

        //repetir contraseña
        if($("#recoveryPassword").val() !== $("#repeatRecoveryPassword").val() || $("#repeatRecoveryPassword").val() == ""){
            $("#errorRepeatRecoveryPassword").text("Debe coincidir con la contraseña");
            $("#errorRepeatRecoveryPassword").css("display","block");
            $("#repeatRecoveryPassword").addClass("error");
            $("#repeatRecoveryPassword").removeClass("borderCajaTexto");
            validationRepPass = false;
        }else{
            $("#errorRepeatRecoveryPassword").text("");
            $("#errorRepeatRecoveryPassword").css("display","none");
            $("#repeatRecoveryPassword").removeClass("error");
            $("#repeatRecoveryPassword").addClass("borderCajaTexto");
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
            $("#errorSecurityQuestion").text("");
            $("#errorSecurityQuestion").css("display","none");
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
            $("#errorSecurityAnswer").text("");
            $("#errorSecurityAnswer").css("display","none");
            $("#securityAnswer").removeClass("error");
            $("#securityAnswer").addClass("borderCajaTexto");
            validationAnswer = true;
        }

        //si la validación es correcta, enviamos formulario
        if(validationPassword === true && validationRepPass === true && validationQuestion === true && validationAnswer === true){
            var formData = new FormData($(this).get(0)); //get(0) porque solo queremos los datos del form   
            //enviamos form            
            $.ajax({
                url: '../php/user/nuevaPassword.php',
                type: 'POST',
                processData: false,
                contentType: false,
                data: formData,
                success: function(data){ //lo que vuelve del php
                    if(data){
                        if(data === "noEmail"){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "No existe usuario con ese email"
                            });
                        }else if(data === "noPregunta"){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Pregunta o respuesta incorrectas"
                            });
                        }else if(data === false){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "No se ha podido actualizar la contraseña"
                            });
                        }else{
                            Swal.fire({
                                icon: "success",
                                title: "¡Genia!",
                                text: "¡Se ha cambiado su contraseña correctamente!"
                            }).then(function(){
                                cerrarModal("password");
                            });
                        }
                    }
                    else{
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "No se ha podido realizar el registro."
                        });
                    }  
                },
                error: function(error){ //error
                    console.log("error ",error);
                }
            });
        }//fin validación
    })
}

/*------- FUNCIONES RELATIVAS A ELIMINAR USUARIO --------*/
function abrirModalEliminarUsuario(){
    //limpiamos el formulario del modal
    $("#securityQuestionDelete").val("");
    $("#securityAnswerDelete").val("");
    $("#repeatPasswordDelete").val("");
    $("#passwordDelete").val("");

    $("#errorPasswordDelete").css("display","none");
    $("#passwordDelete").removeClass("error");
    $("#passwordDelete").addClass("borderCajaTexto");

    $("#errorRepeatPasswordDelete").css("display","none");
    $("#repeatPasswordDelete").removeClass("error");
    $("#repeatPasswordDelete").addClass("borderCajaTexto");

    $("#errorSecurityQuestionDelete").css("display","none");
    $("#securityQuestionDelete").removeClass("error");
    $("#securityQuestionDelete").addClass("borderCajaTexto");

    $("#errorSecurityAnswerDelete").css("display","none");
    $("#securityAnswerDelete").removeClass("error");
    $("#securityAnswerDelete").addClass("borderCajaTexto");

    //Abrimos el modal
    $("#modalEliminarUsuario").css("display","block");
}

function eliminarUsuario(){
    $("#formEliminarUsuario").on("submit",function(event){
        //evitamos acción predeterminada
        event.preventDefault();
        let passwordValue = $("#passwordDelete").val().trim();
        $("#passwordDelete").val(passwordValue);
        let repeatPasswordValue = $("#repeatPasswordDelete").val().trim();
        $("#repeatPasswordDelete").val(repeatPasswordValue);
        let answerValue = $("#securityAnswerDelete").val().trim();
        $("#securityAnswerDelete").val(answerValue);
        //validamos los campos del formulario
        let valPassword = validatePassword($("#passwordDelete").val());
        let valAnswer = validateInputText($("#securityAnswerDelete").val());
        let validationPassword,validationRepPass, validationQuestion, validationAnswer = false;    

        //contraseña
        if(!valPassword || $("#passwordDelete").val()==""){
            $("#errorPasswordDelete").text("Debe escribir una contraseña válida");
            $("#errorPasswordDelete").css("display","block");
            $("#passwordDelete").addClass("error");
            $("#passwordDelete").removeClass("borderCajaTexto");
            validationPassword = false;
        }else{
            $("#errorPasswordDelete").text("");
            $("#errorPasswordDelete").css("display","none");
            $("#passwordDelete").removeClass("error");
            $("#passwordDelete").addClass("borderCajaTexto");
            validationPassword = true;
        }

        //repetir contraseña
        if($("#passwordDelete").val() !== $("#repeatPasswordDelete").val() || $("#repeatPasswordDelete").val() == ""){
            $("#errorRepeatPasswordDelete").text("Debe coincidir con la contraseña");
            $("#errorRepeatPasswordDelete").css("display","block");
            $("#repeatPasswordDelete").addClass("error");
            $("#repeatPasswordDelete").removeClass("borderCajaTexto");
            validationRepPass = false;
        }else{
            $("#errorRepeatPasswordDelete").text("");
            $("#errorRepeatPasswordDelete").css("display","none");
            $("#repeatPasswordDelete").removeClass("error");
            $("#repeatPasswordDelete").addClass("borderCajaTexto");
            validationRepPass = true;
        }

        //Pregunta seguridad
        if($("#securityQuestionDelete").val() == "" || $("#securityQuestionDelete").val() == null){
            $("#errorSecurityQuestionDelete").text("Debe elegir una pregunta");
            $("#errorSecurityQuestionDelete").css("display","block");
            $("#securityQuestionDelete").addClass("error");
            $("#securityQuestionDelete").removeClass("borderCajaTexto");
            validationQuestion = false;
        }else{
            $("#errorSecurityQuestionDelete").text("");
            $("#errorSecurityQuestionDelete").css("display","none");
            $("#securityQuestionDelete").removeClass("error");
            $("#securityQuestionDelete").addClass("borderCajaTexto");
            validationQuestion = true;
        }

        //Respuesta seguridad
        if(!valAnswer || $("#securityAnswerDelete").val() == ""){
            $("#errorSecurityAnswerDelete").text("Debe escribir una respuesta válida");
            $("#errorSecurityAnswerDelete").css("display","block");
            $("#securityAnswerDelete").addClass("error");
            $("#securityAnswerDelete").removeClass("borderCajaTexto");
            validationAnswer = false;
        }else{
            $("#errorSecurityAnswerDelete").text("");
            $("#errorSecurityAnswerDelete").css("display","none");
            $("#securityAnswerDelete").removeClass("error");
            $("#securityAnswerDelete").addClass("borderCajaTexto");
            validationAnswer = true;
        }

        //si la validación es correcta, enviamos formulario
        if(validationPassword === true && validationRepPass === true && validationQuestion === true && validationAnswer === true){
            var formData = new FormData($(this).get(0)); //get(0) porque solo queremos los datos del form  
            Swal.fire({
                title: "¿Estas seguro?",
                text: "Una vez eliminado, no podrás revertir esta acción",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Eliminar"
              }).then((result) => {
                if (result.isConfirmed) {
                  //enviamos form            
            $.ajax({
                url: '../php/user/eliminarUsuario.php',
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
                        }else if(data === "tieneMascotas"){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Tienes mascotas asociadas. Antes de borrar tu usuario, debes eliminar las mascotas"
                            }).then(function(){
                                cerrarModal("delete");
                            });
                        }else if(data === "noPregunta"){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Pregunta o respuesta incorrectas"
                            });
                        }else if(data === false){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "No se ha podido eliminar el usuario"
                            });
                        }else{    
                            console.log(data); 
                            Swal.fire({
                                icon: "success",
                                title: "¡Genia!",
                                text: "¡Su usuario se ha eliminado correctamente!"
                            }).then(function(){
                                window.location ='../php/sessionDestroy.php';
                            });
                        }
                    }
                    else{
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "No se ha podido eliminar el usuario"
                        });
                    }  
                },
                error: function(error){ //error
                    console.log("error ",error);
                }
            });
                }
              }); 
            
        }//fin validación
    })
}