$(document).ready(function() {
    $('#altaclientes').submit(function(event) {
        event.preventDefault(); 
        
        var nombre = $('#nombre').val();
        var apellidoPaterno = $('#apellidoPaterno').val();
        var apellidoMaterno = $('#apellidoMaterno').val();
        var rfc = $('#rfc').val();
        var zona = $('#zona').val();
        var fechaPago = $('#fechaPago').val();
        var despacho = $('#despacho').val();
        var giro = $('#giro').val();

        var monto = $('#monto').val();

        // Verifica si algún campo está vacío
        if (nombre === "" || apellidoPaterno === "" || apellidoMaterno === "" || rfc === "" || zona === "" || fechaPago === "" || despacho === "" || monto === "" || giro === "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor revisa que ningún campo esté vacío',
            });
            return false;
        } else {
            // Enviar los datos mediante AJAX
            $.ajax({
                type: 'POST',
                url: '../php/altaClientes.php', // Archivo PHP para procesar la solicitud de registro de cliente
                data: {
                    nombre: nombre,
                    apellidoPaterno: apellidoPaterno,
                    apellidoMaterno: apellidoMaterno,
                    rfc: rfc,
                    zona: zona,
                    fechaPago: fechaPago,
                    despacho: despacho,
                    monto: monto,
                    giro:giro
                    
                },
                dataType: 'JSON',
                success: function(response) {
                    console.log(response)
                    if(response.status == 1) {
                        Swal.fire("Éxito", response.msg, 'success');
                        // Limpiar los campos del formulario después de un registro exitoso
                        $('#nombre').val('');
                        $('#apellidoPaterno').val('');
                        $('#apellidoMaterno').val('');
                        $('#rfc').val('');
                        $('#zona').val('');
                        $('#fechaPago').val('');
                        $('#despacho').val('');
                          $('#monto').val('');
                          $('#giro').val('');

                    } else {
                        Swal.fire("Lo sentimos...", response.msg, 'error');
                    }
                }
            });
        }
    });
});



function obtenerZonas() {
    $.ajax({
        url: 'php/metodos.php',
        type: 'POST',
        dataType: 'json',
        data: {
            function: 'obtenerZonas'
        },
        success: function(response) {
            $('#zona').empty();
            $('#zona').append($('<option>', {
                value: '',
                text: 'Selecciona una zona'
            }));

           
            $.each(response, function(index, despacho) {
                $('#zona').append($('<option>', {
                     value: despacho.id,
                    text: despacho.nombre
                }));
            });
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener los despachos:', error);
            // Manejar el error según sea necesario
        }
    });
}



function getGiros() {
    $.ajax({
        url: 'php/metodos.php',
        type: 'POST',
        dataType: 'json',
        data: {
            function: 'obtenerGiro'
        },
        success: function(response) {
            $('#giro').empty();
            $('#giro').append($('<option>', {
                value: '',
                text: 'Selecciona un giro'
            }));

           
            $.each(response, function(index, giros) {
                $('#giro').append($('<option>', {
                     value: giros.id,
                    text: giros.nombre
                }));
            });
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener los despachos:', error);
            // Manejar el error según sea necesario
        }
    });
}
setTimeout(getGiros, 1000);

setTimeout(obtenerZonas, 1000);

