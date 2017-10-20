

var inicial = document.getElementById("inicial");
var formularios = document.getElementById('formularios');
var contenedor = document.getElementsByClassName("contenedor");
var formDecimal = document.getElementById("formDecimal");


inicial.addEventListener('click', function (evento) {
    var hijo = evento.target;
    //console.log(hijo);
    if (hijo != inicial) //vañidar que no se hixo click al mismo contenedor padre osea asi mismo
    {
        var i;
        for (i = 0; i < document.inicial.base.length; i++) {
            var entrada = document.getElementsByClassName('base');
            var contenido = 'form' + document.inicial.base[i].value;

            //console.log(contenido);

            if (document.inicial.base[i].checked) {

                document.getElementById(contenido).style.display = "block";
                document.getElementById('numsOperacion' + i).focus();
                //console.log(i);
                // break; 
            }
            else {
                //console.log('no '+i);
                document.getElementById(contenido).style.display = "none";
            }

        }

    }
});

formularios.addEventListener('keyup', function (evento) {
    //var bs= evento.target.value;
    var i;
    for (i = 0; i < document.inicial.base.length; i++) {
        if (document.inicial.base[i].checked) {
            var num = evento.keyCode;
            var bandera = document.getElementById("base" + i);
            if (bandera.checked) {
                if (num != 8) {

                    verificaCaracterIntroducido(i);
                }
                else {
                    quitarUno(i);
                }
            }
            break;
        }
    }
});

formularios.addEventListener('click', function (evento) {
    var i;
    for (i = 0; i < document.inicial.base.length; i++) {
        if (document.inicial.base[i].checked) {
            var comp = evento.target.name;
            if (comp != 'NumES') {       // es para cuando toque el display de entrada no se vuelva a escribir duplicado
                var bandera = document.getElementById("base" + i);
                var num = evento.target.value;

                if (num != 'DEL' && num != 'CE' && num != '=') {
                    document.getElementById("numsOperacion" + i).value += num;
                    //   var sn= evento.target.ge
                    if (bandera.checked) {
                        verificaCaracterIntroducido(i);
                    }
                }
                else if (num == 'DEL') {
                    quitarUno(i);
                }
                else if (num == 'CE') {
                    limpiarTodo(i);
                }
                else if (num == '=') {
                    dameElResultado(i);
                }
            }
            document.getElementById('numsOperacion' + i).focus();
        }
    }
});

function verificaCaracterIntroducido(num) {
    var cadena = document.getElementById("numsOperacion" + num).value;

    var key = cadena.charAt(cadena.length - 1);
    var simbolos = (/[+*-/.]/).test(key);
    var numeros = (/[0-9]/).test(key);
    var numBinarios = (/[0-1]/).test(key);
    var letras = (/[A-F]/i).test(key);
    //if(key)

    if (num == 0) {
        if (!numeros && !simbolos) {
            var texto = document.getElementById("numsOperacion0").value;
            texto = texto.substring(0, texto.length - 1);
            document.getElementById("numsOperacion0").value = texto;
        }
        else if (simbolos) {
            comprobarSintaxis(0);
        }
    }
    else if (num == 1) {
        if (!numeros && !simbolos && !letras) {
            var texto = document.getElementById("numsOperacion1").value;
            texto = texto.substring(0, texto.length - 1);
            document.getElementById("numsOperacion1").value = texto;
        }
        else if (simbolos) {
            comprobarSintaxis(1);
        }
    }
    else if (num == 2) {
        if (!numBinarios && !simbolos) {
            var texto = document.getElementById("numsOperacion2").value;
            texto = texto.substring(0, texto.length - 1);
            document.getElementById("numsOperacion2").value = texto;
        }
        else if (simbolos) {
            comprobarSintaxis(2);
        }
    }



}

function comprobarSintaxis(num) {

    var TextoOperacion = document.getElementById("numsOperacion" + num).value;
    TextoOperacion = TextoOperacion.substring(0, TextoOperacion.length - 1);
    if (TextoOperacion == "") {
        document.getElementById("numsOperacion" + num).value = "";
    }
    else {

        var cadena = document.getElementById("numsOperacion" + num).value;
        var key = cadena.charAt(cadena.length - 2);
        var letras = (/[+*-/.]/).test(key);
        if (letras) {
            var texto = document.getElementById("numsOperacion" + num).value;
            texto = texto.substring(0, texto.length - 1);
            document.getElementById("numsOperacion" + num).value = texto;
        }
    }
}

function limpiarTodo(num) {
    document.getElementById("numsOperacion" + num).value = "";
}

function quitarUno(num) {
    var texto = document.getElementById("numsOperacion" + num).value;
    texto = texto.substring(0, texto.length - 1);
    document.getElementById("numsOperacion" + num).value = texto;
}

function dameElResultado(num) {
    // var resultado = 'Algo salio mal';
    var simbolos = (/[+*-/]/);
    var cadAuxiliar="";
    var preResultado="";
    var resultado = 0;
   


    if (num == 0) {
        resultado = eval(document.getElementById("numsOperacion" + num).value);
    }
    else if (num == 1 || num ==2) {
        var baseNum=0;
        if(num==1) 
            baseNum=16;
        else
            baseNum=2;
            
        var Numeros = document.getElementById("numsOperacion" + num).value;
        var res = Numeros.split(simbolos);
       for(var i=0; i<Numeros.length;i++)
        {
            var hs = Numeros.charAt(i);
            if( hs== "-" || hs== "+" || hs== "/" ||hs== "*")
                {
                    cadAuxiliar+=hs;
                }
               
               // console.log(cadAuxiliar);    
        }
        for (var x=0;x<res.length;x++){
            
            if(x+1 <res.length)
            { 
            preResultado += (parseInt(res[x], baseNum) + cadAuxiliar.charAt(x));
            }
            else preResultado += parseInt(res[x], baseNum);
            }    
            resultado = eval(preResultado);
            resultado = resultado.toString(baseNum).toUpperCase();    
    }



    if (resultado == "Infinity") {
        document.getElementById("numsOperacion" + num).value = "No se puede dividir entre cero";
    } 
    else {
        document.getElementById("numsOperacion" + num).value = resultado;
    }

}




