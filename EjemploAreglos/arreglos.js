

var materias = [
    { nombre: 'Tecnologias web', creditos: 8, optativa: true },
    { nombre: 'Pensamiento computacional', creditos: 10, optativa: false },
    { nombre: 'Electronica A', creditos: 12, optativa: true },
    { nombre: 'Compiladores A', creditos: 10, optativa: false }
];

var tabla;
    muestraMaterias();
    buscaMateria();


function muestraMaterias() {
    tabla = document.createElement('tabla');
    tabla.appendChild(creaEncabezado());
    document.body.appendChild(tabla);
    console.log('forech normalito');

    materias.forEach(function (mat) {
        var dupla = document.createElement('tr');
        for (var i = 0; i < 3; i++)                         //Recorrer los atributos que tiene el areglo mat
        {
            if (i == 0) {
                var atributo = mat.nombre;
            }
            else if (i == 1) {
                var atributo = mat.creditos;
            }
            else if (i == 2) {
                var atributo = mat.optativa;
            }
            var dato = document.createElement('td');                 // Crear un td 
            var texto = document.createTextNode(atributo);           // Guardar un nombre
            dato.appendChild(texto);                                 // Agregar un nombre al campo td
            dupla.appendChild(dato);               //Agregar el td al tr
        }
        tabla.appendChild(dupla);
    });
    tabla.setAttribute('id', 'tabla');
    
};



function creaEncabezado() {
    var encabezado = document.createElement('tr');
    var nombre = document.createElement('th');
    var textoNombre = document.createTextNode('Nombre');
    //nombre.id= 'Nombre';
    nombre.appendChild(textoNombre);

    var creditos = document.createElement('th');
    var textoCreditos = document.createTextNode('Creditos');
    creditos.appendChild(textoCreditos);

    var optativa = document.createElement('th');
    var textoOptativa = document.createTextNode('optativa');
    optativa.appendChild(textoOptativa);

    encabezado.appendChild(nombre);
    encabezado.appendChild(creditos);
    encabezado.appendChild(optativa);

    return encabezado;
};

document.addEventListener('click', function (evento) {
    console.log('toque body');
    var nomEvento = evento.target;
    if (nomEvento.localName == "th") {
        var index = nomEvento.cellIndex;
        if (index == 0) {
            console.log('index = 0');
            materias.sort(function (a, b) { return a.nombre.localeCompare(b.nombre) });
        }
        else if (index == 1) {
            console.log('index = 1');
            materias.sort((a, b) => a.creditos - b.creditos);
            // materias.sort(function(a, b){return a.creditos - b.creditos});
        }
        else if (index == 2) {
            console.log('index = 2');
            materias.sort((a, b) => a.optativa - b.optativa).reverse();     //false va primero con el sort y con el reverse me devuelve las true primero
        }
       eliminarTabla();
     //  muestraMaterias();
    }
});

/* tabla.addEventListener('click', function (evento) {
    var nomEvento = evento.target;
    if (nomEvento.localName == "th") {
        var index = nomEvento.cellIndex;
        if (index == 0) {
            console.log('index = 0');
            materias.sort(function (a, b) { return a.nombre.localeCompare(b.nombre) });
        }
        else if (index == 1) {
            console.log('index = 1');
            materias.sort((a, b) => a.creditos - b.creditos);
            // materias.sort(function(a, b){return a.creditos - b.creditos});
        }
        else if (index == 2) {
            console.log('index = 2');
            materias.sort((a, b) => a.optativa - b.optativa).reverse();     //false va primero con el sort y con el reverse me devuelve las true primero
        }
       eliminarTabla();
     //  muestraMaterias();
    }
}); */



function eliminarTabla(){
    var taB = document.getElementById('tabla');
   // taB.remove();
  // taB.removeEventListener(); 
  // taB.removeAttribut('id','tabla');
   
    document.body.removeChild(taB);  
    muestraMaterias();
};

function buscaMateria(){
    var cuadro = document.createElement('cuadro');
    cuadro.setAttribute('id', 'cuadroBusqueda');
    cuadro.nodeType= 'text';

    // document.appendChild(cuadro);
};