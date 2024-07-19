// Función de edición de cliente
function edicionCliente(nombre, apellidoPaterno, apellidoMaterno, rfc, zona, fechaPago, despacho, monto, giro) {
    // Enviar los datos mediante AJAX
    $.ajax({
        type: 'POST',
        url: '../php/edicionCliente.php', // Archivo PHP para procesar la solicitud de actualización de cliente
        data: {
            
            nombre: nombre,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            rfc: rfc,
            zona: zona,
            fechaPago: fechaPago,
            despacho: despacho,
            monto: monto,
            giro: giro
        },
        dataType: 'JSON',
        success: function(response) {
            console.log(response)
            if(response.status == 1) {
                Swal.fire("Éxito", response.msg, 'success');
                // Limpiar los campos del formulario después de una actualización exi
            } else {
                Swal.fire("Lo sentimos...", response.msg, 'error');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error en la solicitud:', error);
            // Manejar el error según sea necesario
        }
    });
}

// Ejemplo de uso de la función de edición de cliente (debes llamar a esta función cuando quieras actualizar un cliente)
function ejemploEdicionCliente() {
    var nombre = $('#nombre').val();
    var apellidoPaterno = $('#apellidoPaterno').val();
    var apellidoMaterno = $('#apellidoMaterno').val();
    var rfc = $('#rfc').val();
    var zona = $('#zona').val();
    var fechaPago = $('#fechaPago').val();
    var despacho = $('#despacho').val();
    var giro = $('#giro').val();
    var monto = $('#monto').val();
  ; // Asumiendo que hay un campo oculto en el formulario con el ID del cliente

    // Verifica si algún campo está vacío
    if (nombre === "" || apellidoPaterno === "" || apellidoMaterno === "" || rfc === "" || zona === "" || fechaPago === "" || despacho === "" || monto === "" || giro === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor revisa que ningún campo esté vacío',
        });
        return false;
    } else {
        // Llamada a la función de edición de cliente
        edicionCliente(nombre, apellidoPaterno, apellidoMaterno, rfc, zona, fechaPago, despacho, monto, giro);
    }
}
