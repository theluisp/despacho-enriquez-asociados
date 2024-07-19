var despacho = "ALL";

setTimeout(function() {
    obtenerUsuarios(despacho);
}, 1300);

function obtenerUsuarios(despacho) {
    const columnas = [
        { data: "nombre", title: "Nombre" },
        { data: "apellidopaterno", title: "Apellido Paterno" },
        { data: "apellidomaterno", title: "Apellido Materno" },
        { data: "username", title: "Nombre de usuario" },
        { data: "nombre_despacho", title: "Despacho" }
    ];

    // Mostrar el modal de carga
    Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false
    });
    Swal.showLoading();

    /*if ($.fn.DataTable.isDataTable("#usuariosTable")) {
        // Destruir la instancia anterior de DataTable
        $("#usuariosTable").DataTable().destroy();
    }
*/
    // Crear o recrear la tabla DataTables
    const datatable = new DataTable("#usuariosTable", {
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json",
        },
        pageLength: 10,
        processing: true,
        serverSide: true,
        destroy: true,
        searching: true,
        order: [[0, "asc"]],
        lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, "Todos"],
        ],
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel', 'copyHtml5','pdfHtml5','pdf', 'print'
        ],
        ajax: {
            url: "php/usuarios.php",
            type: "POST",
            dataType: "json",
            data: {
                function: "obtenerUsuarios",
                despacho: despacho
            }
        },
        columns: columnas,
        // Cuando se complete la carga de datos, cerrar el modal de carga
        initComplete: function(settings, json) {
            Swal.close();
        }
    });
}

setTimeout(obtenerUsuarios, 1000);

function obtenerDespachos() {
    $.ajax({
        url: 'php/metodos.php',
        type: 'POST',
        dataType: 'json',
        data: {
            function: 'obtenerDespachos'
        },
        success: function(response) {
            $('#filtro-despacho').empty();

            $('#filtro-despacho').append($('<option>', {
                value: '',
                text: 'Selecciona un despacho'
            }));

            $('#filtro-despacho').append($('<option>', {
                value: 'ALL',
                text: 'Todos los despachos'
            }));

            $.each(response, function(index, despacho) {
                $('#filtro-despacho').append($('<option>', {
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

setTimeout(obtenerDespachos, 1000);

$('#search').click(function() {
    var despacho = $("#filtro-despacho").val();
    console.log("si");
    obtenerUsuarios(despacho);
});
