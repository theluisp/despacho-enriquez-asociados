$(document).ready(function() {
    $('#altausuarios').submit(function(event) {
        event.preventDefault(); 
        
        var nombre = $('#nombre').val();
        var apellidopaterno = $('#apellidoPaterno').val();
        var apellidomaterno = $('#apellidoMaterno').val();
        var password = $('#password').val();
        var confirmPassword = $('#passwordto').val(); // Agregar la variable para confirmar contraseña

        // Verifica si algún campo está vacío
        if (nombre === "" || apellidopaterno === "" || apellidomaterno === "" || password === "" || confirmPassword === "") {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor revisa que ningún campo esté vacío',
            });
            return false;
        } else if (password !== confirmPassword) { // Verificar si las contraseñas no coinciden
            event.preventDefault(); // Detener el envío del formulario

            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Las contraseñas no coinciden',
            });
            return false;
        } else {
            // Enviar los datos mediante AJAX
            $.ajax({
                type: 'POST',
                url: '../php/alta.php', // Archivo PHP para procesar la solicitud de inicio de sesión
                data: {
                    nombre: nombre,
                    apellidopaterno: apellidopaterno,
                    apellidomaterno: apellidomaterno,
                    password: password,confirmPassword:confirmPassword
                },
                dataType: 'JSON',
                success: function(response) {
                    console.log(response);
                    if (response.status == 1) {
                        Swal.fire("Éxito", response.msg + " " + response.user, 'success');

                        $('#nombre').val('');
                        $('#apellidoPaterno').val('');
                        $('#apellidoMaterno').val('');
                        $('#password').val('');
                        $('#passwordto').val(''); // Limpiar campo de confirmar contraseña
                    } else {
                        Swal.fire("Lo sentimos...", response.msg, 'error');
                    }
                }
            });
        }
    });
});

