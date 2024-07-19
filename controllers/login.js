$(document).ready(function() {
    $('#login-form').submit(function(event) {
        event.preventDefault(); 
        
        var username = $('#username').val();
        var password = $('#password').val();
        
        // Enviar los datos mediante AJAX
        $.ajax({
            type: 'POST',
            url: '../php/login.php', // Archivo PHP para procesar la solicitud de inicio de sesión
            data: {
                username: username,
                password: password,
            },
            dataType: 'JSON',
            success: function(response) {
                console.log(response)
                if(response.status == 1) {
                    //Login exitoso
                    Swal.fire("Éxito", 'Acceso correcto al sistema', 'success');

                    window.location.href = 'home.php';
                } else {
                    Swal.fire("Lo sentimos...", response.msg, 'error');

                }
            }
        });
    });
});