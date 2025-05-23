let autocompleteOrigen, autocompleteDestino;
let map, directionsRenderer;
const paisesPermitidos = ['Honduras', 'Guatemala', 'El Salvador'];

function iniciarGoogleMaps() {
  initMap();
  initAutocomplete();
}

function initAutocomplete() {
  autocompleteOrigen = new google.maps.places.Autocomplete(document.getElementById('origen'));
  autocompleteDestino = new google.maps.places.Autocomplete(document.getElementById('destino'));
}

function initMap() {
  const centroHonduras = { lat: 15.5, lng: -88.0 };
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: centroHonduras
  });

  directionsRenderer = new google.maps.DirectionsRenderer();
  directionsRenderer.setMap(map);
}

function usarUbicacion(inputId) {
  if (!navigator.geolocation) return alert("Tu navegador no permite geolocalización.");
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === 'OK') {
        const pais = results[0].address_components.find(c => c.types.includes("country")).long_name;
        if (!paisesPermitidos.includes(pais)) {
          return alert(`Actualmente solo operamos en Honduras, Guatemala y El Salvador (Detectado: ${pais})`);
        }
        document.getElementById(inputId).value = results[0].formatted_address;
      } else {
        alert("No se pudo obtener la dirección.");
      }
    });
  }, () => {
    alert("No se pudo obtener tu ubicación.");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const tipoServicio = document.getElementById("tipo-servicio");
  const camposDinamicos = document.getElementById("campos-dinamicos");

  tipoServicio.addEventListener("change", () => {
    const tipo = tipoServicio.value;
    camposDinamicos.innerHTML = tipo === "grua"
      ? `<label for="vehiculo">Tipo de vehículo:</label><input type="text" id="vehiculo" name="vehiculo" required />`
      : `<label for="carga">Tipo de carga:</label><input type="text" id="carga" name="carga" required />`;
  });

  document.getElementById("form-servicio").addEventListener("submit", function (e) {
    e.preventDefault();
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;

    if (!origen || !destino) {
      return alert("Debes ingresar origen y destino.");
    }

    const service = new google.maps.DirectionsService();
    const request = {
      origin: origen,
      destination: destino,
      travelMode: google.maps.TravelMode.DRIVING,
      drivingOptions: {
        departureTime: new Date()
      }
    };

    service.route(request, (result, status) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);

        const duracionSegundos = result.routes[0].legs[0].duration_in_traffic.value;
        const minutos = Math.ceil(duracionSegundos / 60);
        const tarifa = 17;
        const total = minutos * tarifa;

        document.getElementById("resultado").innerHTML =
          `<strong>Duración estimada:</strong> ${minutos} minutos<br><strong>Total:</strong> L ${total}`;
      } else {
        alert("No se pudo calcular la ruta: " + status);
      }
    });
  });
});
