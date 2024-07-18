let razasPerro = []; //para guardar las razas de perro para posteriores comprobaciones

$(document).ready(function(){

    //comprobamos que se haya iniciado sesión
    checkUserLogged();

    //Pulsar botón con Enter
    pulsarBtnRetornoCarro();

    //pulsar el botón de añadir archivo
    pulsarFile();

    //añadir imagen con drag&drop
    dragAndDropImagen();

    //selector raza
    $.ajax({
        async: false,
        crossDomain: true,
        url: '../json/razasPerros.json',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        success: function(data){ //lo que vuelve del php
            if(data){
                //guardamos las razas en la variable creada al principio
                for(let i=0;i<data.razas_perros.length;i++){
                    razasPerro.push(data.razas_perros[i]); 
                }
                $("#petBreed").autocomplete({ //input autocomplete
                    source: razasPerro,
                    minLength: 0,
                    open: function(event, ui) { 
                        $(this).autocomplete("widget").css({
                            "width": (($(this).width()+17) + "px") //tamaño del desplegable
                        })
                    },
                    select: function(event,ui){ //Seleccionar raza
                        let raza = ui.item.value;
                        $("#petBreed").attr("value",raza);
                    }
                }).on("focus",function(){
                    $(this).autocomplete("search");
                });
            } 
        },
        error: function(error){ //error
            console.log("error ",error);
        }
    });

    //volver a la página anterior
    $("#btnVolver").on("click",function(){
        volverApagAnterior();
    })

    

    //posición del pie
    ajustarPosicionPie();
    $(window).resize(ajustarPosicionPie);

    guardarMascotaCodigo();
    guardarMascotaDatos();

});//fin document.ready

//comprobamos si hay datos de sesión, si no, redirigimos a inicio de sesión
function checkUserLogged(){
    $.ajax({
        url: '../php/principal.php',
        type: 'POST',
        processData: false,
        contentType: false,
        success: function(data){
            if(data == false){
                window.location ='../vistas/inicioSesion.html';
            }else{
                let usuario = JSON.parse(data);
                //permisos
                if(usuario["tipo"] == "admin"){ //si el usuario es admin, se muestra esta opción
                    $("#adminUsuarios").css("display","block");
                }
            }
        }
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

//volver a página principal
function volverApagAnterior(){
    //Sacamos la variable pag de la url
    let urlActual = window.location.href;
    let url = new URL(urlActual);
    let parametros = new URLSearchParams(url.search); //buscamos las variables que contenga
    let paginaAnterior = parametros.get("pag");
    if(paginaAnterior == "vista"){
        window.location ='../vistas/vistaMascotas.html';
    }else{
        window.location ='../vistas/principal.html';
    }
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

//para abrir input file al hacer click en el botón Subir imagen
function pulsarFile(){
    $(".subirImg").on("click", function(){
        $("#petImg").trigger('click');
        $(".contenedorImagenMascota").off('dragover');
        $(".contenedorImagenMascota").off('dragleave');
        $(".contenedorImagenMascota").off('drop');
    });
}

/*------- funciones relativas a la imagen ---------*/
//arrastrar y soltar la imagen
function dragAndDropImagen(){

    var dropArea = $('.contenedorImagenMascota');//contenedor imagen
    var fileElem = $('#petImg');//input tipo file

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
                text: "El tamaño de la imagen no puede exceder de 1Mb"
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

//envío del formulario con el código de la mascota
function guardarMascotaCodigo(){
    $("#formularioAltaCodigoMascota").on("submit",function(event){
        //evitamos acción predeterminada
        event.preventDefault();
        // Hacemos trim al valor de petCode
        var petCodeValue = $("#petCode").val().replace(/^\s+/, '').trim(); //eliminamos todos los espacios que pueda haber
        $("#petCode").val(petCodeValue);
        if($("#petCode").val()==""){
            $("#errorPetCode").text("Debes introducir un código válido");
            $("#errorPetCode").css("display","block");
            $("#petCode").addClass("error");
            $("#petCode").removeClass("borderCajaTexto");
        }else{
            var formData = new FormData($(this).get(0)); //get(0) porque solo queremos los datos del form 
            $.ajax({
                url: '../php/nuevaMascotaCodigo.php',
                type: 'POST',
                processData: false,
                contentType: false,
                data: formData,
                success: function(data){ //lo que vuelve del php
                    if(data.includes(true)){ //includes porque data incluye el id de la mascota nueva y true
                        Swal.fire({
                            icon: "success",
                            title: "¡Genial!",
                            text: "¡Mascota añadida con éxito!"
                        })
                        .then(function() {
                            volverApagAnterior();
                        });
                    }else{
                        if(data == "noCodigo"){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "No existe ninguna mascota asociada a ese código"
                            }); 
                        }else if(data == "yaMascota"){
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Ya tienes asociada esta mascota"
                            }); 
                        }else{
                            Swal.fire({
                                icon: "error",
                                title: "Oops...",
                                text: "Se ha producido un fallo. "
                            }); 
                        }  
                    }
                },
                error: function(error){ //error
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error
                    });
                }
            });
        }
    });
}

//envío del formulario con los datos de la mascota
function guardarMascotaDatos(){
    $("#formularioAltaMascota").on("submit",function(event){
        $("#petType")
        //evitamos acción predeterminada
        event.preventDefault();
        //eliminamos todos los espacios de antes y después
        let petNameValue = $("#petName").val().trim();
        $("#petName").val(petNameValue);
        var petWeightValue = $("#petWeight").val().trim(); 
        $("#petWeight").val(petWeightValue);

        //validamos los campos del formulario
        let valPetName = validateName($("#petName").val());
        let valPetDate= validateBornDate($("#petDate").val()); 
        let valPetWeight = validateFloatNumber(parseFloat($("#petWeight").val()));
        let validationPetName, validationPetDate, validationPetBreed, validationPetWeight, validationPetGender, validationPetChip = false;
       
        //nombre de mascota
        if(!valPetName || $("#petName").val()==""){
            $("#errorPetName").text("Formato no permitido");
            $("#errorPetName").css("display","block");
            $("#petName").addClass("error");
            $("#petName").removeClass("borderCajaTexto");
            validationPetName = false;
        }else{
            $("#errorPetName").text("");
            $("#errorPetName").css("display","none");
            $("#petName").removeClass("error");
            $("#petName").addClass("borderCajaTexto");
            validationPetName = true;
        }
        //fecha nacimiento de mascota
        if(!valPetDate && $("#petDate").val()!=""){
            $("#errorPetDate").text("Formato no permitido");
            $("#errorPetDate").css("display","block");
            $("#petDate").addClass("error");
            $("#petDate").removeClass("borderCajaTexto");
            validationPetDate = false;
        }else{
            $("#errorPetDate").text("");
            $("#errorPetDate").css("display","none");
            $("#petDate").removeClass("error");
            $("#petDate").addClass("borderCajaTexto");
            validationPetDate = true;
        }

        //Raza de la mascota
        if($("#petBreed").val() !== ""){
            if(!razasPerro.includes($("#petBreed").val())){
                $("#errorPetBreed").text("Debes elegir una raza válida");
                $("#errorPetBreed").css("display","block");
                $("#petBreed").addClass("error");
                $("#petBreed").removeClass("borderCajaTexto");
                validationPetBreed = false;
            }else{
                validationPetBreed = true;
            }
        }else{
            $("#errorPetBreed").text("");
            $("#errorPetBreed").css("display","none");
            $("#petBreed").removeClass("error");
            $("#petBreed").addClass("borderCajaTexto");
            validationPetBreed = true;
        } 
        
        //Peso de la mascota
        if(!valPetWeight && $("#petWeight").val()!=""){
            $("#errorPetWeight").text("Formato no permitido");
            $("#errorPetWeight").css("display","block");
            $("#petWeight").addClass("error");
            $("#petWeight").removeClass("borderCajaTexto");
            validationPetWeight = false;
        }else if(parseFloat($("#petWeight").val())<=0 || parseFloat($("#petWeight").val())>100){
            $("#errorPetWeight").text("Peso no válido. Entre 0.1 y 100 kg");
            $("#errorPetWeight").css("display","block");
            $("#petWeight").addClass("error");
            $("#petWeight").removeClass("borderCajaTexto");
            validationPetWeight = false;
        }else{
            $("#errorPetWeight").text("");
            $("#errorPetWeight").css("display","none");
            $("#petWeight").removeClass("error");
            $("#petWeight").addClass("borderCajaTexto");
            validationPetWeight = true;
        }

        
       if(validationPetName && validationPetDate && validationPetBreed && validationPetWeight ){
            var formData = new FormData($(this).get(0)); //get(0) porque solo queremos los datos del form 

            //enviamos form            
            $.ajax({
                url: '../php/nuevaMascota.php',
                type: 'POST',
                async: true,
                processData: false,
                contentType: false,
                data: formData,
                success: function(data){ //lo que vuelve del php
                    if(data.includes(true)){ //includes porque data incluye el id de la mascota nueva y true
                        Swal.fire({
                            icon: "success",
                            title: "¡Genial!",
                            text: "¡Mascota añadida con éxito!"
                        })
                        .then(function() {
                            volverApagAnterior();
                        });
                    }else{
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "Se ha producido un fallo"
                        }); 
                    }
                },
                error: function(error){ //error
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: error
                    });
                }
            });
        }
    });//fin submit

}