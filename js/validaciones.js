//Validaciones del formulario
function validateName(inputValue){
    //Permite números, letras mayúsculas y minúsculas, acentos y guión bajo
    let pattern = /^[a-zA-ZñáéíóúÁÉÍÓÚ_]+$/i;
    if(pattern.test(inputValue)){
        return true;
    }else{
        return false;
    }
}//fin validateName

function validatePassword(inputValue){
    //solo números, letras mayúsculas y minúsculas, !, _, (, ), &, + y *
    let pattern = /^[a-zA-Z0-9!_()&+*]+$/i;
    if(pattern.test(inputValue)){
        return true;
    }else{
        return false;
    }
}//fin validatePassword

function validateEmail(inputValue){
    //patrón formato email
    let pattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if(pattern.test(inputValue)){
        return true;
    }else{
        return false;
    }
}//fin validateEmail

//validar check
function validateCheck(inputId){
    if($(inputId).is(":checked")){
        return true;
    }else{
        return false;
    }
}//fin validateCheck

//validar fecha nacimiento
function validateBornDate(inputDate){
    let bornDate = new Date(inputDate);
    let today = new Date();
    if(bornDate <= today && bornDate.getFullYear() > 1900){
        return true;
    }else{
        return false;
    }
}

//validar número decimal
function validateFloatNumber(inputValue){
    //patrón formato decimal
    let pattern = /[0-9]{1,2}(\.?[0-9]{0,3})/g;
    if(pattern.test(inputValue)){
        return true;
    }else{
        return false;
    }
}

// Validaciones calendario

//Validaciones del formulario
function validateInputText(inputValue){
    //solo números y letras mayúsculas y minúsculas
    let pattern = /([A-Za-z0-9ÁáÉéÍíÓóÚúÜü.\-,])\S+/g;
    if(inputValue ==""){
        return true;
    }
    if(pattern.test(inputValue)){
        return true;
    }else{
        return false;
    }
}//fin validateName

//Validar Fechas
function validateDate(inputValue){
    let pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    if(pattern.test(inputValue)){
        let theDate = new Date(inputValue);
        if(theDate.getFullYear() > 2000 && theDate.getFullYear() < 2100 ){
            return true;
        }
    }else{
        return false;
    }
}// fin validate Date

//Validar Fechas
function validateOption(inputValue){
    if(inputValue != ""){
        return true;
    }else{
        return false;
    }
}// fin validate Select