<?php
session_start();
if (empty($_SESSION['user_despacho'])) {
  header("Location: index.html");
  exit;
} else {
?>

<style>
   .dataTables_wrapper .dataTables_paginate .paginate_button {
        padding: 0.25em 0.5em;
        margin-left: 2px;
        border-radius: 0.25em;
        background-color: #007bff;
        color: #fff;
        border: 1px solid transparent;
        cursor: pointer;
        font-size: 0.75em;
    }

    .dataTables_wrapper .dataTables_paginate .paginate_button:hover {
        background-color: #0056b3;
    }

    .dataTables_wrapper .dataTables_paginate .paginate_button.current {
        background-color: #0056b3;
        border: 1px solid #0056b3;
    }

    .dataTables_wrapper .dataTables_paginate .paginate_button.disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
</style>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Despacho Enriquez y Asociados</title>
    <link rel="icon" type="image/png" href="https://i.imgur.com/smR4gK6.png">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="https://cdn.datatables.net/1.11.5/js/jquery.dataTables.min.js"></script>
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/dataTables.dataTables.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/buttons/2.0.1/css/buttons.dataTables.min.css">
    <script src="https://cdn.datatables.net/buttons/2.0.1/js/dataTables.buttons.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.0.1/js/buttons.html5.min.js"></script>
    <script src="https://cdn.datatables.net/buttons/2.0.1/js/buttons.print.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" crossorigin="anonymous" />
</head>
<style>
  .nav-item {
    margin-bottom: 10px; 
    margin-left: 10px; 
  }
</style>

<body>
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#" onclick="loadForm('views/home.html');">
        <img src="https://i.imgur.com/smR4gK6.png" alt="Image" width="30" height="30" class="d-inline-block align-top" loading="lazy">
        ENRIQUEZ & ASOCIADOS
    </a>
    
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    
    <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav mr-auto">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="registrarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Registrar
                </a>
                <div class="dropdown-menu" aria-labelledby="registrarDropdown">
                    <a class="dropdown-item" onclick="loadForm('views/Altausuarios.html')">Registro de Usuarios</a>
                    <a class="dropdown-item" onclick="loadForm('views/altaClientes.php')">Registro de Clientes</a>
                    <a class="dropdown-item" onclick="loadForm('views/Altadegiros.html')">Registro de Giros</a>
                    <a class="dropdown-item" onclick="loadForm('views/Altadezonas.html')">Registro de Zonas</a>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="directorioDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Directorio
                </a>
                <div class="dropdown-menu" aria-labelledby="directorioDropdown">
                    <a class="dropdown-item" onclick="loadForm('views/baseClientes.php')">Directorio de Clientes</a>
                    <a class="dropdown-item" onclick="loadForm('views/baseUsuarios.php')">Directorio de Usuarios del Sistema</a>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="declaracionesDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Declaraciones
                </a>
                <div class="dropdown-menu" aria-labelledby="declaracionesDropdown">
                    <a class="dropdown-item" onclick="loadForm('views/declaraciones.php')">Declaraciones</a>
                    <a class="dropdown-item" onclick="loadForm('views/declaracionesmoviles.php')">Entregar Declaraciones</a>
                    <a class="dropdown-item" onclick="loadForm('views/generardeclaraciones.php')">Generar Declaraciones</a>
                </div>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="pagosDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Pagos
                </a>
                <div class="dropdown-menu" aria-labelledby="pagosDropdown">
                        <a class="dropdown-item" onclick="loadForm('views/Pagos.php')">Gestión de nómina</a>
                    <a class="dropdown-item" onclick="loadForm('views/Pagos_Moviles.php')">Registrar Pago</a>
                </div>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#" onclick="loadForm('views/Nomina.php')">Generar Nómina del Mes</a>
            </li>
        </ul>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="usuarioDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <?php echo $_SESSION['nombreuser_despacho']."  "; ?><i class="fa fa-user"></i>
                </a>
                <div class="dropdown-menu" aria-labelledby="usuarioDropdown">
                    <a class="dropdown-item" href="#" id="exitApp">Cerrar sesión</a>
                </div>
            </li>
        </ul>
    </div>
</nav>

<br>
<div class="d-flex justify-content-center">
    <div class="alert alert-primary alert-dismissible fade show" role="alert">
        <h4 class="alert-heading">¡Bienvenido, <?php echo $_SESSION['nombreuser_despacho']; ?>!</h4>
        <hr>
        <p class="mb-0">Bienvenid@ al sistema web del despacho</p>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
</div>

<div id="dynamic-content" class="container-fluid">
    <!-- Contenido dinámico cargado aquí -->
</div>

<script>
function loadForm(formUrl) {
    $.ajax({
        url: formUrl,
        type: 'GET',
        success: function(data) {
            $('#dynamic-content').html(data);
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar el formulario:', error);
        }
    });
}

loadForm('views/home.html');

$(document).on('click', '#exitApp', function() {
    Swal.fire({
        title: 'Cerrando sesión',
        text: 'Por favor, espere...',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false
    });
    $.ajax({
        url: 'php/sesion.php',
        method: 'POST',
        dataType: 'json',
        success: function(response) {
            if (response.status == 1) {
                window.location.href = 'index.html';
            } else {
                Swal.fire('¡Error!', response.msg, 'error');
            }
        },
        error: function() {
            Swal.fire('¡Error!', 'Hubo un problema al cerrar sesión', 'error');
        }
    });
});
</script>

</body>
</html>

<?php
}
?>
