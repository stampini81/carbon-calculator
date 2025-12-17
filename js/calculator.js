/*
  calculator.js

  This file defines a global `Calculator` object.

  Methods:
  - calculateEmission(distanceKm, transportMode)
  - calculateAllModes(distanceKm)
  - calculateSavings(emission, baselineEmission)
  - calculateCarbonCredits(emissionKg)
  - estimateCreditPrice(credits)
*/

/* global CONFIG */

function roundTo(n, decimals) {
  var num = Number(n);
  if (!isFinite(num)) return null;
  var factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

window.Calculator = {
  calculateEmission: function calculateEmission(distanceKm, transportMode) {
    // Get emission factor from CONFIG.EMISSION_FACTORS
    var km = Number(distanceKm);
    if (!isFinite(km) || km <= 0) return null;

    var factors = window.CONFIG && window.CONFIG.EMISSION_FACTORS;
    var factor = factors ? Number(factors[transportMode]) : NaN;
    if (!isFinite(factor) || factor < 0) return null;

    // Calculate distance * factor, return rounded to 2 decimals
    return roundTo(km * factor, 2);
  },

  calculateAllModes: function calculateAllModes(distanceKm) {
    // Create array to store results
    var km = Number(distanceKm);
    if (!isFinite(km) || km <= 0) return [];

    var factors = window.CONFIG && window.CONFIG.EMISSION_FACTORS;
    if (!factors) return [];

    // Baseline: car
    var carEmission = this.calculateEmission(km, "car");
    if (carEmission === null || !isFinite(carEmission) || carEmission <= 0) carEmission = null;

    var results = [];
    for (var mode in factors) {
      if (!Object.prototype.hasOwnProperty.call(factors, mode)) continue;

      var emission = this.calculateEmission(km, mode);
      if (emission === null) continue;

      var pct = null;
      if (carEmission !== null && isFinite(carEmission) && carEmission > 0) {
        pct = roundTo((emission / carEmission) * 100, 0);
      }

      results.push({
        mode: mode,
        emission: emission,
        percentageVsCar: pct,
      });
    }

    // Sort by emission (lowest first)
    results.sort(function (a, b) {
      return a.emission - b.emission;
    });

    return results;
  },

  calculateSavings: function calculateSavings(emission, baselineEmission) {
    // Calculate saved = baseline - emission
    var e = Number(emission);
    var b = Number(baselineEmission);
    if (!isFinite(e) || !isFinite(b) || b <= 0) return null;

    // Calculate percentage: (saved / baseline) * 100
    var saved = b - e;
    var percentage = (saved / b) * 100;

    return {
      savedKg: roundTo(saved, 2),
      percentage: roundTo(percentage, 2),
    };
  },

  calculateCarbonCredits: function calculateCarbonCredits(emissionKg) {
    // Divide emission by CONFIG.CARBON_CREDIT_KG_PER_CREDIT
    var e = Number(emissionKg);
    var perCredit = window.CONFIG ? Number(window.CONFIG.CARBON_CREDIT_KG_PER_CREDIT) : NaN;
    if (!isFinite(e) || e < 0 || !isFinite(perCredit) || perCredit <= 0) return null;

    return roundTo(e / perCredit, 4);
  },

  estimateCreditPrice: function estimateCreditPrice(credits) {
    // Calculate min: credits * PRICE_MIN_BRL
    // Calculate max: credits * PRICE_MAX_BRL
    // Calculate average: (min + max) / 2
    var c = Number(credits);
    if (!isFinite(c) || c < 0) return null;

    var minPer = window.CONFIG ? Number(window.CONFIG.PRICE_MIN_BRL) : NaN;
    var maxPer = window.CONFIG ? Number(window.CONFIG.PRICE_MAX_BRL) : NaN;
    if (!isFinite(minPer) || !isFinite(maxPer) || minPer < 0 || maxPer < 0) return null;

    var min = c * minPer;
    var max = c * maxPer;
    var average = (min + max) / 2;

    return {
      min: roundTo(min, 2),
      max: roundTo(max, 2),
      average: roundTo(average, 2),
    };
  },
};

// Backward compatibility with earlier name used in this workspace
window.CarbonCalculator = window.CarbonCalculator || {
  calculateEmissionKg: function (distanceKm, transportKey) {
    return window.Calculator.calculateEmission(distanceKm, transportKey);
  },
};
