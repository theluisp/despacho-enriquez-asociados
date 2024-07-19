var despacho = "ALL";

setTimeout(function() {
    getUsuarios(despacho);
}, 1000);

function getUsuarios(despacho =null, giro=null,zona=null) {
    const columnas = [
        { data: "nombre", title: "Nombre" },
        { data: "apellido_paterno", title: "Apellido Paterno" },
        { data: "apellido_materno", title: "Apellido Materno" },
        { data: "rfc", title: "RFC" },
        { data: "zona_name", title: "Zona" },
        { data: "monto", title: "Monto" },
        { data: "fecha_de_pago", title: "Fecha de Pago" },
        { data: "nombre_despacho", title: "Despacho" },
        { data: "giro_name", title: "Giro" },
        { data: null, title: "Acciones" }


    ];

    // Mostrar el modal de carga
    Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false
    });
    Swal.showLoading();

  /*  if ($.fn.DataTable.isDataTable("#usuariosTable")) {
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
         responsive: true,
        order: [[0, "asc"]],
        lengthMenu: [
            [10, 25, 50, 100000],
            [10, 25, 50, "Todos"],
        ], 
          dom: 'Blrftip',
        buttons: [
            'csv', 'excel', 'copyHtml5','pdfHtml5','pdf', 'print'
        ],
        ajax: {
            url: "php/clientes.php",
            type: "POST",
            dataType: "json",
            data: {
                function: "obtenerClientes",
                despacho: despacho,
                giro: giro,
                zona: zona

            }
            
        },
        
        columns: columnas,
        columnDefs: [
        {
            targets: 6, // Índice de la quinta columna (la numeración de índices comienza desde 0)
            render: function (data, type, row) {
                const fecha = row.fecha_de_pago; // Suponiendo que las fechas están separadas por coma

                if (fecha == 15) {
                                     return `<span class="badge badge-secondary">15 de cada mes</span>`;
                } else if(fecha == 1)
                {
                                     return `<span class="badge badge-secondary">1 de cada mes</span>`;

                }
                 else if(fecha == 2)
                {
                                     return `<span class="badge badge-secondary">Bimestral</span>`;

                }
                else {
                                    return `<span class="badge badge-secondary">Extraordinarios</span>`;

                }
            }
        },
       
    {
    targets: 9,
    render: function(data, type, row) {

        // Botón para editar
        const editarBtn = `<button type="button" class="btn btn-primary editarBtn" data-rfc="${row.rfc}" >Editar</button>`;
        
        
        
        
        // Botón para eliminar
       const eliminarBtn = `<button type="button" class="btn btn-danger eliminarBtn2" data-rfc="${row.rfc}">Eliminar</button>`;


        // Devolver los dos botones concatenados
        return editarBtn + " " + eliminarBtn;
    }
}


    ],
        // Cuando se complete la carga de datos, cerrar el modal de carga
        initComplete: function(settings, json) {
        console.log(json); // Asegúrate de que la respuesta se imprima correctamente en la consola del navegador
        document.getElementById("title-pagos-recibidos").innerText = json.recordsTotal;
        Swal.close(); // Cierra el modal de carga después de completar la inicialización de la tabla
    }
    });
}

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
    var giro = $("#filtro-giro").val();
    var zona = $("#filtro-zona").val();

    getUsuarios(despacho, giro,zona);
});





function obtenerZonas() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'php/metodos.php',
            type: 'POST',
            dataType: 'json',
            data: {
                function: 'obtenerZonas'
            },
            success: function(response) {
                $('.filtro-zona').empty();
                $('.filtro-zona').append($('<option>', {
                    value: '',
                    text: 'Selecciona una zona'
                }));

                $.each(response, function(index, despacho) {
                    $('.filtro-zona').append($('<option>', {
                        value: despacho.id,
                        text: despacho.nombre
                    }));
                });

                resolve(); // Resolver la promesa cuando la petición AJAX sea exitosa
            },
            error: function(xhr, status, error) {
                console.error('Error al obtener las zonas:', error);
                reject(error); // Rechazar la promesa si hay un error en la petición AJAX
            }
        });
    });
}




function getGiros() {
    return new Promise(function(resolve, reject) {
        $.ajax({
            url: 'php/metodos.php',
            type: 'POST',
            dataType: 'json',
            data: {
                function: 'obtenerGiro'
            },
            success: function(response) {
                // Llenar los giros en el select
                $('.filtro-giro').empty();
                $('.filtro-giro').append($('<option>', {
                    value: '',
                    text: 'Selecciona un giro'
                }));
                $.each(response, function(index, giros) {
                    $('.filtro-giro').append($('<option>', {
                         value: giros.id,
                        text: giros.nombre
                    }));
                });
                resolve(); // Resolver la promesa una vez que se completen los giros
            },
            error: function(xhr, status, error) {
                console.error('Error al obtener los giros:', error);
                reject(error); // Rechazar la promesa en caso de error
            }
        });
    });
}
setTimeout(function() {
    getGiros().then(function() {
        // Hacer algo después de obtener los giros
    }).catch(function(error) {
        console.error('Hubo un error al obtener los giros:', error);
        // Manejar el error según sea necesario
    });
}, 1000);

setTimeout(function() {
    obtenerZonas().then(function() {
        // Hacer algo después de obtener los giros
    }).catch(function(error) {
        console.error('Hubo un error al obtener los giros:', error);
        // Manejar el error según sea necesario
    });
}, 1000);



$('#usuariosTable').on('click', '.decenviada', function() {
        Swal.fire({
            title: '¿Está seguro?',
            text: '¿Desea marcar esta declaración como enviada?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('¡Enviada!', 'La declaración ha sido marcada como enviada.', 'success');
                // Aquí puedes realizar cualquier otra acción que desees cuando el usuario confirme
            }
        });
    });







// Al hacer clic en el botón "eliminar"
$('#usuariosTable').on('click', '.eliminarBtn2', function() {
    var rfc = $(this).data("rfc");
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Se eliminara del sistema al cliente con rfc: "+rfc,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminarlo"
    }).then((result) => {
      if (result.value) {
         eliminarUsuario1(rfc)
       
        
      }
    });
  });
  
  
  // Función para eliminar un usuario
function eliminarUsuario(rfc) {
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
                 getUsuarios('ALL');
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
function eliminarUsuario1(rfc) {

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



// Obtener referencia al formulario y a los campos del mismo
var form = document.getElementById('altaclientes');
var nombreInput = document.getElementById('nombre');
var apellidoPaternoInput = document.getElementById('apellidoPaterno');
var apellidoMaternoInput = document.getElementById('apellidoMaterno');
var montoInput = document.getElementById('monto');
var rfcInput = document.getElementById('rfc');
var zonaSelect = document.getElementById('zona');
var giroSelect = document.getElementById('giro');
var fechaPagoSelect = document.getElementById('fechaPago');
var despachoSelect = document.getElementById('despacho');

// Función para llenar los campos del formulario con los datos del cliente
function llenarFormulario(cliente) {
  nombreInput.value = cliente.nombre;
  apellidoPaternoInput.value = cliente.apellido_paterno;
  apellidoMaternoInput.value = cliente.apellido_materno;
  montoInput.value = cliente.monto;
  rfcInput.value = cliente.rfc;
  zonaSelect.value = cliente.zona;
  giroSelect.value = cliente.giro;
  fechaPagoSelect.value = cliente.fecha_de_pago;
  despachoSelect.value = cliente.despacho;
}

// Función para hacer la petición AJAX y llenar el formulario con los datos del cliente
function cargarDatosCliente(rfc) {
  $.ajax({
    url: 'php/clientes.php',
    method: 'POST',
    
    data: {                function: "obtenerCliente",
 rfc: rfc},
    dataType: 'json',
    success: function(response) {
      if (response) {
        llenarFormulario(response);
      } else {
                          Swal.fire("Lo sentimos...", 'No se encontró ningún cliente con el RFC proporcionado.', 'error');

      }
    },
    error: function(xhr, status, error) {
      console.error('Error al cargar los datos del cliente:', error);
        Swal.fire("Lo sentimos...", 'Hubo un problema al cargar los datos del cliente. Por favor, inténtalo de nuevo más tarde.', 'error');
    }
  });
}



// Al hacer clic en el botón "Editar"
$('#usuariosTable').on('click', '.editarBtn', function() {
    var rfc = $(this).data("rfc");
    $("#rfc_original").val(rfc);
    console.log("editar");
    $('#exampleModal').modal('show');

    getGiros().then(function() {
        console.log("getGiros");
        return obtenerZonas();
    }).then(function() {
        console.log("obtenerZonas");

            cargarDatosCliente(rfc);
        }).catch(function(error) {
        console.error('Error:', error);
        Swal.fire("Lo sentimos...", 'Hubo un problema al cargar los datos del cliente. Por favor, inténtalo de nuevo más tarde.', 'error');
    });
});



function edicionCliente(nombre, apellidoPaterno, apellidoMaterno, rfc, zona, fechaPago, despacho, monto, giro, rfc_original) {
    // Enviar los datos mediante AJAX
    $.ajax({
        type: 'POST',
        url: '../php/edicionCliente.php', // Archivo PHP para procesar la solicitud de actualización de cliente
        data: {
            
            nombre: nombre,
            apellidoPaterno: apellidoPaterno,
            apellidoMaterno: apellidoMaterno,
            rfc: rfc,
            zona: zona,
            fechaPago: fechaPago,
            despacho: despacho,
            monto: monto,
            giro: giro,
            rfc_original: rfc_original
        },
        dataType: 'JSON',
        success: function(response) {
            console.log(response)
            if(response.status == 1) {
                                $('#exampleModal').modal('hide');

                Swal.fire("Éxito", response.msg, 'success').then(() => {
        getUsuarios('ALL');
   
});

                // Limpiar los campos del formulario después de una actualización exi
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

// Ejemplo de uso de la función de edición de cliente (debes llamar a esta función cuando quieras actualizar un cliente)
$('#saveChange').on('click', function() {
    var nombre = $('#nombre').val();
    var apellidoPaterno = $('#apellidoPaterno').val();
    var apellidoMaterno = $('#apellidoMaterno').val();
    var rfc = $('#rfc').val();
    var zona = $('#zona').val();
    var fechaPago = $('#fechaPago').val();
    var despacho = $('#despacho').val();
    var giro = $('#giro').val();
    var monto = $('#monto').val();
    var rfc_original = $('#rfc_original').val();

    // Asumiendo que hay un campo oculto en el formulario con el ID del cliente

    // Verifica si algún campo está vacío
    if (nombre === "" || apellidoPaterno === "" || apellidoMaterno === "" || rfc === "" || zona === "" || fechaPago === "" || despacho === "" || monto === "" || giro === "" || rfc_original === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor revisa que ningún campo esté vacío',
        });
        return false;
    } else {
        // Llamada a la función de edición de cliente
        edicionCliente(nombre, apellidoPaterno, apellidoMaterno, rfc, zona, fechaPago, despacho, monto, giro,rfc_original);
    }
});

