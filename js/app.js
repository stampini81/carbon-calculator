/*
  app.js

  Minimal app bootstrap:
  - Populate city datalist from RoutesDB
  - Setup distance autofill from CONFIG
  - Handle form submit and render results
*/

/* global RoutesDB, CONFIG, Calculator, CarbonCalculator, UI */

(function () {
  function populateCities() {
    var dataList = document.getElementById("cities-list");
    if (!dataList || !window.RoutesDB || typeof window.RoutesDB.getAllCities !== "function") return;

    var cities = window.RoutesDB.getAllCities();
    dataList.innerHTML = "";

    for (var i = 0; i < cities.length; i++) {
      var opt = document.createElement("option");
      opt.value = cities[i];
      dataList.appendChild(opt);
    }
  }

  function getSelectedTransport() {
    var checked = document.querySelector('input[name="transport"]:checked');
    return checked ? checked.value : null;
  }

  function onSubmit(e) {
    e.preventDefault();

    var submitButton = document.querySelector(".form__button");
    if (window.UI && typeof window.UI.showLoading === "function") {
      window.UI.showLoading(submitButton);
    }

    var originEl = document.getElementById("origin");
    var destinationEl = document.getElementById("destination");
    var distanceEl = document.getElementById("distance");

    var origin = String(originEl ? originEl.value : "").trim();
    var destination = String(destinationEl ? destinationEl.value : "").trim();
    var distanceVal = distanceEl ? distanceEl.value : "";
    var transportKey = getSelectedTransport();

    var distanceKm = Number(distanceVal);
    if (!origin || !destination) {
      window.UI.renderError("Preencha origem e destino.");
      window.UI.hideLoading(submitButton);
      return;
    }
    if (!isFinite(distanceKm) || distanceKm <= 0) {
      window.UI.renderError("Informe uma distância válida.");
      window.UI.hideLoading(submitButton);
      return;
    }
    if (!transportKey) {
      window.UI.renderError("Selecione um meio de transporte.");
      window.UI.hideLoading(submitButton);
      return;
    }

    var emissionKg = window.Calculator && typeof window.Calculator.calculateEmission === "function"
      ? window.Calculator.calculateEmission(distanceKm, transportKey)
      : (window.CarbonCalculator ? window.CarbonCalculator.calculateEmissionKg(distanceKm, transportKey) : null);

    if (emissionKg === null) {
      window.UI.renderError("Não foi possível calcular a emissão.");
      window.UI.hideLoading(submitButton);
      return;
    }

    // Compute comparison and credits (as in the screenshots)
    var allModes = (window.Calculator && typeof window.Calculator.calculateAllModes === "function")
      ? window.Calculator.calculateAllModes(distanceKm)
      : [];

    var baselineCarEmission = null;
    for (var i = 0; i < allModes.length; i++) {
      if (allModes[i] && allModes[i].mode === "car") {
        baselineCarEmission = allModes[i].emission;
        break;
      }
    }
    if (baselineCarEmission === null && window.Calculator && typeof window.Calculator.calculateEmission === "function") {
      baselineCarEmission = window.Calculator.calculateEmission(distanceKm, "car");
    }

    var savings = null;
    if (transportKey !== "car" && window.Calculator && typeof window.Calculator.calculateSavings === "function" && baselineCarEmission !== null) {
      savings = window.Calculator.calculateSavings(emissionKg, baselineCarEmission);
    }

    var credits = null;
    var creditPrice = null;
    if (window.Calculator && typeof window.Calculator.calculateCarbonCredits === "function") {
      credits = window.Calculator.calculateCarbonCredits(emissionKg);
      if (credits !== null && typeof window.Calculator.estimateCreditPrice === "function") {
        creditPrice = window.Calculator.estimateCreditPrice(credits);
      }
    }

    window.UI.renderResults({
      origin: origin,
      destination: destination,
      distanceKm: distanceKm,
      emissionKg: emissionKg,
      mode: transportKey,
      savings: savings,
    });
    window.UI.renderComparison(allModes, transportKey);
    window.UI.renderCarbonCredits({ credits: credits, price: creditPrice });

    window.UI.hideLoading(submitButton);
    window.UI.scrollToElement("results");
  }

  document.addEventListener("DOMContentLoaded", function () {
    populateCities();

    if (window.CONFIG && typeof window.CONFIG.setupDistanceAutofill === "function") {
      window.CONFIG.setupDistanceAutofill();
    }

    var form = document.getElementById("calculator-form");
    if (form) form.addEventListener("submit", onSubmit);
  });
})();
