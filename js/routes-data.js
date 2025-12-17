/*
  routes-data.js

  This file defines a global object named `RoutesDB`.

  Structure:
  - RoutesDB.routes: Array of route objects
      {
        origin:      string (city name with state, e.g. "São Paulo, SP")
        destination: string (city name with state, e.g. "Rio de Janeiro, RJ")
        distanceKm:  number (actual distance between cities)
      }

  Helpers:
  - RoutesDB.getAllCities(): returns a unique, sorted list of all cities in the routes
  - RoutesDB.findDistance(origin, destination): returns distanceKm or null (case-insensitive)

  Notes:
  - Distances are approximate real-world road distances (km) for demo/educational use.
  - findDistance works in both directions (origin->destination OR destination->origin).
*/

/* global RoutesDB */

window.RoutesDB = {
  routes: [
    // Southeast
    { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
    { origin: "São Paulo, SP", destination: "Belo Horizonte, MG", distanceKm: 586 },
    { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
    { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 77 },
    { origin: "Rio de Janeiro, RJ", destination: "Belo Horizonte, MG", distanceKm: 434 },
    { origin: "Rio de Janeiro, RJ", destination: "Vitória, ES", distanceKm: 520 },
    { origin: "Belo Horizonte, MG", destination: "Vitória, ES", distanceKm: 524 },
    { origin: "Belo Horizonte, MG", destination: "Brasília, DF", distanceKm: 740 },

    // South
    { origin: "Curitiba, PR", destination: "São Paulo, SP", distanceKm: 408 },
    { origin: "Curitiba, PR", destination: "Florianópolis, SC", distanceKm: 300 },
    { origin: "Florianópolis, SC", destination: "Porto Alegre, RS", distanceKm: 476 },
    { origin: "Curitiba, PR", destination: "Porto Alegre, RS", distanceKm: 710 },

    // Center-West
    { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 209 },
    { origin: "Brasília, DF", destination: "Cuiabá, MT", distanceKm: 1135 },
    { origin: "Brasília, DF", destination: "Campo Grande, MS", distanceKm: 1130 },
    { origin: "Goiânia, GO", destination: "Cuiabá, MT", distanceKm: 890 },
    { origin: "Campo Grande, MS", destination: "Cuiabá, MT", distanceKm: 700 },

    // Northeast (capitals and key links)
    { origin: "Salvador, BA", destination: "Aracaju, SE", distanceKm: 356 },
    { origin: "Aracaju, SE", destination: "Maceió, AL", distanceKm: 294 },
    { origin: "Maceió, AL", destination: "Recife, PE", distanceKm: 285 },
    { origin: "Recife, PE", destination: "João Pessoa, PB", distanceKm: 120 },
    { origin: "João Pessoa, PB", destination: "Natal, RN", distanceKm: 185 },
    { origin: "Natal, RN", destination: "Fortaleza, CE", distanceKm: 525 },
    { origin: "Fortaleza, CE", destination: "Teresina, PI", distanceKm: 634 },
    { origin: "Teresina, PI", destination: "São Luís, MA", distanceKm: 449 },
    { origin: "Salvador, BA", destination: "Recife, PE", distanceKm: 839 },
    { origin: "Salvador, BA", destination: "Fortaleza, CE", distanceKm: 1030 },

    // North
    { origin: "Belém, PA", destination: "São Luís, MA", distanceKm: 806 },
    { origin: "Belém, PA", destination: "Macapá, AP", distanceKm: 330 },
    { origin: "Manaus, AM", destination: "Boa Vista, RR", distanceKm: 785 },
    { origin: "Porto Velho, RO", destination: "Rio Branco, AC", distanceKm: 544 },
    { origin: "Palmas, TO", destination: "Brasília, DF", distanceKm: 973 },
    { origin: "Belém, PA", destination: "Palmas, TO", distanceKm: 965 },

    // Cross-region major routes
    { origin: "Salvador, BA", destination: "Brasília, DF", distanceKm: 1440 },
    { origin: "Recife, PE", destination: "Brasília, DF", distanceKm: 1650 },
    { origin: "Fortaleza, CE", destination: "Brasília, DF", distanceKm: 2200 },
    { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },
    { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
    { origin: "Curitiba, PR", destination: "Campo Grande, MS", distanceKm: 990 },
    { origin: "São Paulo, SP", destination: "Ribeirão Preto, SP", distanceKm: 314 },
    { origin: "São Paulo, SP", destination: "Sorocaba, SP", distanceKm: 100 },
    { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
  ],

  getAllCities: function getAllCities() {
    // Extract cities from both origin and destination, remove duplicates, sort
    var citySet = Object.create(null);

    for (var i = 0; i < this.routes.length; i++) {
      var route = this.routes[i];
      if (route && route.origin) citySet[route.origin] = true;
      if (route && route.destination) citySet[route.destination] = true;
    }

    return Object.keys(citySet).sort(function (a, b) {
      return a.localeCompare(b, "pt-BR");
    });
  },

  findDistance: function findDistance(origin, destination) {
    // Find route distance between two cities (case-insensitive, trims whitespace)
    if (!origin || !destination) return null;

    var o = String(origin).trim().toLowerCase();
    var d = String(destination).trim().toLowerCase();

    for (var i = 0; i < this.routes.length; i++) {
      var route = this.routes[i];
      if (!route) continue;

      var ro = String(route.origin || "").trim().toLowerCase();
      var rd = String(route.destination || "").trim().toLowerCase();

      // Match both directions
      if ((ro === o && rd === d) || (ro === d && rd === o)) {
        return route.distanceKm;
      }
    }

    return null;
  },
};
