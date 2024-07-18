let usuario = "";
let mascotas = "";
let razasPerro = [];
let formularioAntesEditar = "";

$(document).ready(function(){

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
                mascotas = usuario.mascotas;
                
                //permisos
                if(usuario["tipo"] == "admin"){ //si el usuario es admin, se muestra esta opción
                    $("#adminUsuarios").css("display","block");
                }
            }
        }
    });

    //si no hay mascotas, no mostramos las fichas
    comprobarMascotas();

    //volver a página principal al pulsar Volver
    volverAprincipal();

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
                for(let i=0;i<data.razas_perros.length;i++){
                    razasPerro.push(data.razas_perros[i]); 
                }
                $("#petBreed").autocomplete({
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

    //posición del pie
    ajustarPosicionPie();
    $(window).resize(ajustarPosicionPie);


});//fin document.ready

function comprobarMascotas(){
    if(mascotas.length == 0){
        $(".contenedorFichaMascota").html("Aún no hay mascotas registradas.");
        $(".contenedorFichaMascota").addClass("sinMascota");
        ajustarContenedor();
    }
    crearSelectoresMascotas(mascotas); //mostramos los botones de las mascotas  
}

//función para cambiar el estilo de la pestaña seleccionada
function seleccionar(id){
    let tabList = $(".tabList .tabItem");
    for(let pos = 0;pos<tabList.length;pos++){
        if(tabList[pos].id == id){
            $(`#${tabList[pos].id}`).addClass("active");
        }else{
            $(`#${tabList[pos].id}`).removeClass("active");
        }
    }
    mostrarFichaMascota(id);
}

//función para mostrar los datos de las fichas de las mascotas
function mostrarFichaMascota(id){
    for(let pos=0;pos<mascotas.length;pos++){
        if(mascotas[pos].id == id){
            let mascota = mascotas[pos];
            datosMascota(mascota); 
        }
    }
}

//función para crear y mostrar los botones de las distintas mascotas
function crearSelectoresMascotas(mascotas){
    let pestanyasMascotas = "";
    //Creamos el botón de nueva mascota
    pestanyasMascotas += `<li class="tabAdd" id="btnAddMascota">Nueva</li>`;

    //Creamos las pestañas de las mascotas (si hay)
    if(mascotas.length > 0){
        for(let i=0;i<mascotas.length;i++){
            pestanyasMascotas += `<li class="tabItem" id="${mascotas[i].id}" onclick="seleccionar('${mascotas[i].id}')">${mascotas[i].nombre}</li>`
        }  
        $("#listaPestanyas").html(pestanyasMascotas);
        //seleccionamos la etiqueta de la primera mascota que se muestra
        $(".tabList .tabItem:first").addClass("active");
        //mostramos la primera ficha
        datosMascota(mascotas[0]); 
    }else{
        $("#listaPestanyas").html(pestanyasMascotas);
    }
    //si pulsamos Nueva mascota nos redirige a la página de Añadir mascota
    $("#btnAddMascota").on("click",function(){
        window.location= "../vistas/nuevaMascota.html?pag=vista";
    })

}

//Función que rellena las fichas de las mascotas
function datosMascota(mascota){
    let imagen = "";
    reactivarEditar(mascota.id);
    $(".fichaMascota").attr("id",`fichaMascota${mascota.id}`);
    $("#btnGuardar").css("display","none").attr("onclick",`actualizarMascota('${mascota.id}')`);
    $("#btnEditarMascota").attr("onclick",`activarEditar('${mascota.id}')`);
    $("#btnCancelarMascota").attr("onclick",`cancelarEditar('${mascota.id}')`);
    $("#btnEliminarMascota").attr("onclick",`eliminarMascota('${mascota.id}')`);
    $(".contenedorImagenMascota").attr("id",`contenedorImagenMascota${mascota.id}`);
    //mostramos la foto en función de si tiene una guardada o no
    $(".contenedorImagenMascota").html("");//primero vacíamos el contenedor de la imagen por si había alguna foto
    if(mascota.foto != ""){
        imagen = `<img class='imgMascota' src='data:image/jpg;base64,${mascota.foto}' alt='${mascota.nombre}'>`;
    }else{
        imagen = `<img class='imgMascota' src='../img/pet/dog1.png' alt='${mascota.nombre}'>`;
    }
    $(".contenedorImagenMascota").append(imagen);
    $(".subirImg").attr("id",`subirImg${mascota.id}`).css("display","none").attr("onclick",`pulsarFile('${mascota.id}')`);
    $("#petName").val(mascota.nombre);
    $("#petCode").val(mascota.codigo);
    //mostramos fecha de nacimiento, si la tiene
    if(mascota.fecha_nacimiento != "0000-00-00"){
        $("#petDate").val(mascota.fecha_nacimiento);
    }else{
        $("#petDate").val("");
    }
    $("#petType").val(mascota.tipo);
    $("#petBreed").val(mascota.raza);
    $("#petWeight").val(mascota.peso);
    $(".petImg").attr("id",`petImg${mascota.id}`).css("display","none");
    //marcamos el género
    if(mascota.genero == "hembra"){
        $("#petGenderFemale").attr("checked",true);
        $("#petGenderMale").attr("checked",false);
    }else if(mascota.genero == "macho"){
        $("#petGenderFemale").attr("checked",false);
        $("#petGenderMale").attr("checked",true);
    }else{
        $("#petGenderFemale").attr("checked",false);
        $("#petGenderMale").attr("checked",false);
    }
    //marcamos si tiene chip o no
    if(mascota.chip == "si"){
        $("#petChipTrue").attr("checked",true);
        $("#petChipFalse").attr("checked",false);
    }else if(mascota.chip == "no"){
        $("#petChipTrue").attr("checked",false);
        $("#petChipFalse").attr("checked",true);
    }else{
        $("#petChipTrue").attr("checked",false);
        $("#petChipFalse").attr("checked",false);
    }
    $(`#fichaMascota${mascota.id} input`).prop("disabled","disabled");

}

//formulario para editar. Mostramos botones guardar y cancelar y permitimos modificación del formulario
function activarEditar(petId){
    $(`#fichaMascota${petId} input`).removeAttr('disabled');//desbloqueamos campos
    $("#btnEditarMascota").css("display","none");//ocultamos botón editar
    $("#btnGuardar").css("display","block");//mostramos botón guardar
    $("#btnEliminarMascota").css("display","none");//ocultamos botón eliminar mascota
    $("#btnCancelarMascota").css("display","block");//mostramos botón cancelar
    $(`#subirImg${petId}`).css("display","block");//mostramos botón input file
    dragAndDropImagen(petId);//permitimos drag&drop
}

//volver a bloquear la ficha y mostrar los botones editar y eliminar
function reactivarEditar(petId){
    $(`#fichaMascota${petId} input`).prop("disabled","disabled"); //desactivamos campos
    $("#btnEditarMascota").css("display","block");//mostramos botón editar
    $("#btnGuardar").css("display","none");///ocultamos botón guardar
    $("#btnEliminarMascota").css("display","block");//mostramos botón eliminar
    $("#btnCancelarMascota").css("display","none");//ocultamos botón cancelar
    $(`#subirImg${petId}`).css("display","none");//ocultamos el botón de subir imagen
    //deshabilitamos drag&drop
    $(`#contenedorImagenMascota${petId}`).off('dragover');
    $(`#contenedorImagenMascota${petId}`).off('dragleave');
    $(`#contenedorImagenMascota${petId}`).off('drop');
}

//Cancelar editar mascota
function cancelarEditar(petId){
    //limpiamos los errores que se estén mostrando
    $("#petName").removeClass("error");
    $("#petDate").removeClass("error");
    $("#petBreed").removeClass("error");
    $("#petWeight").removeClass("error");
    $("#errorPetName").css("display","none");
    $("#errorPetDate").css("display","none");
    $("#errorPetBreed").css("display","none");
    $("#errorPetWeight").css("display","none");
    $("#errorChip").css("display","none");
    mostrarFichaMascota(petId);
    reactivarEditar(petId);
    
}

function actualizarMascota(petId){
    let formulario = $(`#fichaMascota${petId}`);
    //Desactivamos eventos submit anteriores
    formulario.off("submit");
    //envío del formulario
    formulario .on("submit",function(event){
        //evitamos acción predeterminada
        event.preventDefault();
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
                $("#errorPetBreed").text("");
                $("#errorPetBreed").css("display","none");
                $("#petBreed").removeClass("error");
                $("#petBreed").addClass("borderCajaTexto");
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
        }else{
            if(parseFloat($("#petWeight").val())<0 || parseFloat($("#petWeight").val())>100){
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
        }

        if(validationPetName && validationPetDate && validationPetBreed && validationPetWeight){
            var formData = new FormData($(this).get(0)); //get(0) porque solo queremos los datos del form 
            formData.append("pet_id",petId);

            //enviamos form            
            $.ajax({
                url: '../php/actualizarMascota.php',
                type: 'POST',
                processData: false,
                contentType: false,
                data: formData,
                success: function(data){ //lo que vuelve del php
                    datos = JSON.parse(data);
                    if(datos["result"] == true){
                        Swal.fire({
                            icon: "success",
                            title: "¡Genial!",
                            text: "¡Mascota actualizada con éxito!"
                        })
                        .then(function(){
                            let mascotasActualizada = datos["data"]["mascotas"];
                            mascotas = mascotasActualizada;
                            comprobarMascotas();
                            if(mascotas.length>0){
                                seleccionar(petId);
                                reactivarEditar(petId);
                                mostrarFichaMascota(petId);    
                                $(`#contenedorImagenMascota${petId}`).off('dragover');
                                $(`#contenedorImagenMascota${petId}`).off('dragleave');
                                $(`#contenedorImagenMascota${petId}`).off('drop');
                            }
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
                        text: "Se ha producido un fallo"
                    });
                }
            });
        }

    });//fin submit
}

//volver a página principal
function volverAprincipal(){
    $("#btnVolver").on("click",function(){
        window.location ='../vistas/principal.html';
    })
}

//Ajuster contenedor a la altura de la ventana
function ajustarContenedor(){
    var alturaVentana = $(window).height();
    var alturaPie = $('footer').outerHeight();
    var alturaContainer = alturaVentana - alturaPie;

    $(".container").css("height",alturaContainer);
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

function pulsarFile(petId){
    $(`#petImg${petId}`).trigger('click');
    $(`#contenedorImagenMascota${petId}`).off('dragover');
    $(`#contenedorImagenMascota${petId}`).off('dragleave');
    $(`#contenedorImagenMascota${petId}`).off('drop');
}

/*------- funciones relativas a la imagen ---------*/
//arrastrar y soltar la imagen
function dragAndDropImagen(petId){

    var dropArea = $(`#contenedorImagenMascota${petId}`);//contenedor imagen
    var fileElem = $(`#petImg${petId}`); //input tipo file

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

    fileElem.on('change', function(e) { //si cambia el contenido del input, recogemos el nuevo
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
            return;
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

//Eliminar mascota
function eliminarMascota(id){
    //buscamos la mascota con el id = parámetro
    let mascota = mascotas.find(mascota=>mascota.id == id);
    Swal.fire({
        title: `${mascota.nombre}`,
        text: "¿Seguro que quieres borrar esta mascota de tu cuenta?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Eliminar"
    }).then((result) => {
        if (result.isConfirmed) { //una vez confirmada la eliminación
            //aqui borramos         
            $.ajax({
                url: '../php/eliminarMascota.php',
                type: 'POST',
                data: {id:id},
                success: function(data){ //lo que vuelve del php
                   datos = JSON.parse(data);
                  
                    if(datos["result"] == "noRecordatorios"){
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "No se han podido eliminar los recordatorios asociados a la mascota"
                        }); 
                    }else if(datos["result"] == true){
                        Swal.fire("¡Mascota eliminada con éxito!")
                        .then(function(){
                            //actualizamos mascotas
                            let mascotasActualizada = datos["data"]["mascotas"]; 
                            mascotas = mascotasActualizada;
                            //completamos las fichas
                            comprobarMascotas();
                            if(mascotas.length>0){
                                crearSelectoresMascotas(mascotas);
                            }
                        });
                    }else{
                        Swal.fire({
                            icon: "error",
                            title: "Oops...",
                            text: "No se ha podido eliminar la mascota"
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
    });
}