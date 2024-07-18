
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
                let usuario = JSON.parse(data);
                //permisos
                if(usuario["tipo"] == "admin"){ //si el usuario es admin, se muestra esta opción
                    $("#adminUsuarios").css("display","block");
                }
            }
        }
    });

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
    $("#typeAddReminder").val('');
    $("#typeAddReminder").removeClass('error');
    $('#nameTypeAddReminder option').remove();
    $('#nameTypeAddReminder').append('<option value="">Seleccione una opción</option>');
    $("#nameTypeAddReminder").removeClass('error'); 
    $('.circlesColor').css('border', '2px solid transparent');
});

/***  funcion cerrar modal  AÑADIR RECORDATORIO***/
$('#closeAddReminder').click(function(){
    $('.modalAddReminder').css('display', 'none');
    //falta resetear botones??
});

//SACAR DATOS PARA EL FORMULARIO DEL MODAL ADD RECORDATORIO

/*****  SACAR MASCOTAS DEL USUARIO *****/
function userPetsSelect(){

    var pets= new Array();
    var ids= new Array();
        $.ajax({
            url: '../php/calendar/sacarNamePet.php',
            type: 'POST',
            dataType:'json',
        
            success: function(response){
            //Primero guardamos los datos un array 
            pets = response.map(item =>item[1]); //saca solo los nombres de las mascotas
            ids= response.map(item=>item[0]); //saca los ids de las mascotas
                if(pets!=""){
                    for(cont=0; cont<pets.length; cont++){
                        var petsName =pets[cont];
                        var petids= ids[cont];
                        $('#petAddReminder').append(' <option value="'+petids+'" id="'+petsName+'">'+petsName+'</option>');
                    }//for de recordatorios
                }//recordatorios distinto de vacio
            },
            error: function(error){ //error
                console.log("error ",error);
            }
        });
}
//LLAMADA A LA FUNCION DESDE EL MODAL
$('#btnAddReminder').on('click', userPetsSelect()); 

/********* COLORES DE LA MASCOTA *********/
function createDivColores(){
    //crea el selector de colores
    let colores =['Pink', 'Coral', 'Gold', 'PaleGreen', 'MediumAquamarine', 'DeepSkyBlue', 'Violet'];
    for(let i =0; i< colores.length; i++){
        $('#colorPetAddReminder').append('<input type= "button" class="circlesColor colorPet'+i+'" id="colorPet'+i+'" value="'+colores[i]+'"></input>');   
        $('.colorPet'+i).css('background-color', colores[i]);
        $('.colorPet'+i).css('color', colores[i]);
    }
} 
createDivColores();

$('.circlesColor').on('click', function(){
    //cambia el borde del color seleccionado
    $('.circlesColor').css('border', '2px solid transparent');
    $(this).css('border', '2px solid #000');
    var color = $(this).val();
    $('#selectedColor').val(color);
});

/*************************** CHECKS MASCOTAS ***************************/
showCheckPets();
function showCheckPets(){
    var nombre= new Array();
    var ids= new Array();
        $.ajax({
            url: '../php/calendar/sacarNamePet.php',
            type: 'POST',
            dataType:'json',
            success: function(response){
            //Primero guardamos los datos un array 
            nombre = response.map(item =>item[1]); //saca solo los nombres de las mascotas
            ids= response.map(item=>item[0]); //saca los ids de las mascotas
                if(nombre!=""){
                    $('#pets p').remove();
                    for(var i =0; i<nombre.length; i++){
                        $('#pets').append('<p class="checkNamePet"><input type="checkbox" class="checkForm" id="'+ids[i]+'" checked>'+nombre[i]+'</p>')
                    }
                    ids.forEach(function(id) {
                        verReminder(id); 
                     });
                    $('.checkForm').on('change', function() {
                        // Verifica si el checkbox ha sido seleccionado
                        if ($(this).is(':checked')) {
                            // Si ha sido seleccionado, obtenemos el ID y llamamos a verReminder
                            var id = $(this).attr("id");
                            verReminder(id);
                        }else{
                            var id = $(this).attr("id");
                            $('.' + id + '_reminder').remove();
                        }
                    });
                }//recordatorios distinto de vacio
                
            },
            error: function(error){ //error
                console.log("error ",error);
            }
        });
}

/************  VER TIPOS DE RECORDATORIO ************/
/*****  SACAR TIPOS Y NOMBRE DE RECORDATORIO *****/
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
            console.log("error ",error);
        }
    });

// SACAR EL NOMBRE DEL TIPO
    $('#typeAddReminder').on('change', function() {
      
        var type = $('#typeAddReminder').val();
        $.ajax({
            url: '../php/calendar/name_type_reminder.php',
            type: 'POST',
            dataType:'json',
            data: {tipo: type}, //user_name corresponde al user_name de la variable POST
        
            success: function(response){
               //Primero guardamos los datos un array 
               tipos = response;
               nombreTipos = tipos.map(item=>item[1]);
               idstipos = tipos.map(item=>item[0]);
                if(tipos!=""){
                    $('#nameTypeAddReminder option').remove();
                    $('#nameTypeAddReminder').append('<option value="">Seleccione una opción</option>');
                    for(cont=0; cont<nombreTipos.length; cont++){
                        var nameType =nombreTipos[cont];
                        var typeid= idstipos[cont];
                        $('#nameTypeAddReminder').append(' <option value="'+typeid+'" id="'+nameType+'">'+nameType+'</option>');
                    }//for de recordatorios
                    tipos="";
                }//recordatorios distinto de vacio
            },
            error: function(error){ //error
                console.log("error ",error);
            }
        });
    });//sacar el nombre del tipo

/************  GURARDAR RECORDATORIO ************/
$('#formAddReminder').on('submit', function(event){
    event.preventDefault();

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
                    verReminder($('#petAddReminder').val());                  
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

/* FIN Guardar recordatorio */

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
    }//descargar el ics


/************  CALENDARIO  ************/
    var meses=Array("Enero", "Febrero", "Marzo", "Abril", "Mayo",
        "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre",
        "Diciembre");

        var fechaActual = new Date();
        var diaActual = fechaActual.getDate();
        var mesActual = fechaActual.getMonth();
        var yearActual = fechaActual.getFullYear();

        var fechas = $('#fechasMes');
        var mes = $('#mes');
        var year = $('#year');
        var inputPrevMes = $('#mesPrevio');
        var inputNextMes = $('#mesSiguiente');

 /************  Cambio de mes ************/   
        inputPrevMes.on('click', function(ev){ 
            ev.preventDefault(); 
            mesAnterior();           
        });
        inputNextMes.on('click',function(ev){ 
            ev.preventDefault(); 
            mesSiguiente();
        });

        mes.html(meses[mesActual]);
        year.html(yearActual);

// LLAMADA AL CALENDARIO
       escribirMeses(mesActual);

// FUNCIONES  DEL CALENDARIO
        //muestra los días del mes
    function escribirMeses(mes){
   
        //sacar el día y el mes del momento para que al cambiar el mes en el calendario no se marque un día que no es
        var hoy= new Date().getDate();
        var mesDeHoy= new Date().getMonth();
    
        //dias del mes anterior
        for(let i = diaCominezoMes(); i>0 ;i--){
            fechas.append('<div class="diaFecha pastdays"><div>'+(diasDelMes(mesActual-1)-(i-1))+'</div></div>');
        }//dias del mes anterior

    /* DIAS DEL MES ACTUAL */
        for(let i =1; i<=diasDelMes(mes); i++){

            if(i==hoy && mes == mesDeHoy){
                fechas.append('<div class="diaFecha today" id="dia'+i+'"><div>'+i+'</div></div>');
            }else{
                fechas.append('<div class="diaFecha" id="dia'+i+'"><div>'+i+'</div></div>');
            }
        }//dias del mes actual
        
        //dias del mes siguiente
        for(let i = diaFinalMes(); i<6; i++){
            fechas.append('<div class="diaFecha pastdays">'+(i-diaFinalMes()+1)+'</div>');
        }

    }// ver los días del mes
//saca los días del mes
    function diasDelMes(mes){
        if(mes === -1){mes = 11;}
        if(mes == 0 || mes == 2 || mes == 4  || mes == 6 || mes ==7  || mes ==9  || mes ==11){ return 31;}
        if( mes == 3 || mes ==5 || mes == 8 || mes ==10){ return 30;}
        if(mes==1){
            return yearBisiesto() ? 29:28;
        }
    } // dias del mes 28 30 31??
//saca si el año es bisiesto
    function yearBisiesto(){ // si el año es bisiesto devuelve true
        return ((yearActual%100 !==0) && (yearActual%4 === 0) || (yearActual%400 === 0));
    }// año bisiesto
//saca qué día de la semana es el día 1 del mes
    function diaCominezoMes(){
        let comienzo = new Date(yearActual, mesActual, 1); //nos dice en qué dia de la semana cae el día uno del mes
        return ((comienzo.getDay()-1) === -1 )? 6: comienzo.getDay()-1;

    } //que día de la semana comienza el mes
//Saca qué día de la semna acaba el mes
    function diaFinalMes(){
        let final = new Date(yearActual, mesActual, diasDelMes(mesActual)); //nos dice en qué dia de la semana cae el día uno del mes
        return ((final.getDay()-1) === -1 )? 6: final.getDay()-1;

    } //que día de la semana comienza el mes
//cambiar al mes anterior
    function mesAnterior(){

        if(mesActual !==0){//si no es enero 
            mesActual --;
        }else{//si es enero
            mesActual = 11;
            yearActual --;
        }
        setNuevaFecha();

    }// cambiar al mes anterior
//cambiar al mes siguiente
    function mesSiguiente(){
        if(mesActual !==11){//si no es diciembre
            mesActual ++;
        }else{//si es diciembre
            mesActual = 0;
            yearActual ++;
        }
        setNuevaFecha();

    }// cmabiar al mes siguiente
//Setear las nuevas fechas al cambiar el mes
    function setNuevaFecha(){
        fechaActual.setFullYear(yearActual, mesActual, diaActual);
        mes.html(meses[mesActual]);
        year.html(yearActual);
        fechas.html("");
        showCheckPets();
        escribirMeses(mesActual);
    }

/************  MOSTRAR RECORDATORIO ************/
function verReminder(idPet){

    //var colorReminder= generarColorPastel();
    var recordatorios= new Array();
    $.ajax({
        url: '../php/calendar/show_reminder.php',
        type: 'POST',
        dataType:'json',
        data: {id_pet: idPet}, //user_name corresponde al user_name de la variable POST
    
        success: function(response){
        //Primero guardamos los datos un array 
        recordatorios = response;

            if(recordatorios!=""){

                // Verificar la existencia de elementos .reminder con el mismo ID
                let existingReminderIds = $('.reminder').map(function () {
                    return this.id;
                }).get();

              for(let i =1; i<=diasDelMes(mesActual); i++){

                    for(let cont=0; cont<recordatorios.length; cont++){
                        
                        idReminder = recordatorios.map(item=>item[0]); //id del recordatorio
                        idPet = recordatorios.map(item=>item[1]);//id de la mascota
                        detalleReminder = recordatorios.map(item=>item[2]); // detalles del recordatorio
                        colorReminder = recordatorios.map(item=>item[3]); // color del recordatorio
                        plannedDate = recordatorios.map(item=>item[4]); //fecha_prevista del recordatorio
                        idTypeReminder =recordatorios.map(item=>item[7]); //id e del tipo de recordatorio.
                        typeReminder =recordatorios.map(item=>item[8]); // tipo de recordatorio.
                        date= new Date(plannedDate[cont]); //día
                        var reminderDay = date.getDate();
                        var reminderMes= date.getMonth()+1;
                        if( reminderDay == i && reminderMes == mesActual+1){
                            if(!$('#dia'+i).find('.reminder').length){
                                if($(`#fechasMes #${idReminder[cont]}`).length <= 0){ // el recordatorio se crea solo si no existe
                                    $('#dia'+i).append('<div id="'+idReminder[cont]+'" class="reminder '+idPet[cont]+'_reminder" onclick="verRecordatorio('+idReminder[cont]+')" style="background-color:'+colorReminder[cont]+';"><p class="textReminder">'+typeReminder[cont]+'</p></div>');
                                    reminderDay ="";
                                    reminderMes="";
                                }
                            }else{
                                // Si hay recordatorios en el día, verificamos si el ID ya está en uso
                                if (!existingReminderIds.includes(idReminder[cont])) { 
                                    if($(`#fechasMes #${idReminder[cont]}`).length <= 0){ // el recordatorio se crea solo si no existe
                                        $('#fechasMes #dia' + i).append('<div id="' + idReminder[cont] + '" class="reminder ' + idPet[cont] + '_reminder" onclick="verRecordatorio(' + idReminder[cont] + ')" style="background-color:'+colorReminder[cont]+';"><p class="textReminder">' + typeReminder[cont] + '</p></div>');
                                        reminderDay = "";
                                        reminderMes = "";
                                    }
                                }
                            }
                        }
                    }//for de recordatorios
                }//for para mostrar los recordatorios
                
            }//recordatorios distinto de vacio
        },
        error: function(error){ //error
            console.log("error ",error);
        }
    });
}
/************ FIN MOSTRAR RECORDATORIO ************/

/************ EDITAR RECORDATORIO *************/
$('#formEditReminder').on('submit', function(event){
    event.preventDefault();

    var valPet= validateOption($('#petEditReminder').val());
    var valDetails = validateInputText($('#detailsEditReminder').val());
    var valPlannedDate = validateDate($('#dateEditReminder').val());
    var valTypeSelect = validateOption($('#typeEditReminder').val());
    var valTypeNameSelect = validateOption($('#typeNameEditReminder').val());
    var valColorPetReminder = validateOption($('#selectedColorEdit').val());

    if(!valPet || $('#petEditReminder').val() ==""){
        $("#errorMascota").val("Formato Incorrecto");
        $("#petEditReminder").addClass('error');
        $('#petEditReminder').val("");
    }else{
        $("#errorMascota").val("");
        $("#petEditReminder").removeClass('error');
    }

    if(!valDetails){
        $("#errorDetails").val("Formato Incorrecto");
        $("#detailsEditReminder").addClass('error');
        $('#detailsEditReminder').val("");
    }else{
        $("#errorDetails").val("");
        $("#detailsEditReminder").removeClass('error');
    }

    if(!valPlannedDate || $('#dateEditReminder').val() ==""){
        $("#errorDate").html("Formato Incorrecto"); 
        $("#dateEditReminder").addClass('error');
        $('#dateEditReminder').val("");
    }else{
        $("#errorDate").html(""); 
        $("#dateEditReminder").removeClass('error');
    }

    if(!valTypeSelect || $('#typeEditReminder').val() ==""){
        $("#errorSelect").html("Formato Incorrecto"); 
        $("#typeEditReminder").addClass('error');
    }else{
        $("#errorSelect").html(""); 
        $("#typeEditReminder").removeClass('error');
    }

    if(!valTypeNameSelect || $('#typeNameEditReminder').val() ==""){
        $("#errorSelect").html("Formato Incorrecto"); 
        $("#typeNameEditReminder").addClass('error');
    }else{
        $("#errorSelect").html(""); 
        $("#typeNameEditReminder").removeClass('error');
    }

   if(valPet && valDetails && valPlannedDate && valTypeSelect && valTypeNameSelect){
        var formData = new FormData($(this).get(0));
        $.ajax({
            url: '../php/calendar/edit_reminder.php',
            type: 'POST',
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            success: function(response){
               var id = $('#idEditReminder').val();
               $('#'+id).remove();
                verReminder($('#petEditReminder').val());
                Swal.fire({
                    icon: "success",
                    title: "¡Genia!",
                    text: "¡Recordatorio Modificado!"
                })
                .then(function() {
                    $('.modalEditReminder').css('display', 'none');
                });
            },
            error: function(error){ //error
                console.log("error ",error);
            }
        }); //ajax
    }
});//editar formulario


});//fin $(document).ready

//Abrir el modal editar recordatorio
function verRecordatorio(reminderId){
    $('.modalEditReminder').css('display', 'flex');
    verDatosEditarRecordatorio(reminderId);
}
//Cerrar el modal editar recordatorio
function cerrarModalRecordatorio(){
    $('.modalEditReminder').css('display', 'none');
}

/********* COLORES DE  EDITAR LA MASCOTA *********/
function createDivEditColores(color){
    let colores =['Pink', 'Coral', 'Gold', 'PaleGreen', 'MediumAquamarine', 'DeepSkyBlue', 'Violet'];
    for(let i =0; i< colores.length; i++){
        $('#colorPetEditReminder').append('<input type= "button" class="circlesColor colorPetEdit'+i+'" id="colorPetEdit'+i+'" value="'+colores[i]+'"></input>');   
        $('.colorPetEdit'+i).css('background-color', colores[i]);
        $('.colorPetEdit'+i).css('color', colores[i]);
        if(color===colores[i]){
            $('.colorPetEdit'+i).css('border', '2px solid #000');
        }
    }
} 

/************ VER DATOS DEL RECORDATORIO Y PODER MODIFICARLOS*************/
function verDatosEditarRecordatorio(reminderId){

    $('#dataReminder').empty();
    $.ajax({
        url: '../php/calendar/show_reminderwithid.php',
        type: 'POST',
        dataType:'json',
        data: {id: reminderId}, //user_name corresponde al user_name de la variable POST
        success: function(response){

            idReminder= response[0]; //id del recordatorio
            namePet= response[2];
            detalleReminder = response[3]; // detalles del recordatorio
            plannedDate = response[4]; //fecha_prevista del recordatorio
            plannedDonne = response[5]; //fecha_realizada del recordatorio
            timePeriod = response[6]; //periodo de tiempo
            idTypeReminder =response[7]; //id del nombre del tipo de recordatorio. ids de la tabla type_of_reminder
            typeReminder =response[8]; // tipo de recordatorio.
            nameTypeReminder =response[9]; // nombre tipo de recordatorio.
            colorReminder =response[10]; // nombre tipo de recordatorio.

            //id del recordatorio a modificar
            $('#dataReminder').append('<input type="hidden" id="idEditReminder" name="id_reminder_edit_reminder" value="'+idReminder+'">');
            //input mascota
            $('#dataReminder').append('<label for="petEditReminder" class="labelForm">Mascota </label><select id="petEditReminder"  name="pet_edit_reminder" class="cajaTexto borderCajaTexto"></select>');
            var pets= new Array();
            var ids= new Array();
            $.ajax({
                url: '../php/calendar/sacarNamePet.php',
                type: 'POST',
                dataType:'json',
            
                success: function(response){
                //Primero guardamos los datos un array 
                pets = response.map(item =>item[1]); //saca solo los nombres de las mascotas
                ids= response.map(item=>item[0]); //saca los ids de las mascotas
                    if(pets!=""){
                        $('#petEditReminder option').remove();
                        for(cont=0; cont<pets.length; cont++){
                            var petsName =pets[cont];
                            var petids= ids[cont];
                            $('#petEditReminder').append(' <option value="'+petids+'" id="'+petsName+'">'+petsName+'</option>');
                            if(namePet == petsName){
                                $('#petEditReminder option').prop('selected', true);
                            }
                        }//for de recordatorios
                    }//recordatorios distinto de vacio
                },
                error: function(error){ //error
                    console.log("error ",error);
                }
            });

            //input fecha prevista
            $('#dataReminder').append('<label for="dateEditReminder" class="labelForm">Elija una Fecha Prevista</label><input type="date" id="dateEditReminder" class="cajaTexto borderCajaTexto" name="date_planned_edit_reminder" value="'+plannedDate+'">');

            //inpur detalles
            if(detalleReminder === null || detalleReminder === ""){
                $('#dataReminder').append('<label for="detailsEditReminder" class="labelForm">Detalles</label><input type="text" id="detailsEditReminder" class="cajaTexto borderCajaTexto" name="details_edit_reminder" placeholder="Escriba aquí ... ">');
            }else{
                $('#dataReminder').append('<label for="detailsEditReminder" class="labelForm">Detalles</label><input type="text" id="detailsEditReminder" class="cajaTexto borderCajaTexto" name="details_edit_reminder"  value="'+detalleReminder+'">');
            }

            //input tipo recordatorio
            $('#dataReminder').append('<label for="typeEditReminder" class="labelForm">Selecciona el tipo de recordatorio:</label><select id="typeEditReminder" name="type_edit_reminder" class="cajaTexto borderCajaTexto"></select>');
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
                        $('#typeEditReminder option').remove();
                        for(cont=0; cont<tipos.length; cont++){
                            var listTypeReminder =tipos[cont];

                            $('#typeEditReminder').append('<option value="'+listTypeReminder+'">'+listTypeReminder+'</option>');
                            if(listTypeReminder == typeReminder){
                                $('#typeEditReminder option').prop('selected', true);
                            }
                        }//for de recordatorios
                    }//recordatorios distinto de vacio
                },
                error: function(error){ //error
                    console.log("error ",error);
                }
            });
            
       //input nombre del tipo recordatorio
            $('#dataReminder').append('<label for="typeNameEditReminder" class="labelForm">Selecciona el nombre recordatorio:</label><select id="typeNameEditReminder" name="type_name_edit_reminder" class="cajaTexto borderCajaTexto"> <option value="'+idTypeReminder+'" id="'+nameTypeReminder+'">'+nameTypeReminder+'</option></select>');
            $('#typeEditReminder').on('change', function() {
                $('#typeNameEditReminder option').remove();
                var type = $('#typeEditReminder').val();
                $.ajax({
                    url: '../php/calendar/name_type_reminder.php',
                    type: 'POST',
                    dataType:'json',
                    data: {tipo: type},
            
                    success: function(response){
                    //Primero guardamos los datos un array 
                        tipos = response;
                        nombreTipos = response.map(item=>item[1]);
                        idstipos = response.map(item=>item[0]);
                            if(tipos!=""){
                                for(cont=0; cont<nombreTipos.length; cont++){
                                    var nameType =nombreTipos[cont];
                                    var typeid= idstipos[cont];
                                    $('#typeNameEditReminder').append(' <option value="'+typeid+'" id="'+nameType+'">'+nameType+'</option>');
                                }//for de recordatorios
                            }//recordatorios distinto de vacio
                    },
                    error: function(error){ //error
                        console.log("error ",error);
                    }
                });
            });//sacar el nombre del tipo

            //colores
            $('#dataReminder').append('<label for="colorPetEditReminder" class="labelForm">Elige un color </label><div id="colorPetEditReminder"></div>  <input type="hidden" name="color_pet_edit_reminder" id="selectedColorEdit" value="">');
            
            createDivEditColores(colorReminder);

           pta= $('#selectedColorEdit').val(colorReminder);

            $('.circlesColor').on('click', function(){
                $('.circlesColor').css('border', '2px solid transparent');
                $(this).css('border', '2px solid #000');
                var color = $(this).val();
                $('#selectedColorEdit').val(color);

            });

        },
        error: function(error){ //error
            console.log("error ",error);
        }
    });

}//sacar formulario de editar recordatorio


/************ ELIMINAR RECORDATORIO *************/

function borrarRecordatorio(){
    var id = $('#idEditReminder').val();
    var formData = new FormData($($('#formEditReminder')).get(0));
    $.ajax({
        url: '../php/calendar/delete_reminder.php',
        type: 'POST',
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response){
            
            $('#'+id).remove();
            Swal.fire({
                icon: "success",
                title: "¡Genia!",
                text: "¡Recordatorio Eliminado!"
            })
            .then(function() {
                $('.modalEditReminder').css('display', 'none');
            });
        },
        error: function(error){ //error
            console.log("error ",error);
        }
    });
}
//});//eliminar recorddatorio


//aparece la side bar
$('#btnSideBar').on('click', function(){
    $('#sideBar').toggleClass('sidebar--visible');
});