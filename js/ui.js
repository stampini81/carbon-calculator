/*
  ui.js

  This file defines a global `UI` object.
  It contains helper methods to show/hide elements, format values,
  manage loading state, and render the result sections.
*/

/* global CONFIG */

window.UI = {
  // ---------- Formatting ----------
  formatNumber: function formatNumber(value) {
    var n = Number(value);
    if (!isFinite(n)) return "-";

    try {
      return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(n);
    } catch (_) {
      return String(Math.round(n * 100) / 100);
    }
  },

  formatCurrency: function formatCurrency(value) {
    var n = Number(value);
    if (!isFinite(n)) return "-";

    try {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(n);
    } catch (_) {
      return "R$ " + this.formatNumber(n);
    }
  },

  // ---------- Visibility helpers ----------
  showElement: function showElement(elementId) {
    var el = document.getElementById(elementId);
    if (el) el.classList.remove("hidden");
  },

  hideElement: function hideElement(elementId) {
    var el = document.getElementById(elementId);
    if (el) el.classList.add("hidden");
  },

  scrollToElement: function scrollToElement(elementId) {
    var el = document.getElementById(elementId);
    if (!el) return;

    try {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (_) {
      el.scrollIntoView(true);
    }
  },

  // ---------- Loading helpers ----------
  showLoading: function showLoading(buttonElement) {
    if (!buttonElement) return;

    if (!buttonElement.dataset.originalText) {
      buttonElement.dataset.originalText = buttonElement.textContent;
    }

    buttonElement.disabled = true;
    buttonElement.innerHTML = "<span class=\"spinner\"></span> Calculando...";
  },

  hideLoading: function hideLoading(buttonElement) {
    if (!buttonElement) return;

    buttonElement.disabled = false;
    var original = buttonElement.dataset.originalText;
    if (original) {
      buttonElement.textContent = original;
    }
  },

  // ---------- Rendering methods ----------
  renderResults: function renderResults(data) {
    // data: { origin, destination, distanceKm, emissionKg, mode, savings? }
    var origin = data.origin;
    var destination = data.destination;
    var distanceKm = data.distanceKm;
    var emissionKg = data.emissionKg;
    var mode = data.mode;
    var savings = data.savings;

    var modeMeta = window.CONFIG && window.CONFIG.TRANSPORT_MODES ? window.CONFIG.TRANSPORT_MODES[mode] : null;
    var modeLabel = modeMeta && modeMeta.label ? modeMeta.label : mode;
    var modeIcon = this._iconForMode(mode);

    var html = "";
    html += "<div class=\"output\">";
    html += "  <h2 class=\"output__title\">Resultado</h2>";
    html += "  <div class=\"results__grid\">";

    // Route
    html += "    <div class=\"results__card\">";
    html += "      <div class=\"results__icon\">🧭</div>";
    html += "      <div class=\"results__data\">";
    html += "        <div class=\"results__label\">Rota</div>";
    html += "        <div class=\"results__value\">" + this._escape(origin) + " <span class=\"arrow\">→</span> " + this._escape(destination) + "</div>";
    html += "      </div>";
    html += "    </div>";

    // Distance
    html += "    <div class=\"results__card\">";
    html += "      <div class=\"results__icon\">📏</div>";
    html += "      <div class=\"results__data\">";
    html += "        <div class=\"results__label\">Distância</div>";
    html += "        <div class=\"results__value\">" + this._escape(this.formatNumber(distanceKm)) + " km</div>";
    html += "      </div>";
    html += "    </div>";

    // Emission
    html += "    <div class=\"results__card\">";
    html += "      <div class=\"results__icon\">🌍</div>";
    html += "      <div class=\"results__data\">";
    html += "        <div class=\"results__label\">Emissão</div>";
    html += "        <div class=\"results__value\"><span class=\"results__badge\">CO₂</span> " + this._escape(this.formatNumber(emissionKg)) + " kg</div>";
    html += "      </div>";
    html += "    </div>";

    // Transport + savings
    html += "    <div class=\"results__card\">";
    html += "      <div class=\"results__icon\">" + this._escape(modeIcon) + "</div>";
    html += "      <div class=\"results__data\">";
    html += "        <div class=\"results__label\">Transporte</div>";
    html += "        <div class=\"results__value\">" + this._escape(modeLabel) + "</div>";
    if (savings && typeof savings.savedKg === "number" && typeof savings.percentage === "number") {
      html += "        <div class=\"results__subtext\">Economia: <strong>" + this._escape(this.formatNumber(savings.savedKg)) + " kg</strong> (" + this._escape(this.formatNumber(savings.percentage)) + "%)</div>";
    }
    html += "      </div>";
    html += "    </div>";

    html += "  </div>";
    html += "</div>";

    this._setHtml("results-content", html);
    this.showElement("results");
  },

  renderComparison: function renderComparison(modesArray, selectedMode) {
    if (!Array.isArray(modesArray) || modesArray.length === 0) {
      this.hideElement("comparison");
      return;
    }

    var html = "";
    html += "<div class=\"output\">";
    html += "  <h2 class=\"output__title\">Comparação</h2>";
    html += "  <div class=\"comparison__grid\">";

    for (var i = 0; i < modesArray.length; i++) {
      var item = modesArray[i];
      var mode = item.mode;
      var emission = item.emission;
      var pct = item.percentageVsCar;
      var modeMeta = window.CONFIG && window.CONFIG.TRANSPORT_MODES ? window.CONFIG.TRANSPORT_MODES[mode] : null;
      var label = modeMeta && modeMeta.label ? modeMeta.label : mode;
      var icon = this._iconForMode(mode);

      var selected = mode === selectedMode;
      var badge = selected ? "<span class=\"comparison__badge\">selecionado</span>" : "";

      var barWidth = 0;
      if (pct !== null && typeof pct !== "undefined" && isFinite(Number(pct))) {
        barWidth = Math.max(0, Math.min(100, Number(pct)));
      }

      html += "    <div class=\"comparison__card\">";
      html += "      <div class=\"comparison__header\">";
      html += "        <div class=\"comparison__title\"><span class=\"comparison__icon\">" + this._escape(icon) + "</span> <span class=\"comparison__label\">" + this._escape(label) + "</span></div>";
      html += "        " + badge;
      html += "      </div>";
      html += "      <div class=\"comparison__emission\">" + this._escape(this.formatNumber(emission)) + " kg CO₂</div>";
      if (pct !== null && typeof pct !== "undefined") {
        html += "      <div class=\"comparison__percentage\">" + this._escape(String(pct)) + "% vs carro</div>";
      }
      html += "      <div class=\"comparison__bar-container\"><div class=\"comparison__bar\" style=\"width: " + this._escape(String(barWidth)) + "%\"></div></div>";
      html += "    </div>";
    }

    html += "  </div>";
    html += "</div>";

    this._setHtml("comparison-content", html);
    this.showElement("comparison");
  },

  renderCarbonCredits: function renderCarbonCredits(creditsData) {
    if (!creditsData || typeof creditsData.credits !== "number") {
      this.hideElement("carbon-credits");
      return;
    }

    var credits = creditsData.credits;
    var price = creditsData.price;

    var perCredit = window.CONFIG ? window.CONFIG.CARBON_CREDIT_KG_PER_CREDIT : null;
    var helper = perCredit ? "1 crédito = " + this.formatNumber(perCredit) + " kg CO₂" : "";

    var html = "";
    html += "<div class=\"output\">";
    html += "  <h2 class=\"output__title\">Créditos de Carbono</h2>";
    html += "  <div class=\"output__grid output__grid--2\">";

    html += "    <div class=\"card\">";
    html += "      <div class=\"card__label\">Créditos necessários</div>";
    html += "      <div class=\"card__value\">" + this._escape(this.formatNumber(credits)) + "</div>";
    if (helper) html += "      <div class=\"card__helper\">" + this._escape(helper) + "</div>";
    html += "    </div>";

    html += "    <div class=\"card\">";
    html += "      <div class=\"card__label\">Preço estimado</div>";
    if (price && typeof price.average === "number") {
      html += "      <div class=\"card__value\">" + this._escape(this.formatCurrency(price.average)) + "</div>";
      if (typeof price.min === "number" && typeof price.max === "number") {
        html += "      <div class=\"card__helper\">Faixa: " + this._escape(this.formatCurrency(price.min)) + " – " + this._escape(this.formatCurrency(price.max)) + "</div>";
      }
    } else {
      html += "      <div class=\"card__value\">-</div>";
    }
    html += "    </div>";

    html += "  </div>";
    html += "  <div class=\"info\">";
    html += "    <strong>O que são créditos de carbono?</strong>";
    html += "    <div>São certificados que representam a compensação de emissões de CO₂ por projetos ambientais.</div>";
    html += "  </div>";
    html += "  <button type=\"button\" class=\"secondary-button\" disabled>Compensar Emissões</button>";
    html += "</div>";

    this._setHtml("carbon-credits-content", html);
    this.showElement("carbon-credits");
  },

  renderError: function renderError(message) {
    var html = "";
    html += "<div class=\"output\">";
    html += "  <h2 class=\"output__title\">Resultado</h2>";
    html += "  <div class=\"error\">" + this._escape(message) + "</div>";
    html += "</div>";

    this._setHtml("results-content", html);
    this.showElement("results");
    this.hideElement("comparison");
    this.hideElement("carbon-credits");
  },

  // ---------- Internals ----------
  _setHtml: function _setHtml(id, html) {
    var el = document.getElementById(id);
    if (el) el.innerHTML = html;
  },

  _iconForMode: function _iconForMode(mode) {
    switch (mode) {
      case "bicycle": return "🚲";
      case "car": return "🚗";
      case "bus": return "🚌";
      case "truck": return "🚚";
      default: return "";
    }
  },

  _escape: function _escape(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },
};
