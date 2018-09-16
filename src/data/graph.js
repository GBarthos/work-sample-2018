const airports = require('./airports.js');
const clients = require('./clients.js');
const flights = require('./flights.js');

/**
 * Map each airports to a list of flights flying from it.
 */
const graph = airports.reduce((graph, origin) => (
    graph[origin] = flights.filter((flight) => flight.origin === origin), graph
), {});

module.exports = graph;
