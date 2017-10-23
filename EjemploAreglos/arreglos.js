
var materias = [
    {nombre: 'Tecnologias web', creditos: 8, optativa:true},
    {nombre: 'Pensamiento computacional', creditos: 10, optativa:false},
    {nombre: 'Compiladores A', creditos: 10, optativa:false}
];

muestraMaterias();
// function muestraMaterias(){
//     var tabla = document.createElement('tabla');
//     tabla.appendChild(creaEncabezado());
//     document.body.appendChild(tabla);
//     console.log('for normalito');

//     for(var i = 0; i <materias.length;i++)
//         {
//             console.log('Nombre' + materias[i].nombre)
//             console.log('Creditos' + materias[i].creditos)
//             console.log('Optativa' + materias[i].optativa)
//         }

//         console.log('foreach');
//         materias.forEach(function(mat){
//             console.log('Nombre:' + mat.nombre);
//             console.log('Creditos:' + mat.creditos);
//             console.log('Optativa:' + mat.optativa ? 'Si' : 'No');
//         }); 
// };



function muestraMaterias(){
    var tabla = document.createElement('tabla');
    tabla.appendChild(creaEncabezado());
    document.body.appendChild(tabla);
    console.log('for normalito');

    for(var i = 0; i <materias.length;i++)
        {
            document.getElementById('Nombre').appendChild(materias[i].nombre);
            console.log('Nombre: ' + materias[i].nombre)
            console.log('Creditos: ' + materias[i].creditos)
            console.log('Optativa: ' + materias[i].optativa)
        }

        console.log('foreach');
        materias.forEach(function(mat){
            console.log('Nombre:' + mat.nombre);
            console.log('Creditos:' + mat.creditos);
            console.log('Optativa:' + mat.optativa ? 'Si' : 'No');
        }); 
};



function creaEncabezado(){
    var encabezado = document.createElement('tr');
    
      var nombre = document.createElement('th');
      var textoNombre = document.createTextNode('Nombre');
      nombre.id= 'Nombre';
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