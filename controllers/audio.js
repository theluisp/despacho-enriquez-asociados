let mediaRecorder;
let audioChunks = [];
let startTime;
let timerInterval;

const recordButtonMobile = document.getElementById("recordButtonMobile");
const stopButtonMobile = document.getElementById("stopButtonMobile");
const recordingTimeDisplay = document.getElementById("recordingTime");

recordButtonMobile.addEventListener("click", () => {
  startRecording();
});

stopButtonMobile.addEventListener("click", () => {
  stopRecording();
});

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const options = { mimeType: "audio/webm" };
    mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      clearInterval(timerInterval);
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

      recordingTimeDisplay.textContent = "Tiempo de grabación: 00:00";
      recordButtonMobile.style.display = ""; // Mostrar el botón de inicio de grabación
      stopButtonMobile.style.display = "none"; // Ocultar el botón de detener grabación

      const id_registro = document.getElementById("id_registro").value;

      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");
      formData.append("id_registro", id_registro);
      formData.append("function", 'audio');

      axios.post("../php/metodos.php", formData)
        .then((response) => {
          console.log(response.data);
          if (response.data.status == 1) {
            $.ajax({
              url: '../php/declaracion.php',
              method: 'POST',
              data: {
                function: 'actualizaStatus',
                id_update: id_registro,
                status: '2',
                comentario: 'Entregada por sistema automáticamente, con firma de voz.'
              },
              dataType: 'json',
              success: function (response) {
                if (response.status == 1) {
                  Swal.fire("Éxito", "¡Gracias! La declaración se ha entregado correctamente", 'success');
                } else {
                  Swal.fire('¡Error!', response.data.msg, 'error');
                }
              },
              error: function () {
                Swal.fire('¡Error!', 'Hubo un problema al realizar la solicitud AJAX', 'error');
              }
            });
          } else {
            Swal.fire("ERROR", response.data.msg, 'error');
          }
        })
        .catch((error) => {
          console.error("Error al enviar el audio al servidor:", error);
          Swal.fire('Error', 'No se pudo enviar el audio al servidor', 'error');
        });
    };

    mediaRecorder.start();
    startTime = Date.now();
    timerInterval = setInterval(updateRecordingTime, 1000);
    recordButtonMobile.style.display = "none"; // Ocultar el botón de inicio de grabación
    stopButtonMobile.style.display = ""; // Mostrar el botón de detener grabación
  } catch (error) {
    console.error("Error al acceder al micrófono:", error);
    Swal.fire('Error', 'No se pudo acceder al micrófono. Asegúrate de permitir el acceso al micrófono en la configuración de tu navegador.', 'error');
  }
}

function stopRecording() {
  try {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      clearInterval(timerInterval);
      mediaRecorder.stop();
    }
  } catch (error) {
    console.error("Error al detener la grabación:", error);
    Swal.fire('Error', 'Hubo un problema al detener la grabación.', 'error');
  }
}

function updateRecordingTime() {
  const currentTimeMillis = Date.now() - startTime;
  const minutes = Math.floor(currentTimeMillis / 60000);
  const seconds = Math.floor((currentTimeMillis % 60000) / 1000);
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  recordingTimeDisplay.textContent = `Tiempo de grabación: ${formattedTime}`;
}
