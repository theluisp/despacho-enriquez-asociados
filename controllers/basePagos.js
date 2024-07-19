var despachoPago = "ALL";

setTimeout(function() {
    obtenerUsuarios(despachoPago);
}, 1000);





function obtenerUsuarios(despachoPago = null, giroPago = null, zonaPago = null) {
    var columnasPago = [
        { data: "nombre", title: "Nombre" },
        { data: "apellido_paterno", title: "Apellido Paterno" },
        { data: "apellido_materno", title: "Apellido Materno" },
        { data: "rfc", title: "RFC" },
        { data: "zona_name", title: "Zona" },
        { data: "monto", title: "Monto" },
        { data: "fecha_de_pago", title: "Fecha de Pago" },
        { data: "nombre_despacho", title: "Despacho" },
        { data: "giro_name", title: "Giro" },
        { data: "monto", title: "Monto" },
           { data: "monto_pagado", title: "Monto pagado" },
        { data: null, title: "Acciones" }
    ];

    // Mostrar el modal de carga
    Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false
    });
    Swal.showLoading();

    // Crear o recrear la tabla DataTables
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
            url: "php/clientes.php",
            type: "POST",
            dataType: "json",
            data: {
                function: "obtenerClientes",
                despacho: despachoPago,
                giro: giroPago,
                zona: zonaPago
            }
        },
        columns: columnasPago,
        columnDefs: [
            {
                targets: 6,
                render: function (data, type, row) {
                    var fecha = row.fecha_de_pago;

                    if (fecha == 15) {
                        return `<span class="badge badge-secondary">15 de cada mes</span>`;
                    } else if (fecha == 1) {
                        return `<span class="badge badge-secondary">1 de cada mes</span>`;
                    } else if (fecha == 2) {
                        return `<span class="badge badge-secondary">Bimestral</span>`;
                    } else {
                        return `<span class="badge badge-secondary">Extraordinarios</span>`;
                    }
                }
            },
            {
                targets: 11,
                render: function(data, type, row) {
                    
                    var PagarBtn = `<button type="button" class="btn btn-success PagarBtn" data-rfc="${row.rfc}" 
                    data-id="${row.id}">💲  Pagar</button>`;
                    
                    
                    
                    
                    return PagarBtn;
                }
            },
            {
                targets: 9,
                render: function(data, type, row) {
                   return "$"+data;
                }
            },
            {
                targets: 10,
                render: function(data, type, row) {
                      if (data == null) {
            data = 0;
        }
                                      return "$"+data;

                }
            }
        ],
        
        
        
        
        
        initComplete: function(settings, json) {
            Swal.close();
            
        }
    });
}





$('#usuariosTable').on('click', '.PagarBtn', function() {
    var rfc = $(this).data("rfc");
    var id = $(this).data("id");
    Swal.fire({
        title: "Agregar Pago",
    text: "¿Deseas agregar un pago para el cliente?",
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
                else{
                $.ajax({
                url: 'php/pagos.php', // Reemplaza con la URL de tu archivo PHP
                method: 'POST',
                data: {
                    function: 'pagar',
                    id_update: id,
                    status: '1', 
                    monto_pagado : value
                  
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
            }
        }).then((result) => {
            if (result.isConfirmed) {
                var cantidadPago = result.value;
                agregarPago(rfc, cantidadPago);
                Swal.fire({
                    title: "¡Pago agregado!",
                    text: "El pago de $" + cantidadPago + " ha sido agregado correctamente para el cliente con RFC: " + rfc,
                    icon: "success"
                });
            }
        });
    }
});
});




function obtenerDespachosPago() {
    $.ajax({
        url: 'php/metodos.php',
        type: 'POST',
        dataType: 'json',
        data: {
            function: 'obtenerDespachos'
        },
        success: function(response) {
            $('#filtro-despacho-pago').empty();

            $('#filtro-despacho-pago').append($('<option>', {
                value: '',
                text: 'Selecciona un despacho'
            }));

            $('#filtro-despacho-pago').append($('<option>', {
                value: 'ALL',
                text: 'Todos los despachos'
            }));

            $.each(response, function(index, despacho) {
                $('#filtro-despacho-pago').append($('<option>', {
                    value: despacho.id,
                    text: despacho.nombre
                }));
            });
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener los despachos:', error);
        }
    });
}

setTimeout(obtenerDespachosPago, 1000);

$('#search-pago').click(function() {
    var despachoPago = $("#filtro-despacho-pago").val();
    var giroPago = $("#filtro-giro-pago").val();
    var zonaPago = $("#filtro-zona-pago").val();
   
    obtenerUsuarios(despachoPago, giroPago, zonaPago);
});


// Resto del código sin cambios
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

function obtenerAnios() {
        return new Promise(function(resolve, reject) {
            try {
                var select = $('.filtro-año');
                var fechaActual = new Date();
                var year = fechaActual.getFullYear();

                select.empty();
                select.append($('<option>', {
                    value: '',
                    text: 'Selecciona un año'
                }));

                for (var i = 0; i < 3; i++) {
                    select.append($('<option>', {
                        value: year - i,
                        text: year - i
                    }));
                }

                resolve(); // Resolver la promesa cuando se haya completado la actualización del select
            } catch (error) {
                console.error('Error al generar los años:', error);
                reject(error); // Rechazar la promesa si hay un error
            }
        });
    }

    // Llamada a la función obtenerAnios() cuando el DOM esté completamente cargado
    document.addEventListener("DOMContentLoaded", function() {
        obtenerAnios().then(function() {
            console.log('Select de años generado exitosamente.');
        }).catch(function(error) {
            console.error('Error al generar el select de años:', error);
        });
    });



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




function edicionCliente(nombre, apellidoPaterno, apellidoMaterno, rfc, zona, fechaPago, despacho, monto, giro) {
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
            giro: giro
        },
        dataType: 'JSON',
        success: function(response) {
            console.log(response)
            if(response.status == 1) {
              
                                 getUsuarios('ALL');
                                   Swal.fire("Éxito", response.msg, 'success');

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

    // Asumiendo que hay un campo oculto en el formulario con el ID del cliente

    // Verifica si algún campo está vacío
    if (nombre === "" || apellidoPaterno === "" || apellidoMaterno === "" || rfc === "" || zona === "" || fechaPago === "" || despacho === "" || monto === "" || giro === "") {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Por favor revisa que ningún campo esté vacío',
        });
        return false;
    } else {
        // Llamada a la función de edición de cliente
        edicionCliente(nombre, apellidoPaterno, apellidoMaterno, rfc, zona, fechaPago, despacho, monto, giro);
    }
});

// Declaración de la función años
function años() {
    var select = document.createElement("select");

    // Obtener el año actual
    var fechaActual = new Date();
    var year = fechaActual.getFullYear();

    // Agregar opciones para los últimos tres años
    for (var i = 0; i < 3; i++) {
        var option = document.createElement("option");
        option.value = year - i;
        option.text = year - i;
        select.appendChild(option);
    }

    return select;
}


