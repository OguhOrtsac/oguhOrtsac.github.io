
var clicko = 0;
var clickoB = 0;
var clickoC = 0;
var arregloSelect;

var materias = [
    { nombre: 'Tecnologias web', creditos: 8, optativa: true },
    { nombre: 'Pensamiento computacional', creditos: 10, optativa: false },
    { nombre: 'Electronica A', creditos: 12, optativa: true },
    { nombre: 'Compiladores A', creditos: 10, optativa: false }
];

var tabla;
    muestraMaterias(materias);
    buscaMateria();
var txtBuscar = document.getElementById('cuadroBusqueda');

function muestraMaterias(arreglo) {
    tabla = document.createElement('tabla');
    tabla.appendChild(creaEncabezado());
    document.body.appendChild(tabla);
    console.log('forech normalito');
 
    arreglo.forEach(function (mat) {
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

txtBuscar.addEventListener('keyup', function(){
     arregloSelect = buscaPorNombre(materias,txtBuscar);
    var taB = document.getElementById('tabla');
    document.body.removeChild(taB);  
   muestraMaterias(arregloSelect);
});

function buscaPorNombre(materias, txtBuscar){
    var nom = txtBuscar.value.toLowerCase();
    return materias.filter(function(mat){
        return mat.nombre.toLowerCase().includes(nom);})
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
           if(clicko==0){
            materias.sort(function (a, b) { return a.nombre.localeCompare(b.nombre) });
          clicko+=1;
        }
           else{
            materias.sort(function (a, b) { return a.nombre.localeCompare(b.nombre) }).reverse();
            clicko-=1;
           }
        }
        else if (index == 1) {
            if(clickoB==0){
            materias.sort((a, b) => a.creditos - b.creditos);
            // materias.sort(function(a, b){return a.creditos - b.creditos});
            clickoB+=1;
        }
           else{
            materias.sort((a, b) => a.creditos - b.creditos).reverse();
            clickoB-=1;
           }
        }
        
        else if (index == 2) {
            if(clickoC==0){
            materias.sort((a, b) => a.optativa - b.optativa);     //false va primero con el sort y con el reverse me devuelve las true primero
            clickoC+=1;
        }
        else{
            materias.sort((a, b) => a.optativa - b.optativa).reverse();
            clickoC-=1;
           }
        }
        
       eliminarTabla();
    
    }
});



function eliminarTabla(){
    var taB = document.getElementById('tabla');
    document.body.removeChild(taB);  
    muestraMaterias(materias);
};

function buscaMateria(){
    var cuadro = document.createElement('cuadro');
    cuadro.setAttribute('id', 'cuadroBusqueda');
    cuadro.nodeType= 'text';

    // document.appendChild(cuadro);
};