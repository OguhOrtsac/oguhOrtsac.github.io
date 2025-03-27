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
    // Usamos la API del sistema de archivos para listar los archivos en la carpeta
    try {
        // Verificar si la carpeta existe primero
        const fs = require('fs');
        const path = require('path');
        const carpeta = path.join(__dirname, 'registro_de_ventas');
        
        if (!fs.existsSync(carpeta)) {
            // Si la carpeta no existe, la creamos
            fs.mkdirSync(carpeta, { recursive: true });
            console.log('Carpeta de registros creada.');
            // No hay archivos todavía
            fechasDisponibles = [];
            actualizarCalendario();
            return;
        }
        
        // Leer todos los archivos en la carpeta
        const archivos = fs.readdirSync(carpeta);
        
        // Filtrar solo archivos PDF
        const pdfFiles = archivos.filter(archivo => archivo.endsWith('.pdf') && archivo.startsWith('Reporte_Financiero_'));
        
        // Extraer fechas de los nombres de archivo
        const fechas = pdfFiles.map(archivo => {
            // Formato esperado: Reporte_Financiero_YYYY-MM-DD.pdf
            const match = archivo.match(/Reporte_Financiero_(\d{4}-\d{2}-\d{2})\.pdf/);
            return match ? match[1] : null;
        }).filter(fecha => fecha !== null);
        
        // Actualizar la variable global
        fechasDisponibles = fechas;
        
        console.log('Fechas disponibles cargadas:', fechasDisponibles);
    } catch (error) {
        console.error('Error al cargar fechas disponibles:', error);
        // Si hay error, usar un array vacío
        fechasDisponibles = [];
    }
    
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
    
    // Cargar el PDF desde la carpeta
    const iframe = document.getElementById('pdf-iframe');
    
    // Cargar el archivo PDF directamente desde la carpeta de registros
    const rutaPDF = `registro_de_ventas/Reporte_Financiero_${fecha}.pdf`;
    
    try {
        // Verificar si el archivo existe antes de cargarlo
        const fs = require('fs');
        const path = require('path');
        const rutaCompleta = path.join(__dirname, rutaPDF);
        
        if (fs.existsSync(rutaCompleta)) {
            // Si el archivo existe, cargar en el iframe
            iframe.src = rutaPDF;
        } else {
            // Si no existe, mostrar mensaje de error
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
                            color: #e74c3c;
                        }
                        p {
                            font-size: 18px;
                            line-height: 1.6;
                        }
                    </style>
                </head>
                <body>
                    <h1>Error: Archivo no encontrado</h1>
                    <p>No se pudo encontrar el reporte para la fecha ${fechaObj.toLocaleDateString('es-ES', opciones)}.</p>
                    <p>Ruta buscada: <strong>${rutaPDF}</strong></p>
                </body>
                </html>
            `;
            iframe.srcdoc = htmlContent;
        }
    } catch (error) {
        console.error('Error al cargar el PDF:', error);
        // Mostrar mensaje de error en el iframe
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
                        color: #e74c3c;
                    }
                    p {
                        font-size: 18px;
                        line-height: 1.6;
                    }
                </style>
            </head>
            <body>
                <h1>Error al cargar el PDF</h1>
                <p>Ocurrió un error al intentar cargar el reporte.</p>
                <p>Detalles: ${error.message}</p>
            </body>
            </html>
        `;
        iframe.srcdoc = htmlContent;
    }
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
    
    // Verificar que tenemos un PDF generado
    if (!pdfGenerado) {
        alert('Error: No hay PDF para guardar.');
        return;
    }
    
    // Crear la carpeta si no existe
    if (!crearCarpetaRegistros()) {
        return; // Si hay error al crear la carpeta, abortar
    }
    
    try {
        // Guardar el PDF en el sistema de archivos
        const fs = require('fs');
        const path = require('path');
        
        // Convertir el Blob a un Buffer para escribirlo en el sistema de archivos
        const reader = new FileReader();
        reader.onload = function() {
            const buffer = Buffer.from(new Uint8Array(reader.result));
            
            // Ruta donde se guardará el archivo
            const rutaArchivo = path.join(__dirname, 'registro_de_ventas', pdfFileName);
            
            // Escribir el archivo
            fs.writeFile(rutaArchivo, buffer, (err) => {
                if (err) {
                    console.error('Error al guardar el PDF:', err);
                    alert('Error al guardar el PDF: ' + err.message);
                } else {
                    console.log('PDF guardado exitosamente en:', rutaArchivo);
                    alert(`El reporte se ha guardado exitosamente en la carpeta "registro_de_ventas" con el nombre "${pdfFileName}"`);
                    
                    // Actualizar las fechas disponibles
                    const fechaActual = new Date().toISOString().slice(0, 10);
                    if (!fechasDisponibles.includes(fechaActual)) {
                        fechasDisponibles.push(fechaActual);
                        actualizarCalendario();
                    }
                }
            });
        };
        
        // Leer el Blob como ArrayBuffer
        reader.readAsArrayBuffer(pdfGenerado);
        
    } catch (error) {
        console.error('Error al procesar el guardado del PDF:', error);
        alert('Error al guardar el PDF: ' + error.message);
    }
}

// Función para crear la carpeta de registros si no existe
function crearCarpetaRegistros() {
    try {
        const fs = require('fs');
        const path = require('path');
        const carpeta = path.join(__dirname, 'registro_de_ventas');
        
        if (!fs.existsSync(carpeta)) {
            fs.mkdirSync(carpeta, { recursive: true });
            console.log('Carpeta "registro_de_ventas" creada exitosamente.');
        } else {
            console.log('La carpeta "registro_de_ventas" ya existe.');
        }
        return true;
    } catch (error) {
        console.error('Error al crear la carpeta de registros:', error);
        alert('Error al crear la carpeta de registros: ' + error.message);
        return false;
    }
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
