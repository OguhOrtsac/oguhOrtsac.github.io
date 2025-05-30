// ----- Utilidades de fechas -----

function parseLocalDate(str) {
  // str: "YYYY-MM-DD"
  if (!str) return null;
  const [y, m, d] = str.split('-');
  return new Date(Number(y), Number(m) - 1, Number(d));
}
function nombreDia(dateObj) {
  // dateObj es un objeto Date
  const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  return dias[dateObj.getDay()];
}
function capitalizar(texto) {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// ----- Actualiza el texto de la semana/responsable -----
function mostrarSemana() {
  const inicio = $("#input-fecha-inicio").val();
  const fin = $("#input-fecha-fin").val();
  const responsable = $("#input-responsable").val();
  let semanaTxt = "";
  if (inicio && fin) {
    const f1 = parseLocalDate(inicio);
    const f2 = parseLocalDate(fin);
    semanaTxt = `Semana del <b>${capitalizar(nombreDia(f1))} ${f1.getDate()} de ${capitalizar(f1.toLocaleString('es-ES',{month:'long'}))} de ${f1.getFullYear()}</b> al <b>${capitalizar(nombreDia(f2))} ${f2.getDate()} de ${capitalizar(f2.toLocaleString('es-ES',{month:'long'}))} de ${f2.getFullYear()}</b>`;
  }
  $("#showSemana").html((semanaTxt ? semanaTxt + "<br>" : "") + (responsable ? `<span class="badge bg-info">Responsable: ${responsable}</span>` : ""));
}

$(document).ready(function () {
  $("#input-fecha-inicio, #input-fecha-fin, #input-responsable").on('input', mostrarSemana);

  // --- TABLA TRABAJADORES ---
  function recalcularTrab() {
    let suma = 0;
    $("#tabla-trabajadores tbody tr").each(function () {
      const costo = parseFloat($(this).find('.costo-dia').val()) || 0;
      const dias = parseFloat($(this).find('.dias').val()) || 0;
      const extra = parseFloat($(this).find('.extra').val()) || 0;
      const total = costo * dias + extra;
      $(this).find('.total-trab').text(`$${total.toFixed(2)}`);
      suma += total;
    });
    $("#suma-trab, #show-suma-trab").text(`$${suma.toFixed(2)}`);
    recalcularTotal();
  }
  $(document).on('input', '.costo-dia, .dias, .extra', recalcularTrab);

  $(document).on('click', '#agregar-trab', function () {
    $("#tabla-trabajadores tbody").append(`
      <tr>
        <td><input type="text" class="form-control nombre-trab" placeholder="Ej: Nombre"></td>
        <td><input type="number" class="form-control costo-dia" min="0" step="any" value=""></td>
        <td><input type="number" class="form-control dias" min="1" value="6"></td>
        <td><input type="number" class="form-control extra" min="0" step="any" value=""></td>
        <td class="total-trab">$0.00</td>
        <td><button class="btn btn-outline-danger btn-sm eliminar-fila-trab">&times;</button></td>
      </tr>
    `);
    recalcularTrab();
  });

  $(document).on('click', '.eliminar-fila-trab', function () {
    $(this).closest('tr').remove();
    recalcularTrab();
  });

  // --- TABLA EXTRAS ---
  function recalcularExtra() {
    let suma = 0;
    $("#tabla-extra tbody tr").each(function () {
      const precio = parseFloat($(this).find('.precio-extra').val()) || 0;
      suma += precio;
    });
    $("#suma-extra, #show-suma-extra").text(`$${suma.toFixed(2)}`);
    recalcularTotal();
  }
  $(document).on('input', '.precio-extra', recalcularExtra);

  $(document).on('click', '#agregar-extra', function () {
    $("#tabla-extra tbody").append(`
      <tr>
        <td><input type="text" class="form-control nombre-extra"></td>
        <td><input type="date" class="form-control fecha-extra"></td>
        <td><input type="number" class="form-control precio-extra" min="0" step="any" value=""></td>
        <td class="text-center"><button class="btn btn-outline-danger btn-sm eliminar-fila">&times;</button></td>
      </tr>
    `);
    recalcularExtra();
  });
  $(document).on('click', '.eliminar-fila', function () {
    $(this).closest('tr').remove();
    recalcularExtra();
  });

  // --- TABLA MATERIALES ---
  function recalcularMat() {
    let suma = 0;
    $("#tabla-materiales tbody tr").each(function () {
      const cant = parseFloat($(this).find('.material-cant').val()) || 0;
      const precio = parseFloat($(this).find('.material-precio').val()) || 0;
      const total = cant * precio;
      $(this).find('.material-total').text(`$${total.toFixed(2)}`);
      suma += total;
    });
    $("#suma-mat, #show-suma-mat").text(`$${suma.toFixed(2)}`);
    recalcularTotal();
  }
  $(document).on('input', '.material-cant, .material-precio', recalcularMat);

  $(document).on('click', '#agregar-mat', function () {
    $("#tabla-materiales tbody").append(`
      <tr>
        <td><input type="text" class="form-control material-nombre"></td>
        <td><input type="number" class="form-control material-cant" min="0" step="any" value=""></td>
        <td><input type="number" class="form-control material-precio" min="0" step="any" value=""></td>
        <td class="material-total">$0.00</td>
        <td class="text-center"><button class="btn btn-outline-danger btn-sm eliminar-fila-mat">&times;</button></td>
      </tr>
    `);
    recalcularMat();
  });
  $(document).on('click', '.eliminar-fila-mat', function () {
    $(this).closest('tr').remove();
    recalcularMat();
  });

  // --- Gasto total ---
  function recalcularTotal() {
    const t1 = parseFloat($("#suma-trab").text().replace('$', '')) || 0;
    const t2 = parseFloat($("#suma-extra").text().replace('$', '')) || 0;
    const t3 = parseFloat($("#suma-mat").text().replace('$', '')) || 0;
    const suma = t1 + t2 + t3;
    $("#gasto-total").text(`$${suma.toFixed(2)}`);
  }

  // --- Inicializa totales al cargar ---
  recalcularTrab();
  recalcularExtra();
  recalcularMat();

  // --- PDF ---
  $("#btn-pdf").click(function () {
    $('.btn, input, textarea').attr('disabled', true);
    html2canvas(document.body, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('control_semanal_bodegas.pdf');
      $('.btn, input, textarea').attr('disabled', false);
    });
  });

});
