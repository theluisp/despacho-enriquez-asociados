var despachoPago = "ALL";

setTimeout(function() {
    obtenerUsuarios(despachoPago);
}, 1000);

function obtenerUsuarios(despachoPago = null, giroPago = null, zonaPago = null) {
    var columnasPago = [
       { 
            data: null, 
            title: "Cliente",
            render: function(data, type, row) {
                return `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`;
            }
        },
        
        { data: "rfc", title: "RFC" },
       {
            data: "periodo",
            title: "Periodo",
            render: function(data, type, row) {
                let date = new Date(data);
                let month = (date.getMonth() + 1).toString().padStart(2, '0');
                let year = date.getFullYear();
                return `${month}-${year}`;
            }
        },
        { data: "fecha", title: "Fecha de pago" },
         { data: "monto", title: "Monto" },
           { data: "monto_pagado", title: "Monto pagado" },
        { data: null, title: "Acciones" }
    ];

    Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false
    });
    Swal.showLoading();

    var datatablePago = new DataTable("#usuariosTable", {
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json",
        },
        pageLength: 10,
        processing: true,
        serverSide: true,
        destroy: true,
        searching: true,
        responsive: true,
        order: [[0, "asc"]],
        lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, "Todos"],
        ],
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel', 'copyHtml5', 'pdfHtml5', 'pdf', 'print'
        ],
        ajax: {
            url: "php/pagos.php",
            type: "POST",
            dataType: "json",
            data: {
                function: "getPagos",
                despacho: despachoPago,
                giro: giroPago,
                zona: zonaPago
            }
        },
        columns: columnasPago,
        columnDefs: [
            {
                targets: 6,
                render: function(data, type, row) {
                    var PagarBtn = `<button type="button" class="btn btn-success editarBtnPago" data-rfc="${row.rfc}" data-id="${row.id}">💲Pagar</button>`;
                    
                    var CancelarBtn = `<button type="button" class="btn btn-danger cancelarBtnPago" data-rfc="${row.rfc}" data-id="${row.id}">💸Cancelar</button>`;
                    
                    return PagarBtn + " " + CancelarBtn;
                }
            },
            {
                targets: 4,
                render: function(data, type, row) {
                    return "$" + data;
                }
            },
            {
                targets: 5,
                render: function(data, type, row) {
                    if (data == null) {
                        data = 0;
                    }
                    return "$" + data;
                }
            }
        ],
        
        initComplete: function(settings, json) {
            Swal.close();
            actualizarPagos(json.pagos_recibidos, json.pagos_faltantes); // Llamada para actualizar los datos en las tarjetas
        }
    });
}

function actualizarPagos(recibidos, faltantes) {
    document.getElementById('title-pagos-recibidos').innerText = recibidos;
    document.getElementById('title-pagos-faltantes').innerText = faltantes;
}

$('#usuariosTable').on('click', '.editarBtnPago', function() {
    var rfc = $(this).data("rfc");
    var id = $(this).data("id");
    Swal.fire({
        title: "Agregar Pago",
        text: "¿Deseas agregar un pago para el cliente con RFC: " + rfc + "?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#0A6847",
        confirmButtonText: "Agregar Pago"
    }).then((result) => {
        if (result.value) {
            Swal.fire({
                title: "Ingresar cantidad de pago",
                input: "text",
                inputLabel: "Cantidad",
                inputPlaceholder: "Ingresa la cantidad a pagar",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#0A6847",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Cancelar",
                inputValidator: (value) => {
                    if (!value) {
                        return "Debes ingresar una cantidad";
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    var cantidadPago = result.value;
                    $.ajax({
                        url: 'php/pagos.php',
                        method: 'POST',
                        data: {
                            function: 'pagar',
                            id_update: id,
                            status: '1',
                            monto_pagado: cantidadPago
                        },
                        dataType: 'json',
                        success: function(response) {
                            if (response.status == 1) {
                                Swal.fire('¡Éxito!', response.msg, 'success');
                                obtenerUsuarios('ALL');
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
        }
    });
});

$('#usuariosTable').on('click', '.cancelarBtnPago', function() {
    var rfc = $(this).data("rfc");
    var id = $(this).data("id");
    Swal.fire({
        title: "Cancelar Pago",
        text: "¿Deseas cancelar el pago para el cliente con RFC: " + rfc + "?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Cancelar Pago",
        cancelButtonText: "Volver"
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Comentario de Cancelación",
                input: "textarea",
                inputLabel: "Ingresa el motivo de la cancelación",
                inputPlaceholder: "Motivo de la cancelación",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Confirmar",
                cancelButtonText: "Volver",
                inputValidator: (value) => {
                    if (!value) {
                        return "Debes ingresar un motivo";
                    }
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    var comentarioCancelacion = result.value;
                    $.ajax({
                        url: 'php/pagos.php',
                        method: 'POST',
                        data: {
                            function: 'cancelar',
                            id_update: id,
                            status: '0',
                            comentario: comentarioCancelacion
                        },
                        dataType: 'json',
                        success: function(response) {
                            if (response.status == 1) {
                                Swal.fire('¡Éxito!', response.msg, 'success');
                                obtenerUsuarios('ALL');
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
        }
    });
});