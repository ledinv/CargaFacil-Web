// main.js - Lógica básica inicial para CargaFácil.com

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-servicio");
  const resultado = document.getElementById("resultado");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const tipo = document.getElementById("tipo-servicio").value;
      const origen = document.getElementById("origen").value.trim();
      const destino = document.getElementById("destino").value.trim();

      if (!origen || !destino) {
        resultado.textContent = "Por favor, completá origen y destino.";
        return;
      }

      // Simulación: cada viaje se asume que dura entre 10 y 30 min
      const duracionMin = Math.floor(Math.random() * 21) + 10;
      const tarifa = tipo === "grua" ? 17 : 15;
      const total = duracionMin * tarifa;

      resultado.innerHTML = `<strong>Estimación:</strong> ${duracionMin} minutos x L ${tarifa} = <strong>L ${total}</strong>`;
    });
  }
});
