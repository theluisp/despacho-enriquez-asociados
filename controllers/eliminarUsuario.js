// Función para eliminar un usuario
function eliminarUsuario(rfc) {
    // Enviar los datos mediante AJAX
    $.ajax({
        type: 'POST',
        url: '../php/eliminarUsuario.php', // Archivo PHP para procesar la solicitud de eliminación de usuario
        data: {
            rfc: rfc
        },
        dataType: 'JSON',
        success: function(response) {
            console.log(response)
            if(response.status == 1) {
                Swal.fire("Éxito", response.msg, 'success');
                // Limpiar los campos del formulario después de una eliminación exitosa
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

// Ejemplo de uso de la función para eliminar un usuario (debes llamar a esta función cuando quieras eliminar un usuario)
function eliminarUsuario() {
    var rfc = $('#rfc').val();

    // Verifica si el campo está vacío
    if (rfc === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor ingresa el RFC del usuario a eliminar',
        });
        return false;
    } else {
        // Llamada a la función para eliminar un usuario
        eliminarUsuario(rfc);
    }
}
