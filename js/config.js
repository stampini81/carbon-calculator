/*
  config.js

  This file defines a global object named `CONFIG`.

  - CONFIG.EMISSION_FACTORS: kg CO2 per km for each transport mode
  - CONFIG.TRANSPORT_MODES: metadata for UI labels
  - CONFIG.setupDistanceAutofill(): fills the distance input when origin/destination match RoutesDB
*/

/* global RoutesDB, CONFIG */

window.CONFIG = {
  EMISSION_FACTORS: {
    bicycle: 0,
    car: 0.12,
    bus: 0.06,
    truck: 0.98,
  },

  // Carbon credits: how many kg CO2 each credit compensates
  CARBON_CREDIT_KG_PER_CREDIT: 1000,

  // Simple price range estimation per credit (BRL)
  PRICE_MIN_BRL: 10,
  PRICE_MAX_BRL: 15,

  TRANSPORT_MODES: {
    bicycle: { label: "Bicicleta" },
    car: { label: "Carro" },
    bus: { label: "Ônibus" },
    truck: { label: "Caminhão" },
  },

  setupDistanceAutofill: function setupDistanceAutofill() {
    // Get origin and destination input elements
    var originInput = document.getElementById("origin");
    var destinationInput = document.getElementById("destination");
    var distanceInput = document.getElementById("distance");
    var manualCheckbox = document.getElementById("manual-distance");
    var helperEl = document.querySelector(".form__helper");

    if (!originInput || !destinationInput || !distanceInput || !manualCheckbox) return;

    function setHelper(text, isSuccess) {
      if (!helperEl) return;
      helperEl.textContent = text;
      helperEl.style.color = isSuccess ? "var(--color-secondary)" : "var(--color-text-light)";
    }

    function tryAutofill() {
      // Get trimmed values from both inputs
      var origin = String(originInput.value || "").trim();
      var destination = String(destinationInput.value || "").trim();

      // Only try to autofill when both are filled and manual mode is OFF
      if (!origin || !destination || manualCheckbox.checked) return;

      // If a distance is found, fill distance input and keep readonly
      var found = window.RoutesDB && typeof window.RoutesDB.findDistance === "function"
        ? window.RoutesDB.findDistance(origin, destination)
        : null;

      if (typeof found === "number" && isFinite(found) && found > 0) {
        distanceInput.value = String(found);
        distanceInput.readOnly = true;
        setHelper("Distância encontrada automaticamente ✔", true);
        return;
      }

      // If not found: clear and suggest manual input
      distanceInput.value = "";
      distanceInput.readOnly = true;
      setHelper("Rota não encontrada. Marque para inserir manualmente.", false);
    }

    function onManualToggle() {
      if (manualCheckbox.checked) {
        distanceInput.readOnly = false;
        setHelper("Insira a distância manualmente.", false);
        return;
      }

      distanceInput.readOnly = true;
      tryAutofill();
    }

    // Add "change" event listeners to both origin and destination inputs
    originInput.addEventListener("change", tryAutofill);
    destinationInput.addEventListener("change", tryAutofill);

    // Add "change" listener to manual checkbox
    manualCheckbox.addEventListener("change", onManualToggle);

    // Initial state
    onManualToggle();
    tryAutofill();
  },
};
