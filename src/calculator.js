const airports = require('./data/airports.js');
const clients = require('./data/clients.js');
const flights = require('./data/flights.js');
const graph = require('./data/graph.js');
const { logger } = require('./tools/utils.js');
const { humanReadableDuration } = require('./tools/time.js');
const { findAllPaths } = require('./graph.js');
const { computeTotalPrice, computeTotalDuration } = require('./compute-graph.js');


/**
 * Print the data of a client and its trip.
 *
 * @param {Object} client an object representing a client
 * @param {Object} trip an object representing a path for a client
 */
function printTrip(client, trip) {
    logger.log(
        `${client.name} [${client.origin} => ${client.destination}] (${client.preference})` +
        `\n  |> Total duration: ${humanReadableDuration(trip.totalTime)} {flight: ${humanReadableDuration(trip.totalFlightDuration)}, wait: ${humanReadableDuration(trip.totalWait) || '0'}}` +
        `\n  |> Total Price: ${trip.totalPrice} {sum: ${trip.sum}, discounts: ${trip.numberOfStopDiscounts}}`+
        `\n  |- ${trip.flights.map((flight) => {
            return (`Departure ${flight.departure} (${flight.origin}) / Arrival ${flight.arrival} (${flight.destination})`);
        }).join('\n  |- ')}
    `);
}

/**
 * Provide an object with price and time info for a given client.
 * It also represent the most adequate trip possible for the given
 * client, considering its preference.
 *
 * @param {Object} client an object representing a client
 * @returns array of object enhanced with time and price info (or null)
 */
function getMostAdequateTrip(client) {
    if (!client) {
        throw new Error('"getMostAdequateTrip" takes a client as argument');
    }

    const paths = findAllPaths(graph, client.origin, client.origin, client.destination, path = []);
    const data = paths.map((edges) => {
        const durationData = computeTotalDuration(edges);
        const priceData = computeTotalPrice(edges);

        return { ...durationData, ...priceData, flights: edges };
    });

    const cheapest = data.reduce((accumulator, item) => (
        !accumulator || (item.totalPrice < accumulator.totalPrice) ?
        item : accumulator
    ), null);

    const fastest =  data.reduce((accumulator, item) => (
        !accumulator || (item.totalTime < accumulator.totalTime) ?
        item: accumulator
    ), null);

    if (client.preference === "Time") {
        return fastest;
    } else if (client.preference === "Cost") {
        return cheapest;
    } else {
        return null;
    }
}

//  MAIN EXECUTION STARTS HERE ! ////
clients.map((client) => {
    const trip = getMostAdequateTrip(client);
    printTrip(client, trip);
});
