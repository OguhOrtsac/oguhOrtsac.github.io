var formulario = document.getElementById('registro');
var notificacion = document.getElementById('notificacion');
var comContraA = document.getElementById('compruebaContraA');
var comContraB = document.getElementById('compruebaContraB');
//var contra= document.getElementsByClassName('contra');

var longContra= 6;
var longUsuario= 8;


formulario.usuario.addEventListener('blur',function()
{
    verificaNomUsuario();
});

formulario.usuario.addEventListener('keyup',function()
{
    verificaNomUsuario();
});

function verificaNomUsuario(){
    
        var iniciaLetra = /[a-z]/i;    //No le importa si son mayusculas o minusculas
        
        if(iniciaLetra.test(formulario.usuario.value.charAt(0)) )
        {
            if(formulario.usuario.value.length >= longUsuario)
            {
                notificacion.innerHTML="Usuario Correcto";
                notificacion.className="usuarioCorrecto";
                return true;
            }
            else
            {
                notificacion.innerHTML = "La longitud del nombre debe ser de al menos 8 caracteres";
                notificacion.className = "usuarioInvalido";
                return false;
            }
         }
         else
             {
                    notificacion.innerHTML = "El nombre debe comenzar con una letra";
                    notificacion.className = "usuarioInvalido";
                    return false;
            }
    }
    
    function verificaContraseña(){
        // if(formulario.contra.value == formulario.contraB.value)
        //     {
            if(formulario.contra.value.length >= longContra)
                 {
                     return true;
                }
              else
                 {
                    comContraA.innerHTML = 'Es muy corta, debe tener minimo 6 caracteres';
                    comContraA.className= 'debil';
                    alert('La contraseña no cumplio su longitud minima');
                    // comContraA.style.color= 'RED';
                     return false;
                 }
        // }
        // else
        //     {
        //         comContraB.innerHTML = 'No coinciden las contraseñas';
        //        // comContraA.style.color= 'RED';
        //         comContraB.className = 'contraseñasDesiguales';
        //         return false;
        //     }
    }

   // formulario.usuario.addEventListener('blur',verificaNomUsuario());
    
   formulario.contra.addEventListener('blur',function()
   {
       verificaContraseña();
   });
   

formulario.contraB.addEventListener('keyup',function(){

    if(formulario.contra.value == formulario.contraB.value){//Si sin iguales
        comContraB.innerHTML = 'Son iguales';
        comContraB.className = 'contraseñasIguales';
        return true;
    }

    else{
        comContraB.innerHTML = 'No coinciden las contraseñas';
        comContraB.className = 'contraseñasDesiguales';
        return false;
    }

});



formulario.contra.addEventListener('keyup', function(){

    var simbolos = (/[!@"#$%&/()]/).test(formulario.contra.value);

    var letras = (/[a-z]/i).test(formulario.contra.value);
    
    var digitos = (/[0-9]/).test(formulario.contra.value);


    if(simbolos && digitos && letras)
        {
           comContraA.innerHTML = 'Segura';
           comContraA.className= 'segura';
         //  comContraA.style.color= 'GREEN';
        }
        else if((letras && digitos) || (letras && simbolos) || (simbolos && digitos))
        {
            comContraA.innerHTML = 'Mediana';
          
            comContraA.className= 'media';
          //  comContraA.style.color= 'YELLOW';
        }
        else if(letras  || simbolos || digitos)
        {
            comContraA.innerHTML = 'Debil';
            comContraA.className= 'debil';
          //  comContraA.style.color= 'RED';
        }
        else
        {
            comContraA.innerHTML = 'Ingresa una contraseña';
            comContraA.className= 'noHaycontra';    
          //  comContraA.style.color= 'BLACK';       
        }

});

formulario.addEventListener('submit',function(){

    
    if( verificaNomUsuario() && verificaContraseña() && verificaTerminos() ){
        alert("Registro exitoso!");
    }
});


function verificaTerminos(){

    
    var terminos = document.getElementById('registro');
    if(terminos.aceptar.checked)
    {
        return true;
    }
    else
    {
        alert("No haz aceptado terminos y condiciones");
        return false;
    }
}

