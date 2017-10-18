
var formulario = document.getElementById('registro');
var mensaje = document.getElementById('mensaje');

formulario.usuario.addEventListener('blur',function(){
    verificaNombre();
});

formulario.contraseña.addEventListener('keyup', function(){
  //  mensaje.innerHTML = formulario.contraseña.value.length;
    contraseñaSegura();
  //  console.log('SIII');
});


function contraseñaSegura(){

    var longitud= formulario.contraseña.value.length;
    var letras = (/[a-z]/i).test(formulario.contraseña.value);
    var digitos = (/[0-9]/).test(formulario.contraseña.value);
    var simbolos = (/[/!*$#%&().]/).test(formulario.contraseña.value);

    if(letras && digitos && simbolos &&  longitud>=8)
        {
            console.log('Es segura');
        }
        else
            if(letras && digitos || letras && simbolos || simbolos&& digitos)
                {
                    console.log('media segura');
                }
                else
                    {
                        console.log('Poco segura');
                    }  
}


formulario.addEventListener('submit',function(){
    if(!verificaNombre() || !verificaContraseña() || verificaTerminos())
    {
        alert("error");
        event.preventDefault;
    }
});

function verificaNombre(){
    // var letras = (/[a-z]/i).test(formulario.contraseña.value);
    // var digitos = (/[0-9]/).test(formulario.contraseña.value);
    // var simbolos = (/[/!*$#%&().]/).test(formulario.contraseña.value);
   
    var letras = (/[a-z]/i);
   
    if(letras.test(formulario.usuario.value.charAt(0)))
        {
            return true;
        }
        else
            {
              mensaje.innerHTML = "Nombre de usuario no valido";
                return false;
            }
        
    return false;
}

function verificaContraseña(){
    return true;
}

function verificaTerminos(){
    return true;
}
function registro()
{
    var reg = document.getElementById('registro');
    var nameuser = reg.user.value;
    var pass = reg.contraseña.value;
    var pass2 = reg.contraseña2.value;
}