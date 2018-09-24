const dedent = require('dedent');

const airports = require('./data/airports.js');
const clients = require('./data/clients.js');
const flights = require('./data/flights.js');
const graph = require('./data/graph.js');
const TravelModel = require('./models/TravelModel.js');
const { logger } = require('./tools/utils.js');
const { humanReadableDuration } = require('./tools/time.js');

const { findAllPaths } = require('./graph.js');
const { computeTravelPrice, computeTravelDuration } = require('./compute-graph.js');


/**
 * Print the data of a client and its travel.
 *
 * @param {Object} client an object representing a client
 * @param {Object} travel an object representing a path for a client
 */
function printTravel(travel, index) {
    const duration = humanReadableDuration(travel.duration.totalTime);
    const flightTime = humanReadableDuration(travel.duration.flightTime);
    const waitTime = humanReadableDuration(travel.duration.waitTime) || 0;
    const price = travel.price.totalPrice;
    const cumulativePrice = travel.price.cumulativePrice;
    const numberOfStopDiscounts = travel.price.numberOfStopDiscounts;

    const details = [
        `>> Duration: ${duration} {flight: ${flightTime}, wait: ${waitTime}}`,
        `>> Price: ${price} {sum: ${cumulativePrice}, discounts: ${numberOfStopDiscounts}}`
    ];

    const flights = travel.flights.map((flight) => {
        const company = flight.company.split(' ').map((text) => text[0]).join('');
        const flightNumber = `${company}${flight.number}`;

        return `- ${flightNumber} ${flight.departure} (${flight.origin}) / ${flight.arrival} (${flight.destination})`;
    });

    const blocks = [].concat(details).concat(flights).map((value) => `  ${value}`);
    return [`[Travel ${index + 1}]`].concat(blocks);
}

function printTicket(client, travels) {
    const clientBlock = `${client.name} [${client.origin} => ${client.destination}] (${client.preference}) <${client.type}>`;
    const travelsBlock = travels
        .map((travel, index) => printTravel(travel, index))
        .reduce((acc, travel) => acc.concat(travel), []);

    return [clientBlock].concat(travelsBlock);
}

/**
 * Provide an object with price and time info for a given client.
 * It also represent the most adequate travel possible for the given
 * client, considering its preference.
 *
 * @param {Object} client an object representing a client
 * @returns array of object enhanced with time and price info (or null)
 */
function getMostAdequateTravel(client) {
    if (!client) {
        throw new Error('"getMostAdequateTravel" takes a client as argument');
    }

    const paths = findAllPaths(graph, client.origin, client.origin, client.destination, path = []);
    const data = paths.map((edges) => {
        const travel = new TravelModel(client.origin, client.destination, edges);
        travel.setDuration(computeTravelDuration(edges));
        travel.setPrice(computeTravelPrice(edges));

        return travel;
    });

    const cheapest = data.reduce((accumulator, travel) => (
        !accumulator || (accumulator.price.compare(travel.price) > 0) ?
        travel : accumulator
    ), null);

    const fastest =  data.reduce((accumulator, travel) => (
        !accumulator || (accumulator.duration.compare(travel.duration) > 0) ?
        travel: accumulator
    ), null);

    if (client.preference === "Time") {
        return fastest;
    } else if (client.preference === "Cost") {
        return cheapest;
    } else {
        return null;
    }
}

// TODO: #imrpove -
// actully make all this process independent of the folder ./data .
// automatate it and provide a single entry-point function.
// make so that when this file is called as main script, execute
// the process on the specific data in folder ./data

//  MAIN EXECUTION STARTS HERE ! ////
[clients[0]].map((client) => {
    const travel = getMostAdequateTravel(client);
    // TODO: #improve - actually log instead of returning a string
    const text = printTicket(client, [travel]);
    logger.log(text.join('\n  |'));
});
