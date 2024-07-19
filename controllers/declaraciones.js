var despacho = "ALL";

setTimeout(function() {
    getUsuarios(despacho);
}, 1000);

function getUsuarios(estatus, mes, anio) {
    const columnas = [
        { data: "nombre", title: "Nombre" },
        { data: "rfc", title: "RFC" },
         { data: null, title: "Acciones" },
        { data: "fecha_entrega", title: "Fecha de entrega" },
        { data: "fecha_recibido", title: "Fecha de recibido por cliente" },
        { data: "comentario", title: "Comentario" },
        { data: "status_declaracion", title: "Estatus de la declaración" },
        { data: "tipo_declaracion", title: "Tipo declaración" },
        { data: null, title: "Archivo" },
       
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
    const datatable = new DataTable("#usuariosTable", {
        language: {
            url: "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json",
        },
        pageLength: 10,
        processing: true,
        serverSide: true,
        destroy: true,
        searching: true,
        responsive:true,
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
            url: "php/declaracion.php",
            type: "POST",
            dataType: "json",
            data: {
                function: "declaraciones",
                estatus: estatus,
                mes: mes,
                anio: anio
            }
        },
        columns: columnas,
        columnDefs: [
            
            {
                targets: 0,
                render: function (data, type, row) {
                    return row.nombre + " " + row.apellido_paterno +" "+ row.apellido_materno;
                }
            },
            {
                targets: 6, // Índice de la quinta columna (la numeración de índices comienza desde 0)
                render: function (data, type, row) {
                    const status = row.status; // Suponiendo que las fechas están separadas por coma

                    if (status == 0) {
                        return `<span class="badge badge-danger">No enviada</span>`;
                    } else if(status == 1) {
                        return `<span class="badge badge-warning">Enviada</span>`;
                    } else {
                        return `<span class="badge badge-success">Entregada</span>`;
                    }
                }
            },
             {
                targets: 7, 
                render: function (data, type, row) {
                   
                return '<span class="badge badge-success">'+row.tipo_declaracion+'</span>';
                    
                }
            },
       { 
    targets: 8, 
 render: function (data, type, row) {
    const archivo = row.archivo; 
    // Verificar si hay un archivo de audio
if (archivo !== null && archivo !== undefined && archivo !== '') {
        console.log("?")
         const byteCharacters = atob(archivo);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const audioBlob = new Blob([byteArray], { type: 'audio/mp3' });
    
            console.log("ok")
        // Construir el reproductor multimedia básico
        return `
        <audio controls>
            <source src="${URL.createObjectURL(audioBlob)}" type="audio/mpeg">
            No se soporta el audio.
        </audio>`;
    } else {
        // Si no hay archivo de audio, mostrar un mensaje
        return `<span class="badge badge-danger">No hay archivo de audio</span>`;
    }
}
}
,
            {
                targets: 2,
                render: function(data, type, row) {
                    const status = row.status;
                    console.log(row)
                var nombre_persona = row.nombre + " " + row.apellido_paterno;
                if (status == 0) {
                    return `<button type="button" class="btn btn-danger decenviada" data-id="${row.id}" data-nombre="${nombre_persona}"> Enviar</button>`;

                    }else if(status==1){
                        var fecha = row.fecha_entrega;
                        var fechaParseada = new Date(fecha);
                        var nombre = row.nombre;
                        var apellidop = row.apellido_paterno;
                        var name = nombre + " " + apellidop;
var meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
var mes = meses[fechaParseada.getMonth()];

                        return `<button type="button" class="btn btn-success decentregada" data-id="${row.id}" data-nombre="${nombre_persona}">
    <i class="fa fa-check"></i> Entregar
<button type="button" onclick="window.open('views/firmas.php?cli=${row.id}&mes=${mes}&name=${name}', '_blank')" class="btn btn-info firmavoz" data-id="${row.id}">
    <i class="fa fa-volume-up"></i> Entregar con firma de voz
</button>`;

                         
                    }
                    else{
                          return "";
                         
                    }
                
                  
                }
            }
        ],
        // Cuando se complete la carga de datos, cerrar el modal de carga
    initComplete: function(settings, json) {
        console.log(json); // Asegúrate de que la respuesta se imprima correctamente en la consola del navegador
        document.getElementById("entregadas").innerText = json.entregadas;
         document.getElementById("generadas").innerText = json.generadas;
          document.getElementById("no_entregadas").innerText = json.no_entregadas;
        Swal.close(); // Cierra el modal de carga después de completar la inicialización de la tabla
    }
    });
}

$('#search').click(function() {
    var estatus = $("#estatus").val();
    var mes = $("#mes").val();
    var anio = $("#anio").val();
    
    if(estatus ==''){
        Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Por favor escoge un estatus válido',
            });
    }
    else{    getUsuarios(estatus, mes, anio);
}
});

$('#usuariosTable').on('click', '.decenviada', function() {
    var id_declaracion = $(this).data('id');
    var nombre_persona = $(this).data('nombre'); // Aquí capturas el nombre de la persona
    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea marcar esta declaración del cliente: "${nombre_persona}" como enviada para su entrega?`, // Aquí usas nombre_persona
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
    var nombre_persona = $(this).data('nombre'); // Aquí capturas el nombre de la persona
    Swal.fire({
        title: '¿Está seguro?',
        text: `¿Desea marcar esta declaración del cliente: "${nombre_persona}" como entregada y finalizada?`, // Aquí usas nombre_persona
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
