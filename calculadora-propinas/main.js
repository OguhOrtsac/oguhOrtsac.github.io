var btnCalcular = document.getElementById('btnCalcular');

btnCalcular.addEventListener('click', function()
{
    var propina  = document.getElementById('propina');
    var propinaPersona = calcularPropina();
    propina.innerHTML = 'propina $' + propinaPersona + ' por persona';
});

function calcularPropina()
{
    var Calculadora = document.getElementById('calculadora');
    var totalCuenta = parseInt(Calculadora.total.value);
    var numPersona = parseInt(Calculadora.personas.value);
    var servicio = parseInt(Calculadora.servicio.value);
    if(Number.isNaN (numPersona))
    {

    }
    return totalCuenta/numPersona*servicio/100;
}