
let usuario ="";
let mascotas = "";

$(document).ready(function(){

    ajustarContenedor(); //si página menos height que pantalla, se ajustar contenedor

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


    // --------------------------------------------
    // --DATOS USUARIO-----------------------------
    // --------------------------------------------
    //Mostramos el nombre de usuario
    $("#nUsuario").html(usuario.nombre);

    //Mostramos la foto
    let src = fotoUsuario(usuario.foto);
    $(".imgUsuario").html(`<img src='${src}' id='img'>`);

    //Mostramos la fecha
    mostrarFecha();

    //responsive
    //Si hacemos pequeña la pantalla y utilizamos los botones Mascotas y Recordatorios, al hacer de nuevo grande la pantalla fallan los estilos de los contenedores de las mascotas y recordatorios. Con esto lo evitamos
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            $(".contenedorMascotas").css("display","block");
            $(".contenedorRecordatorios").css("display","block");
        }else{
            if($("#btnVerMascotas").hasClass("selected")){
                $(".contenedorMascotas").css("display","block");
                $(".contenedorRecordatorios").css("display","none");
            }else if($("#btnVerRecordatorios").hasClass("selected")){
                $(".contenedorMascotas").css("display","none");
                $(".contenedorRecordatorios").css("display","block");
            }
        }
    });

    // ----------------------------------------------
    // --BTN AÑADIR MASCOTA--------------------------
    // ----------------------------------------------
    //Botón añadir mascota
    $("#btnAddMascota").on("click",function(){
        location.href = "nuevaMascota.html";
    });

    //mostramos las mascotas del usuario
    mostrarMascotas(mascotas);

    //Ver los recordatorios
    verReminder(mascotas);

    // ----------------------------------------------
    // --BTN AÑADIR RECORDATORIO --------------------
    // ----------------------------------------------
    /***  funcion ver modal  AÑADIR RECORDATORIO***/
    $('#btnAddReminder').on('click', function(){
        $('.modalAddReminder').css('display', 'flex');
    // reseta el valor de los inputs cuando se abre el modal
        $('#petAddReminder').val("");
        $("#petAddReminder").removeClass('error');
        $('#detailsAddReminder').val("");
        $("#detailsAddReminder").removeClass('error');
        $('#dateAddReminder').val("");
        $("#dateAddReminder").removeClass('error');
        $('#typeAddReminder').val("");
        $("#typeAddReminder").removeClass('error');
        $('#nameTypeAddReminder').val("");
        $("#nameTypeAddReminder").removeClass('error');
        $('.circlesColor').css('border', '2px solid transparent');
        
    });
    /***  funcion cerrar modal  AÑADIR RECORDATORIO***/
    $('#closeAddReminder').click(function(){
        $('.modalAddReminder').css('display', 'none');
    });
    //Ver datos en el modal add reminder
    $('#btnAddReminder').on('click', showUserPets(mascotas));
    $('#btnAddReminder').on('click', showTypeReminder());

    /************  GUARDAR RECORDATORIO ************/
    $('#formAddReminder').on('submit', function(event){
        event.preventDefault();

        //Validaciones
        var valPet= validateOption($('#petAddReminder').val());
        var valDetails = validateInputText($('#detailsAddReminder').val());
        var valPlannedDate = validateDate($('#dateAddReminder').val());
        var valTypeSelect = validateOption($('#typeAddReminder').val());
        var valTypeNameSelect = validateOption($('#nameTypeAddReminder').val());
        var valColorPetReminder = validateOption($('#selectedColor').val());

        if(!valPet || $('#petAddReminder').val() ==""){
            $("#errorMascota").val("Formato Incorrecto");
            $("#petAddReminder").addClass('error');
            $('#petAddReminder').val("");
        }else{
            $("#errorMascota").val("");
            $("#petAddReminder").removeClass('error');
        }

        if(!valDetails){
            $("#errorDetails").val("Formato Incorrecto");
            $("#detailsAddReminder").addClass('error');
            $('#detailsAddReminder').val("");
        }else{
            $("#errorDetails").val("");
            $("#detailsAddReminder").removeClass('error');
        }

        if(!valPlannedDate || $('#dateAddReminder').val() ==""){
            $("#errorDate").html("Formato Incorrecto"); 
            $("#dateAddReminder").addClass('error');
            $('#dateAddReminder').val("");
        }else{
            $("#errorDate").html(""); 
            $("#dateAddReminder").removeClass('error');
        }

        if(!valTypeSelect || $('#typeAddReminder').val() ==""){
            $("#errorSelect").html("Formato Incorrecto"); 
            $("#typeAddReminder").addClass('error');
        }else{
            $("#errorSelect").html(""); 
            $("#typeAddReminder").removeClass('error');
        }

        if(!valTypeNameSelect || $('#nameTypeAddReminder').val() ==""){
            $("#errorSelect").html("Formato Incorrecto"); 
            $("#nameTypeAddReminder").addClass('error');
        }else{
            $("#errorSelect").html(""); 
            $("#nameTypeAddReminder").removeClass('error');
        }

        if(!valColorPetReminder || $('#selectedColor').val()==""){
            $('#selectedColor').val('PaleGreen');
        }

    if(valPet && valDetails && valPlannedDate && valTypeSelect && valTypeNameSelect){
            var formData = new FormData($(this).get(0));
                $.ajax({
                    url: '../php/calendar/add_reminder.php',
                    type: 'POST',
                    data: formData,
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(response){
                        verReminder(mascotas);
                        Swal.fire({
                            icon: "success",
                            title: "¡Genia!",
                            text: "¡Recordatorio añadido!"
                        })
                        .then(function() {
                            descargarIcs();//si se marca la opción de descargar recordatorio, lo descargamos
                            $('.modalAddReminder').css('display', 'none');
                        });  
                    },
                    error: function(error){ //error
                        console.log("error ",error);
                    }
                }); //ajax

        }//if validation

    });
    /************  FIN GURARDAR RECORDATORIO ************/

}); //document ready

/************* ICS  **************/
    //función para descargar el recordatorio en formato .ics
    function descargarIcs(){
        if($("#checkReminder").is(':checked')){
            let pet= $('#petAddReminder option:selected').text();
            let titulo = pet + " - " +  $('#nameTypeAddReminder option:selected').text()  + " ("+ $('#typeAddReminder').val() + ") ";
            let description = $('#detailsAddReminder').val();
            //misma fecha de inicio y final
            let fecha = $('#dateAddReminder').val().split('-').map(Number);
           
            let event={
                title: titulo,
                description: description,
                start: fecha,
                end: fecha
            };
            var cal=ics();
            cal.addEvent(event.title, event.description, '', event.start, event.end);
            cal.download('Recordatorio_'+pet + "_" +  $('#nameTypeAddReminder option:selected').text()  + "_"+ $('#typeAddReminder').val() + "_" +$('#dateAddReminder').val());
        }
    }

//función que ajusta la altura del contenedor del cuerpo para, en caso de que está sea más pequeña que la altura de la ventana, tenga la altura suficiente para que el footer o el contenedor no se queden "colgando" en mitad de la pantalla
function ajustarContenedor(){
    var alturaVentana = $(window).height(); //altura de la ventana
    var alturaPie = $('footer').outerHeight(); //altura del footer
    var alturaContainer = alturaVentana - alturaPie; //altura del contenedor para que ocupase la página toda la altura de la ventana

    //contenedor blanco
    if($(".container").height() < alturaContainer){
        $(".container").css("min-height",alturaContainer+"px");
    }else{
        $(".container").css("height","100%");
    }
    if($("#container").width()< 750){
        //contenedores de mascotas y recordatorios. Se toma como altura mínima la altura del más largo
        if($(".contenedorRecordatorios").height() > $(".contenedorMascotas").height()){
            $(".contenedorMascotas").css("min-height",$(".contenedorRecordatorios").height()+40+"px");
        }else if($(".contenedorRecordatorios").height() <= $(".contenedorMascotas").height()){
            $(".contenedorRecordatorios").css("min-height",$(".contenedorMascotas").height()+40+"px");
        }
    }else{
        $(".contenedorMascotas").css("min-height",420+"px");
        $(".contenedorRecordatorios").css("min-height",420+"px");
    }
    
}

//Obtener fecha y mostrarla en panel 
function mostrarFecha(){
    //Mostramos la fecha
    let fecha = new Date(); //fecha
    let diaLetra = fecha.getDay(); //día de la semana (lunes a domingo (0 a 7))
    let diaNum = fecha.getDate(); //día de la semana (nº día del mes)
    let mes = fecha.getMonth(); //mes
    let anyo = fecha.getFullYear(); //año
    let diasSemana = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
    let mesesAnyo = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    //montamos la fecha y la mostramos
    let fechaFormateada = `${diaNum} de ${mesesAnyo[mes]} de ${anyo}`;
    $("#diaSemana").html(`${diasSemana[diaLetra]},`);
    $("#fecha").html(fechaFormateada);
}

//obtener foto de usuario
function fotoUsuario(foto){
    let src = "";
    if(foto == "" || foto == null){ //si no hay foto, mostramos una genérica
        src = "../img/user/avatar1.png";
    }else{ //si existe foto, la mostramos
        src = `data:image/jpg;base64,${foto}`;
    }
    return src;
}

//mostrar mascotas en panel. 
function mostrarMascotas(mascotas){
    //Creamos las tarjetas de las mascotas
    let tarjetaMascotas = "";
    //creamos todas las tarjetas en una variable y luego lo añadimos al contenedor de mascotas
    for(let i=0;i<mascotas.length;i++){
        tarjetaMascotas += "<div class='tarjetaMascota'>";
        tarjetaMascotas += "<div class='datosMascota'>";
        if(mascotas[i].foto != ""){ //comprobamos si la mascota tiene foto o no
            tarjetaMascotas += "<img class='imgMascota' src='data:image/jpg;base64,"+mascotas[i].foto+"' alt='"+mascotas[i].nombre+"'>";
        }else{
            tarjetaMascotas += "<img class='imgMascota' src='../img/pet/dog1.png' alt='"+mascotas[i].nombre+"'>";
        }
        tarjetaMascotas += "<h3 class='nombreMascota'>"+mascotas[i].nombre+"</h3>";
        tarjetaMascotas += "</div>";
        //icono mascota
         //cambiamos el icono en función de la mascota
        let urlIconoMascota = "";
        switch (mascotas[i].tipo){
            case "Perro":
                urlIconoMascota = "icono_perro.PNG";
                break;
        }
        tarjetaMascotas += "<img src='../img/pet/"+urlIconoMascota+"' alt='icono perro' class='iconoMascota'>"
        tarjetaMascotas += "</div>";
    }
    $("#pets").html(tarjetaMascotas);
}

function verDetallesMascota(petId){
    $('.modalPetDetails').css('display', 'block');
}

//función ver mascota o recordatorio (responsive)
//cambiamos los estilos de forma dinámica en función de si queremos ver las mascotas o los recordatorios
function verSeccion(seccion){
    switch (seccion){
        case "mascotas":
            //pestañas
            $("#btnVerMascotas").css("background-color","#d0f0f4");
            $("#btnVerMascotas").css("border-bottom","none");
            $("#btnVerMascotas").addClass("selected");
            $("#btnVerRecordatorios").css("border-bottom","#ade3e9");
            $("#btnVerRecordatorios").css("background-color","#ade3e9");
            $("#btnVerRecordatorios").removeClass("selected");
            //contenedores
            $(".contenedorMascotas").css("display","block");
            $(".contenedorRecordatorios").css("display","none");
            ajustarContenedor();
            break;
        case "recordatorios":
            //pestañas
            $("#btnVerMascotas").css("background-color","#ade3e9");
            $("#btnVerMascotas").css("border-bottom","#ade3e9");
            $("#btnVerMascotas").removeClass("selected");
            $("#btnVerRecordatorios").css("border-bottom","none");
            $("#btnVerRecordatorios").css("background-color","#d0f0f4");
            $("#btnVerRecordatorios").addClass("selected");
            //contenedores
            $(".contenedorMascotas").css("display","none");
            $(".contenedorRecordatorios").css("display","block");
            ajustarContenedor();
            break;
    }
}



/************** FUNCIONES PARA AÑADIR RECORDATORIOS  ************/

/************  VER MASCOTAS DEL USUARIO ************/
function showUserPets(mascotas){
    if(mascotas!=""){
        for(cont=0; cont<mascotas.length; cont++){
            var petsName = mascotas[cont].nombre;
            var petids= mascotas[cont].id;
            $('#petAddReminder').append(' <option value="'+petids+'" id="'+petsName+'">'+petsName+'</option>');
        }//for de recordatorios
    }//recordatorios distinto de vacio
}//ver mascotas en el select de add recordatorio

/************  VER TIPOS DE RECORDATORIO ************/
function showTypeReminder(){

    /*****  SACAR TIPOS RECORDATORIO *****/
     var tipos= new Array();
     var idstipos= new Array();
        $.ajax({
            url: '../php/calendar/type_reminder.php',
            type: 'POST',
            dataType:'json',
        
            success: function(response){
               //Primero guardamos los datos un array 
               tipos = response;
                if(tipos!=""){
                    $('#typeAddReminder option').remove();
                    $('#typeAddReminder').append('<option value="">Seleccione una opción</option>');
                    for(cont=0; cont<tipos.length; cont++){
                        var typeReminder =tipos[cont];
                        $('#typeAddReminder').append(' <option value="'+typeReminder+'">'+typeReminder+'</option>');
                    }//for de recordatorios
                }//recordatorios distinto de vacio
            },
            error: function(error){ //error
                //console.log("error ",error);
            }
        });
    
    /***** SACAR EL NOMBRE DEL TIPO *****/
        $('#typeAddReminder').on('change', function() {
            $('#nameTypeAddReminder option').remove();
            $('#nameTypeAddReminder').append('<option value="">Seleccione una opción</option>');

            var type = $('#typeAddReminder').val();
            $.ajax({
                url: '../php/calendar/name_type_reminder.php',
                type: 'POST',
                dataType:'json',
                data: {tipo: type}, //user_name corresponde al user_name de la variable POST
            
                success: function(response){
                   //Primero guardamos los datos un array 
                   tipos = response;
                   nombreTipos = response.map(item=>item[1]);
                   idstipos = response.map(item=>item[0]);
                    if(tipos!=""){
        
                        for(cont=0; cont<nombreTipos.length; cont++){
                            var nameType =nombreTipos[cont];
                            var typeid= idstipos[cont];
                            $('#nameTypeAddReminder').append(' <option value="'+typeid+'" id="'+nameType+'">'+nameType+'</option>');
                        }//for de recordatorios
                    }//recordatorios distinto de vacio
                },
                error: function(error){ //error
                    console.log("error ",error);
                }
            });
        });//sacar el nombre del tipo
    
    }//ver tipos de recordatorio
/************ FIN VER TIPOS DE RECORDATORIO ************/
/********* COLORES DE LA MASCOTA *********/
function createDivColores(){
    let colores =['Pink', 'Coral', 'Gold', 'PaleGreen', 'MediumAquamarine', 'DeepSkyBlue', 'Violet'];
    for(let i =0; i< colores.length; i++){
        $('#colorPetAddReminder').append('<input type= "button" class="circlesColor colorPet'+i+'" id="colorPet'+i+'" value="'+colores[i]+'"></input>');   
        $('.colorPet'+i).css('background-color', colores[i]);
        $('.colorPet'+i).css('color', colores[i]);
    }
} 
createDivColores();

$('.circlesColor').on('click', function(){
    $('.circlesColor').css('border', '2px solid transparent');
    $(this).css('border', '2px solid #000');
    var color = $(this).val();
    $('#selectedColor').val(color);
});

/************  MOSTRAR RECORDATORIO ************/
function verReminder(mascotas){
    $('#showreminders div').remove();

     var idsMascotas = $.map(mascotas, function(pet){
        return pet.id;
     });
     var nombresMascotas = $.map(mascotas, function(pet){
        return pet.nombre;
     });

    //var colorReminder= generarColorPastel();
    var recordatorios= new Array();
    $.ajax({
        url: '../php/calendar/showUserReminders.php',
        type: 'POST',
        dataType:'json',

        success: function(response){
        //Primero guardamos los datos un array 
            recordatorios = response;
            if(recordatorios!=""){
                recordatoriosOrdenados =  recordatorios.sort(orderDates);
                //sacamos lo ids de los div que acabamos de pintar
                let existingReminderDates = $('.dates').map(function () {
                    return this.id;
                }).get();
                //pintamos las fechas a parte de las tarjetas
                fechasConRecordatorios = recordatorios.map(item=>item[4]); //esta contiene fechas repetidas
                let fechasReminder = [...new Set(fechasConRecordatorios)]; //sin fechas repes
                for(let i =0; i< fechasReminder.length;i++){
                    if (!existingReminderDates.includes(fechasReminder[i])) {                       
                        dates= new Date(fechasReminder[i]);
                        hoy = new Date();
                        if(dates.getMonth() +1 == hoy.getMonth() +1){
                            if(dates.getDate() >= hoy.getDate()){
                                $('#showreminders').append(' <div id="'+fechasReminder[i]+'" class="dates">');
                                //cambiar el formato de la fecha con la librería moment.
                                let fechaFormato = moment(dates).format("DD-MM-YYYY");
                                $('#'+fechasReminder[i]).append('<p class="fechasReminder">'+fechaFormato+'</p>');
                            }
                        }
                    }
                }

                //sacamos las tajetasrecordatorios
                let existingReminderIds = $('.tarjetaRecordatorio').map(function () {
                    return this.id;
                }).get();

                tarjetas =0;
                    for(let cont=0; cont<recordatorios.length; cont++){
                        idReminder = recordatorios.map(item=>item[0]); //id del recordatorio
                        idPet = recordatorios.map(item=>item[1]);//id de la mascota
                        detalleReminder = recordatorios.map(item=>item[2]); // detalles del recordatorio
                        colorReminder = recordatorios.map(item=>item[3]); // color del recordatorio
                        plannedDate = recordatorios.map(item=>item[4]); //fecha_prevista del recordatorio
                        idTypeReminder =recordatorios.map(item=>item[7]); //id e del tipo de recordatorio.
                        typeReminder =recordatorios.map(item=>item[8]); // tipo de recordatorio.
                      ///sacar el nombre de las mascota

                      if(idsMascotas.includes(idPet[cont])){
                        //buscado en qué posicion del array mascotas está el idPet
                        let position =$.inArray(idPet[cont], idsMascotas);
                        var namePet= nombresMascotas[position];
                      }
                        date= new Date(plannedDate[cont]);
                        hoy = new Date();
                        if(date.getMonth() +1 == hoy.getMonth() +1){
                            if(date.getDate() >= hoy.getDate()){
                        // mostramos solo los del semana?
                                if (!existingReminderIds.includes(idReminder[cont])) {                                  
                                    var html_card= "<div id='"+idReminder[cont]+"' class='tarjetaRecordatorio' style='background-color:"+colorReminder[cont]+"';><div id='"+idPet[cont]+"' class='datosRecordatorio'> <h4>"+typeReminder[cont]+"</h4><h6>"+detalleReminder[cont]+"</h6></div><div class='fechaRecordatorio'><p>"+namePet+"</p></div></div>";
                                    $('#'+plannedDate[cont]).append(html_card);

                                    tarjetas++;
                                } 
                            }// de la semana 
                        }//del mes
                        if(tarjetas === 5){
                            break;
                        }
                    }//for de recordatorios
                    //borramos los div de fechas que esten vacios.
                    for(let i =0; i< fechasReminder.length;i++){ 
                        if(!$('#'+fechasReminder[i]).find('.tarjetaRecordatorio').length){
                            $('#'+fechasReminder[i]).remove();
                        }
                    }
            }//recordatorios distinto de vacio
        },
        error: function(error){ //error
            console.log("error ",error);
        }
    });
}
/************ FIN MOSTRAR RECORDATORIO ************/
/*********** ORDENAR FECHAS DE LOS ARRAY ************/
function orderDates(a, b) {
    var fecha1 = new Date(a[4]);
    var fecha2 = new Date(b[4]);
    return fecha1 - fecha2;
}