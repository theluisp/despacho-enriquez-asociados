$(document).ready(function() {
    $('#altagiros').submit(function(event) {
        event.preventDefault(); 
        
        var giro = $('#giro').val();

        // Verifica si algún campo está vacío
        if (giro === "") {
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
                url: '../php/altaGiros.php', // Archivo PHP para procesar la solicitud de registro de cliente
                data: {
            
                    giro:giro
                    
                },
                dataType: 'JSON',
                success: function(response) {
                    console.log(response)
                    if(response.status == 1) {
                        Swal.fire("Éxito", response.msg, 'success');
                        // Limpiar los campos del formulario después de un registro exitoso
                   
                          $('#giro').val('');

                    } else {
                        Swal.fire("Lo sentimos...", response.msg, 'error');
                    }
                }
            });
        }
    });
});


