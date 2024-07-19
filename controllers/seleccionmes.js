<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Selector de Meses</title>
</head>
<body>

<select id="monthSelect">
  <option value="">Selecciona un mes</option>
</select>

<script>
// Obtener el elemento select
var select = document.getElementById("monthSelect");

// Array con los nombres de los meses
var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

// Iterar sobre el array de meses y agregar cada uno como una opción al select
months.forEach(function(month) {
  var option = document.createElement("option");
  option.value = month; // El valor es el nombre del mes
  option.text = month;
  select.appendChild(option);
});
</script>

</body>
</html>
