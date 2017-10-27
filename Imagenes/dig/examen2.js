


var tareas = [
    { Nombre: 'Estudiar', Descripcion: "Estudiar mas para el siguiente examen", Prioridad: 'Alta', Status: false },
    { Nombre: 'Trabajos', Descripcion: "El alumno debe entregar tareas", Prioridad: 'Media', Status: false },
    { Nombre: 'Leer', Descripcion: "Siempre es bueno leer", Prioridad: 'Baja', Status: false },
    { Nombre: 'Examen', Descripcion: "El alumno debe comenzar el examen", Prioridad: 'Alta', Status: true },
    { Nombre: 'Expo-software', Descripcion: "Presentara su proyectos", Prioridad: 'Media', Status: false },
    { Nombre: 'Asesoria', Descripcion: "El alumno reserva asesoria", Prioridad: 'Baja', Status: false },
    { Nombre: 'COMER', Descripcion: "El alumno puede ir por el desayuno", Prioridad: 'Alta', Status: true }

]

var clickoA = 0;
var clickoB = 0;

var tabla = document.getElementById('tabla');
var arregloBuscado;
var txtBuscar = document.getElementById('cuadroBusqueda');
var encabezado = document.getElementById('encabezado');
var notificacion = document.getElementById('notPrioridades');

//var btCargar = document.getElementById('prueba');


muestraArreglo(tareas);


function muestraArreglo(arreglo) {
    var cuerpoTabla = document.createElement('tbody');
    cuerpoTabla.setAttribute('id', 'cuerpoTabla');

    arreglo.forEach(function (mat) {
        var dupla = document.createElement('tr');
        for (var i = 0; i < 5; i++) {

            var atributo;
            if (i == 0) {
                atributo = mat.Nombre;
            }
            else if (i == 1) {
                atributo = mat.Descripcion;
            }
            else if (i == 2) {
                atributo = mat.Prioridad;
            }

            else if (i == 3) {
                atributo = mat.Status;
                var campo = document.createElement('td');
                var label = document.createElement('label');
                label.textContent = 'Terminado';
                var nuevoBoton = document.createElement('input');
                nuevoBoton.type = 'radio';
                if (atributo) {
                    nuevoBoton.checked = true;
                }

                label.appendChild(nuevoBoton);
                campo.appendChild(label);

            }
            else if (i == 4) {
                var campo = document.createElement('td');
                var nuevoBoton = document.createElement('button');
                nuevoBoton.type = 'button';
                nuevoBoton.textContent = "Eliminar";

                campo.appendChild(nuevoBoton);

            }
            if (i != 4 && i != 3) {
                var campo = document.createElement('td');
                var texto = document.createTextNode(atributo);
                campo.appendChild(texto);

            }
            dupla.appendChild(campo);
            if(mat.Status){
                dupla.className= 'tareaTerminada';
            }
            else
                {
                    dupla.className= 'tareaFaltante';
                }
        


        }
        cuerpoTabla.appendChild(dupla);
    });
    tabla.appendChild(cuerpoTabla);

}

function myFunction(x) {
    alert("Row index is: " + x.rowIndex);
}

function eliminarColumna(event) {

    alert('uffdnhngg');

}

function agregarObjeto() {
    var radio;
    var prioridad = false;

    var nNom = document.getElementById("nombreNuevo");
    var nDes = document.getElementById("DescripcionNuevo");
    var nPri = document.getElementById("formAgregar");
    var exp = (/[0-9]/).test(nDes.value);
    var ns = nPri.prioridad.length;
    for (var i = 0; i < ns; i++) {
        if (nPri.prioridad[i].checked) {
            radio = document.getElementById('prioridad' + i).value;
            prioridad = true;
        }
    }
    if (nNom.value != "") {

        if (nDes.value != "") {
            if (!exp) {
                if (VeriPrioridad(prioridad)) {
                    var nuevaTarea = { Nombre: nNom.value, Descripcion: nDes.value, Prioridad: radio }
                    tareas.push(nuevaTarea)
                    eliminarTabla();
                }
            }
            else {
                alert('Introduciste numeros en la descripcion, eso no es valido');
            }
        }
        else {
            alert('No Escribiste la descripcion');
        }
    }
    else {
        alert('No Escribiste Un nombre');
    }

};

function VeriPrioridad(band) {
    if (!band) {
        alert('Es importante que le des una prioridad a la tarea');
        return false;
    }
    return true;
};


encabezado.addEventListener('click', function (evento) {
   // console.log('toque body');
    var nomEvento = evento.target;
    var arreglitoOrdenar;
    var index = nomEvento.defaultValue;
   
    if(txtBuscar.value!= "")
        {
                arreglitoOrdenar= buscaPorDescripcion(tareas, txtBuscar);
        }
        else{
            arreglitoOrdenar=tareas;
        }
    if (index == "Descripcion") {
        if (clickoA == 0) {

            arreglitoOrdenar.sort(function (a, b) { return a.Descripcion.localeCompare(b.Descripcion) });
            // tareas.sort(function(a, b){return a.Descripcion - b.Descripcion});
            clickoA = 1;
        }
        else {
            arreglitoOrdenar.sort(function (a, b) { return a.Descripcion.localeCompare(b.Descripcion) }).reverse();
            clickoA = 0;
        }
    }

    else if (index == "Prioridad") {
        if (clickoB == 0) {

            arreglitoOrdenar.sort(function (a, b) { return a.Prioridad.charAt(1).localeCompare(b.Prioridad.charAt(1)) });
            // tareas.sort(function(a, b){return a.Descripcion - b.Descripcion});
            clickoB = 1;
        }
        else {
            arreglitoOrdenar.sort(function (a, b) { return a.Prioridad.charAt(1).localeCompare(b.Prioridad.charAt(1)) }).reverse();
            clickoB = 0;
        }
    }

    var cuerpo = document.getElementById('cuerpoTabla');
    tabla.removeChild(cuerpo);
    muestraArreglo(arreglitoOrdenar);

});


document.addEventListener('click', function (evento) {
    var nomEvento = evento.target;
    if (nomEvento.textContent == "Eliminar") {
        var table = document.getElementById("tabla");

        for (var i = 1; i < tabla.rows.length; i++) {
            var rIndex;
            tabla.rows[i].cells[4].onclick = function () {
                rIndex = this.parentElement.rowIndex;
                if (tareas[rIndex - 1].Status) {
                    tareas.splice(rIndex - 1, 1);
                    eliminarTabla();
                }
                else {
                    alert("La tarea no ha sido completada, por ello no puedes eliminarla");
                }

            };
        }

    }
    else if (nomEvento.localName == "input") {
        var table = document.getElementById("tabla"), rIndex;

        for (var i = 0; i < table.rows.length; i++) {
            table.rows[i].cells[3].onclick = function () {
                rIndex = this.parentElement.rowIndex;
                if (tareas[rIndex - 1].Status) {
                tareas[rIndex - 1].Status = false;}
                else{
                    tareas[rIndex - 1].Status =true;
                }
                eliminarTabla();
                console.log("Row : " + rIndex);
            };
        }
    }

});

txtBuscar.addEventListener('keyup', function () {
    arregloBuscado = buscaPorDescripcion(tareas, txtBuscar);
    var cuerpo = document.getElementById('cuerpoTabla');
    tabla.removeChild(cuerpo);
    muestraArreglo(arregloBuscado);
});

function buscaPorDescripcion(tareas, txtBuscar) {
    var nom = txtBuscar.value.toLowerCase();
    return tareas.filter(function (tar) {
        return tar.Descripcion.toLowerCase().includes(nom);
    })
};

function eliminarTabla() {
    var cuerpo = document.getElementById('cuerpoTabla');
    tabla.removeChild(cuerpo);
    muestraArreglo(tareas);
};

