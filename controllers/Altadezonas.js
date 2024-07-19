$(document).ready(function() {
    $('#altazonas').submit(function(event) {
        event.preventDefault(); 
       
        var zona = $('#zona').val();

        // Verifica si algún campo está vacío
        if (zona === "") {
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
                url: '../php/altaZona.php', // Archivo PHP para procesar la solicitud de registro de cliente
                data: {
            
                    zona: zona
                    
                },
                dataType: 'JSON',
                success: function(response) {
                    console.log(response)
                    if(response.status == 1) {
                        Swal.fire("Éxito", response.msg, 'success');
                        // Limpiar los campos del formulario después de un registro exitoso
                   
                          $('#zona').val('');

                    } else {
                        Swal.fire("Lo sentimos...", response.msg, 'error');
                    }
                }
            });
        }
    });
});
