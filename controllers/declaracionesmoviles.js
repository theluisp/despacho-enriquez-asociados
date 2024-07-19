var despacho = "ALL";

setTimeout(function() {
    getUsuarios(despacho);
}, 1000);

function getUsuarios(despacho) {
    const columnas = [
        { data: "nombre", title: "Nombre" },
        { data: "rfc", title: "RFC" },
        { data: null, title: "Acciones" }
    ];

    // Mostrar el modal de carga
    Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false
    });
    Swal.showLoading();

    if ($.fn.DataTable.isDataTable("#usuariosTable")) {
        // Destruir la instancia anterior de DataTable
        $("#usuariosTable").DataTable().destroy();
    }

    // Crear o recrear la tabla DataTables
    $("#usuariosTable").DataTable({
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json",
        },
        pageLength: 10,
        processing: true,
        serverSide: true,
        searching: true,
        responsive: true,
        order: [[0, "asc"]],
        lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, "Todos"],
        ],
        dom: 'Bfrtip',
        buttons: ['csv', 'excel', 'copyHtml5', 'pdfHtml5', 'pdf', 'print'],
        ajax: {
            url: "php/declaracion.php",
            type: "POST",
            dataType: "json",
            data: {
                function: "declaraciones",
                despacho: despacho
            }
        },
        columns: columnas,
        columnDefs: [
            {
                targets: 0,
                render: function (data, type, row) {
                    return `${row.nombre} ${row.apellido_paterno} ${row.apellido_materno}`;
                }
            },
            {
                targets: 2,
                render: function (data, type, row) {
                    const status = row.status;
                    if (status == 0) {
                        return `<button type="button" class="btn btn-danger decenviada" data-id="${row.id}" data-nombre="${row.nombre}"> Enviar</button>`;
                    } else if (status == 1) {
                        var fecha = row.fecha_entrega;
                        var fechaParseada = new Date(fecha);
                        var nombre = row.nombre;
                        var apellidop = row.apellido_paterno;
                        var name = `${nombre} ${apellidop}`;
                        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
                        var mes = meses[fechaParseada.getMonth()];

                        return `
                            <button type="button" class="btn btn-success decentregada" data-id="${row.id}" data-nombre="${row.nombre}">
                                <i class="fa fa-check"></i> Entregar
                            </button>
                            <button type="button" onclick="window.open('views/firmas.php?cli=${row.id}&mes=${mes}&name=${name}', '_blank')" class="btn btn-info firmavoz" data-id="${row.id}">
                                <i class="fa fa-volume-up"></i> Entregar con firma de voz
                            </button>
                        `;
                    } else {
                        return "";
                    }
                }
            }
        ],
        initComplete: function (settings, json) {
            Swal.close();
        }
    });
}

$('#search').click(function() {
    var despacho = $("#estatus").val();
    if (despacho == '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor escoge un estatus válido',
        });
    } else {
        getUsuarios(despacho);
    }
});

$('#usuariosTable').on('click', '.decenviada', function() {
    var id_declaracion = $(this).data('id');
    var nombre_persona = $(this).data('nombre');
    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea marcar la declaración del cliente: "${nombre_persona}" como enviada para su entrega?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        input: 'text',
        inputPlaceholder: 'Ingrese su comentario aquí'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: 'php/declaracion.php',
                method: 'POST',
                data: {
                    function: 'actualizaStatus',
                    id_update: id_declaracion,
                    status: '1',
                    comentario: result.value
                },
                dataType: 'json',
                success: function(response) {
                    if (response.status == 1) {
                        Swal.fire('¡Éxito!', response.msg, 'success');
                        getUsuarios('ALL');
                    } else {
                        Swal.fire('¡Error!', response.msg, 'error');
                    }
                },
                error: function() {
                    Swal.fire('¡Error!', 'Hubo un problema al realizar la solicitud AJAX', 'error');
                }
            });
        }
    });
});

$('#usuariosTable').on('click', '.decentregada', function() {
    var id_declaracion = $(this).data('id');
    var nombre_persona = $(this).data('nombre');
    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea marcar la declaración del cliente: "${nombre_persona}" como entregada y finalizada?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        input: 'text',
        inputPlaceholder: 'Ingrese su comentario aquí'
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: 'php/declaracion.php',
                method: 'POST',
                data: {
                    function: 'actualizaStatus',
                    id_update: id_declaracion,
                    status: '2',
                    comentario: result.value
                },
                dataType: 'json',
                success: function(response) {
                    if (response.status == 1) {
                        Swal.fire('¡Éxito!', response.msg, 'success');
                        getUsuarios('ALL');
                    } else {
                        Swal.fire('¡Error!', response.msg, 'error');
                    }
                },
                error: function() {
                    Swal.fire('¡Error!', 'Hubo un problema al realizar la solicitud AJAX', 'error');
                }
            });
        }
    });
});
