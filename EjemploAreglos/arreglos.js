

var materias = [
    {nombre: 'Tecnologias web', creditos: 8, optativa:true},
    {nombre: 'Pensamiento computacional', creditos: 10, optativa:false},
    {nombre: 'Compiladores A', creditos: 10, optativa:false}
];

muestraMaterias();


function muestraMaterias(){
    var tabla = document.createElement('tabla');
    tabla.appendChild(creaEncabezado());
    document.body.appendChild(tabla);
    console.log('forech normalito');

    materias.forEach(function (mat){

        var dupla = document.createElement('tr');

            for(var i= 0; i<3; i++)                         //Recorrer los atributos que tiene el areglo mat
                {
                    if(i==0)
                        {
                            var atributo = mat.nombre;
                        }
                        else if(i==1){
                            var atributo = mat.creditos;
                        }
                        else if(i==2){
                            var atributo = mat.optativa;
                        }

                    var dato = document.createElement('td');                 // Crear un td 
                    var texto = document.createTextNode(atributo);           // Guardar un nombre
                    dato.appendChild(texto);                                 // Agregar un nombre al campo td

                    dupla.appendChild(dato);               //Agregar el td al tr
                }
        tabla.appendChild(dupla);           

    });
}

function creaEncabezado(){
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