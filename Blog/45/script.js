
function addChar(input, character)
{
   
    if(input.value == null || input.value == "0")
        input.value = character
    else
        input.value += character
}
function deleteChar(input)
{
    alert("ingresaando DELETE")
    input.value = input.value.substring(0, input.value.length - 1)
}
function changeSign(input)
{
  
    if(input.value.substring(0, 1) == "-")
        input.value = input.value.substring(1, input.value.length)
    else
        input.value = "-" + input.value
}
function compute(form) 
{
    alert("ingresaando")
  
    var resultado= eval(document.display.value)
    alert("si es")
    alert(resultado)
    if(resultado=="Infinity")
    {       
        alert("si es")
     document.display.value="No se puede dividir entre cero"
    }
     else{
        alert("no es")
    form.display.value = resultado
        } 

    // form.display.value = eval(form.display.value)
}
function square(form) 
{
    alert("ingresaando")
    
    form.display.value = eval(form.display.value) * eval(form.display.value)
}

function checkNum(str) 
{
    for (var i = 0; i < str.length; i++) 
    {
        var ch = str.substring(i, i+1)
   
        if (ch < "0" || ch > "9") 
        {
        if (ch != "/" && ch != "*" && ch != "+" && ch != "-" && ch != "(" && ch!= ")"  && ch != ".") 
         {
            alert("invalid entry!")
            return false
         }
        }
    }
    return true
}



function solonumeros(e){
    
        key=e.keyCode || e.which;
    
        teclado=String.fromCharCode(key);
    
        numeros="0123456789.+-/*";
    
        especiales="8-37-39-46";
    
        tecla_especial=false;
    
        for(var i in especiales){
            if(key==especiales[i]){
                tecla_especial=true;
            }
        }
    
        if(numeros.indexOf(teclado)==-1 && !tecla_especial){
            return false;
        }   
    }
    