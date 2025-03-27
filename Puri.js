// Variables globales
let pdfGenerado = null;
let fechasDisponibles = [];
let pdfFileName = '';

// Establecer la fecha actual
document.addEventListener('DOMContentLoaded', function() {
    const fechaActual = new Date();
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = fechaActual.toLocaleDateString('es-ES', opciones);
    
    // Inicializar el calendario
    inicializarCalendario();
    
    // Cargar las fechas disponibles
    cargarFechasDisponibles();
});

// Función para cargar las fechas que tienen registros
function cargarFechasDisponibles() {
    // En un entorno real, aquí se haría una llamada al backend para obtener las fechas
    // Como es una simulación, usaremos algunas fechas de ejemplo
    
    // Esta función simularía la lectura de la carpeta "registro_de_ventas"
    const hoy = new Date();
    const fechas = [];
    
    // Simular que tenemos registros en los últimos 5 días y algunos días aleatorios
    for (let i = 1; i <= 5; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() - i);
        fechas.push(fecha.toISOString().slice(0, 10));
    }
    
    // Añadir algunas fechas aleatorias en el último mes
    for (let i = 0; i < 10; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(hoy.getDate() - Math.floor(Math.random() * 30) - 1);
        fechas.push(fecha.toISOString().slice(0, 10));
    }
    
    // Eliminar duplicados
    fechasDisponibles = [...new Set(fechas)];
    
    // Actualizar el calendario con las fechas disponibles
    actualizarCalendario();
}

// Inicializar el calendario usando Pikaday
function inicializarCalendario() {
    const picker = new Pikaday({
        field: document.getElementById('fecha-picker'),
        format: 'YYYY-MM-DD',
        onSelect: function(date) {
            const fechaSeleccionada = date.toISOString().slice(0, 10);
            if (fechasDisponibles.includes(fechaSeleccionada)) {
                visualizarPDF(fechaSeleccionada);
            } else {
                alert('No hay registro para la fecha seleccionada');
            }
        },
        onDraw: function(date) {
            // Resaltar las fechas que tienen registros
            const fechaStr = date.toISOString().slice(0, 10);
            if (fechasDisponibles.includes(fechaStr)) {
                this.el.classList.add('highlighted-date');
            }
        }
    });
    
    // Guardar referencia al calendario
    window.calendario = picker;
}

// Actualizar el calendario con las fechas disponibles
function actualizarCalendario() {
    if (window.calendario) {
        window.calendario.draw();
    }
}

// Mostrar el calendario
function mostrarCalendario() {
    document.querySelector('.container').style.display = 'none';
    document.querySelector('#calendar-container').style.display = 'block';
    document.querySelector('#pdf-viewer').style.display = 'none';
}

// Ocultar el calendario
function ocultarCalendario() {
    document.querySelector('.container').style.display = 'block';
    document.querySelector('#calendar-container').style.display = 'none';
    document.querySelector('#pdf-viewer').style.display = 'none';
}

// Visualizar un PDF
function visualizarPDF(fecha) {
    document.querySelector('#calendar-container').style.display = 'none';
    document.querySelector('#pdf-viewer').style.display = 'block';
    
    // Formatear la fecha para mostrarla
    const fechaObj = new Date(fecha);
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('pdf-date').textContent = fechaObj.toLocaleDateString('es-ES', opciones);
    
    // En un entorno real, aquí cargaríamos el PDF de la carpeta
    // Como es una simulación, mostraremos un mensaje
    const iframe = document.getElementById('pdf-iframe');
    
    // Crear un contenido HTML simulado para el iframe
    // En una implementación real, cargaríamos el archivo PDF así:
    // iframe.src = `registro_de_ventas/Reporte_Financiero_${fecha}.pdf`;
    
    // Como no podemos cargar archivos locales, mostraremos un mensaje
    const htmlContent = `
        <html>
        <head>
            <style>
                body {
                    font-family: 'Segoe UI', sans-serif;
                    text-align: center;
                    padding: 50px;
                    background-color: #f8f9fa;
                }
                h1 {
                    color: #3498db;
                }
                p {
                    font-size: 18px;
                    line-height: 1.6;
                }
            </style>
        </head>
        <body>
            <h1>Reporte del ${fechaObj.toLocaleDateString('es-ES', opciones)}</h1>
            <p>En una implementación real, aquí se mostraría el PDF guardado para esta fecha.</p>
            <p>Archivo: <strong>Reporte_Financiero_${fecha}.pdf</strong></p>
        </body>
        </html>
    `;
    
    // Establecer el contenido del iframe
    iframe.srcdoc = htmlContent;
}

// Cerrar el visualizador de PDF
function cerrarVisualizador() {
    document.querySelector('#pdf-viewer').style.display = 'none';
    document.querySelector('#calendar-container').style.display = 'block';
}

// Calcular total de gastos
function calcularTotalGastos() {
    let total = 0;
    const costos = document.querySelectorAll('.costo-input');
    
    costos.forEach(costo => {
        if (costo.value) {
            total += parseFloat(costo.value);
        }
    });
    
    document.getElementById('total-gastos').textContent = '$' + total.toFixed(2);
    document.getElementById('resumen-gastos').textContent = '$' + total.toFixed(2);
    
    calcularResultadoDia();
}

// Calcular fila de ingresos (precio * cantidad)
function calcularFila(input) {
    const fila = input.parentElement.parentElement;
    const precio = parseFloat(input.getAttribute('data-precio'));
    const cantidad = parseFloat(input.value) || 0;
    const total = precio * cantidad;
    
    fila.querySelector('.total-cell').textContent = '$' + total.toFixed(2);
    
    calcularTotalIngresos();
}

// Calcular fila personalizada (para filas con precio editable)
function calcularFilaPersonalizada(input) {
    const fila = input.parentElement.parentElement;
    const precioInput = fila.querySelector('.precio-input');
    const cantidadInput = fila.querySelector('.cantidad-input');
    
    const precio = parseFloat(precioInput.value) || 0;
    const cantidad = parseFloat(cantidadInput.value) || 0;
    const total = precio * cantidad;
    
    fila.querySelector('.total-cell').textContent = '$' + total.toFixed(2);
    
    calcularTotalIngresos();
}

// Calcular total de ingresos
function calcularTotalIngresos() {
    let total = 0;
    const celdas = document.querySelectorAll('.total-cell');
    
    celdas.forEach(celda => {
        if (celda.textContent !== '$0.00') {
            total += parseFloat(celda.textContent.replace('$', ''));
        }
    });
    
    document.getElementById('total-ingresos').textContent = '$' + total.toFixed(2);
    document.getElementById('resumen-ingresos').textContent = '$' + total.toFixed(2);
    
    calcularResultadoDia();
}

// Calcular resultado del día
function calcularResultadoDia() {
    const totalGastos = parseFloat(document.getElementById('resumen-gastos').textContent.replace('$', ''));
    const totalIngresos = parseFloat(document.getElementById('resumen-ingresos').textContent.replace('$', ''));
    
    const resultado = totalIngresos - totalGastos;
    const resultadoElement = document.getElementById('resultado-dia');
    
    resultadoElement.textContent = '$' + resultado.toFixed(2);
    
    // Aplicar color según sea positivo o negativo
    if (resultado >= 0) {
        resultadoElement.className = 'green-text';
        document.getElementById('resultado-final').textContent = '¡Balance Positivo!';
        document.getElementById('resultado-final').className = 'positive';
    } else {
        resultadoElement.className = 'red-text';
        document.getElementById('resultado-final').textContent = 'Balance Negativo';
        document.getElementById('resultado-final').className = 'negative';
    }
}

// Función para agregar una nueva fila a la tabla de gastos
function agregarFilaGastos() {
    const tabla = document.querySelector('#gastos-table tbody');
    const ultimaFila = document.querySelector('#gastos-table .add-row-button').parentElement.parentElement;
    
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
        <td><input type="text" class="concepto-input"></td>
        <td><input type="text" class="detalle-input"></td>
        <td><input type="number" class="costo-input" onchange="calcularTotalGastos()" min="0"></td>
    `;
    
    tabla.insertBefore(nuevaFila, ultimaFila);
}

// Función para agregar una nueva fila a la tabla de ingresos
function agregarFilaIngresos() {
    const tabla = document.querySelector('#ingresos-table tbody');
    const ultimaFila = document.querySelector('#ingresos-table .add-row-button').parentElement.parentElement;
    
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
        <td><input type="text" class="concepto-input"></td>
        <td><input type="number" class="precio-input" min="0" step="0.01" onchange="calcularFilaPersonalizada(this)"></td>
        <td><input type="number" class="cantidad-input" min="0" onchange="calcularFilaPersonalizada(this)"></td>
        <td class="total-cell green-text">$0.00</td>
    `;
    
    tabla.insertBefore(nuevaFila, ultimaFila);
}

// Generar PDF y descargar
function generarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const content = document.getElementById('content-to-pdf');
    
    html2canvas(content).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 190;
        const pageHeight = 290;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        let heightLeft = imgHeight;
        let position = 10;
        
        doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        // Guardar el PDF
        pdfGenerado = doc.output('blob');
        pdfFileName = 'Reporte_Financiero_' + new Date().toISOString().slice(0, 10) + '.pdf';
        
        // Descargar el PDF
        doc.save(pdfFileName);
    });
}

// Función para guardar en carpeta (muestra el modal de confirmación)
function guardarEnCarpeta() {
    // Primero generar el PDF si no se ha generado
    if (!pdfGenerado) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const content = document.getElementById('content-to-pdf');
        
        html2canvas(content).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190;
            const pageHeight = 290;
            const imgHeight = canvas.height * imgWidth / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;
            
            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
            
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                doc.addPage();
                doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }
            
            // Guardar el PDF en memoria
            pdfGenerado = doc.output('blob');
            pdfFileName = 'Reporte_Financiero_' + new Date().toISOString().slice(0, 10) + '.pdf';
            
            // Mostrar el modal de confirmación
            mostrarModal();
        });
    } else {
        // Si ya se generó el PDF, solo mostrar el modal
        mostrarModal();
    }
}

// Mostrar modal de confirmación
function mostrarModal() {
    document.getElementById('confirm-modal').style.display = 'block';
}

// Cerrar modal
function cerrarModal() {
    document.getElementById('confirm-modal').style.display = 'none';
}

// Confirmar guardado del PDF en carpeta
function confirmarGuardado() {
    cerrarModal();
    
    // En un entorno real, aquí se guardaría el PDF en una carpeta del servidor
    // Como es una simulación en el navegador, mostraremos un mensaje
    
    // Crear la carpeta si no existe (esto es simulado)
    crearCarpetaRegistros();
    
    // Simular guardado
    setTimeout(() => {
        alert(`El reporte se ha guardado exitosamente en la carpeta "registro_de_ventas" con el nombre "${pdfFileName}"`);
        
        // Actualizar las fechas disponibles
        const fechaActual = new Date().toISOString().slice(0, 10);
        if (!fechasDisponibles.includes(fechaActual)) {
            fechasDisponibles.push(fechaActual);
            actualizarCalendario();
        }
    }, 1000);
}

// Función para simular la creación de la carpeta
function crearCarpetaRegistros() {
    console.log('Creando carpeta "registro_de_ventas" si no existe');
    // En un entorno real, aquí se crearía la carpeta en el servidor si no existe
    // Como estamos en el navegador, esto es solo una simulación
}

// Función para enviar email (dejada como referencia del código original)
function enviarEmail(pdfBlob, pdfName) {
    // Nota: Para enviar realmente un email se necesitaría integrar con un servicio de email
    // Esta es una simulación de la funcionalidad
    
    console.log('Enviando email a hugo.uaslp@gmail.com con el archivo ' + pdfName);
    
    // En una implementación real, aquí se usaría un servicio como EmailJS, FormSubmit, u otro
    // servicio para enviar el email con el PDF adjunto
    
    // Por motivos de demostración, se muestra un mensaje de éxito
    setTimeout(() => {
        console.log('Email enviado exitosamente');
    }, 1000);
}
