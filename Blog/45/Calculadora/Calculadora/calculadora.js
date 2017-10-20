


var inicial = document.getElementById("inicial"); 


inicial.addEventListener('click', function(evento) {
    var hijo = evento.target;
    //console.log(hijo);
    if(hijo != inicial) //vañidar que no se hixo click al mismo contenedor padre osea asi mismo
        {
    var i;
    for (i=0;i<document.inicial.base.length;i++)
    { 
        var entrada = document.getElementsByClassName('base');
        var contenido ='form'+document.inicial.base[i].value;

        console.log(contenido);

       if (document.inicial.base[i].checked) 
       {
      
        document.getElementById(contenido).style.display="block";
        console.log(i);
       // break; 
       }
       else{
        console.log('no '+i);
        document.getElementById(contenido).style.display="none";
       }
         
    } 
   
}
});
