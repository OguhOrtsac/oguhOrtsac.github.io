
document.write("Hola desde JavaScript");
// for(var i=0; i<10;i++)
// {
//     document.write(i);
//     document.write('<br>');
// }

//  window.alert("Yo aqui dando lata");
  console.log("Hola para la consola");

  function imprimeNumeros(arreglo)
  {
      for(var i=0; i<arreglo.length; i++)
        {
            document.write(arreglo[i]);
            document.write('<br>');
        }
        
  }

  var cajas= document.getElementsByClassName("caja");
  var padre = document.getElementById("contenedor");

//   Delegacion de eventos
  padre.addEventListener('click',function(evento){
    var hijo= evento.target;
    //  target es el objeto en el cual sucedio el objeto

    if(hijo!=padre)         // validar que no se hizo clic al mismo contenedor
    {
    this.removeChild(hijo);
    }
  });

  function agregaCaja(texto)
  {
      var nuevo= document.createElement('div');
      var texto = document.createTextNode(texto);
    //   nuevo.
  }

 // Notacion contructor de arreglo

var arreglo= [3,5,7];
var arreglo2= new Array(9,11,13);
imprimeNumeros(arreglo);
imprimeNumeros(arreglo2);


//Notacion literal de objetos
var triangulo ={
    base:3,
    altura:5,
    area: function()
    {
        console.log("Area = " + this.base * this.altura/2);
    }
}

triangulo.area();