function generarSelectUltimosTresAnios() {
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

// Ejemplo de uso:
var selectAnios = generarSelectUltimosTresAnios();
document.body.appendChild(selectAnios); // Agregar el select al body del documento
