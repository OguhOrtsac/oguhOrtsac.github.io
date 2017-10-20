

var inicial = document.getElementById("inicial");
var formularios = document.getElementById(formularios);
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
                //      document.getElementById('numsOperacion' + i).focus();
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


formDecimal.addEventListener('keyup', function (evento) {
    //var bs= evento.target.value;
    var num = evento.keyCode;
    if (num != 8) {
        var bandera = document.getElementById("base1");
        if (bandera.checked) {
            verificaCaracterIntroducido();
        }
    }
    else {
        quitarUno();
    }
});


formDecimal.addEventListener('click', function (evento) {

    var bandera = document.getElementById("base1");
    var num = evento.target.value;

    if (num != 'DEL' && num != 'CE' && num != '=') {
        document.getElementById("numsOperacion0").value += num;
        //   var sn= evento.target.ge
        if (bandera.checked) {
            verificaCaracterIntroducido();
        }
    }
    else if (num == 'DEL') {
        quitarUno();
    }
    else if (num == 'CE') {
        limpiarTodo();
    }
    else if (num == '=') {
        dameElResultado();
    }
});

function verificaCaracterIntroducido() {
    //teclado="";
    var cadena = document.getElementById("numsOperacion0").value;
    var key = cadena.charAt(cadena.length - 1);
    var teclado = String.fromCharCode(key);
    var letras = (/[+*-/.]/).test(key);
    var numeros = (/[0-9]/).test(key);
    //if(key)
    if (!numeros && !letras) {
        var texto = document.getElementById("numsOperacion0").value;
        texto = texto.substring(0, texto.length - 1);
        document.getElementById("numsOperacion0").value = texto;
    }
    else if (letras) {
        comprobarSintaxis();
    }

}

function comprobarSintaxis() {

    var TextoOperacion = document.getElementById("numsOperacion0").value;
    TextoOperacion = TextoOperacion.substring(0, TextoOperacion.length - 1);
    if (TextoOperacion == "") {
        document.getElementById("numsOperacion0").value = "";
    }
    else {

        var cadena = document.getElementById("numsOperacion0").value;
        var key = cadena.charAt(cadena.length - 2);
        var letras = (/[+*-/.]/).test(key);
        if (letras) {
            var texto = document.getElementById("numsOperacion0").value;
            texto = texto.substring(0, texto.length - 1);
            document.getElementById("numsOperacion0").value = texto;
        }
    }
}

function limpiarTodo() {
    document.getElementById("numsOperacion0").value = "";
}

function quitarUno() {
    var texto = document.getElementById("numsOperacion0").value;
    texto = texto.substring(0, texto.length - 1);
    document.getElementById("numsOperacion0").value = texto;
}

function dameElResultado() {
    var resultado = eval(document.getElementById("numsOperacion0").value);

    if (resultado == "Infinity") {
        document.getElementById("numsOperacion0").value = "No se puede dividir entre cero";

    } else {
        document.getElementById("numsOperacion0").value = resultado;
    }

}
