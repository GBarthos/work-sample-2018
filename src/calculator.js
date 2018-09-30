const dedent = require('dedent');

const airports = require('./data/airports.js');
const clients = require('./data/clients.js');
const flights = require('./data/flights.js');
const graph = require('./data/graph.js');
const ClientModel = require('./models/ClientModel.js');
const FlightModel = require('./models/FlightModel.js');
const TravelModel = require('./models/TravelModel.js');

const { logger } = require('./tools/utils.js');
const { findAllPaths } = require('./graph.js');

/**
 * Produce a collection of ClientModel.
 *
 * @param {Object[]|Object} items an item or collection of item representing a client object.
 * @returns {ClientModel[]} a collection of ClientModel instances.
 */
function makeClients(items) {
    if (Array.isArray(items)) {
        return items.map((item) => (item instanceof ClientModel ? item : new ClientModel(item)));
    } else if (typeof items === 'object') {
        return items instanceof ClientModel ? [items] : [new ClientModel(items)];
    } else {
        throw new TypeError('"makeClients" takes a collection of client items');
    }
}

/**
 * Produce a collection of FlightModel.
 *
 * @param {Object[]|Object} items an item or collection of item representing a flight object.
 * @returns {FlightModel[]} a collection of FlightModel instances.
 */
function makeFlights(items) {
    if (Array.isArray(items)) {
        return items.map((item) => (item instanceof FlightModel ? item : new FlightModel(item)));
    } else if (typeof items === 'object') {
        return items instanceof FlightModel ? [items] : [new FlightModel(items)];
    } else {
        throw new TypeError('"makeFlights" takes a collection of flight items');
    }
}

function printTicket(client, travels) {
    const clientBlock = client.print();
    const travelsBlock = travels
        .map((travel) => travel.print().split('\n'))
        .reduce((acc, travel) => acc.concat(travel), []);

    return [clientBlock].concat(travelsBlock).join('\n  |');
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
    const data = paths.map((edges) => (
        new TravelModel(client.origin, client.destination, edges)
    ));

    const cheapest = data.reduce((accumulator, travel) => (
        !accumulator || (accumulator.price.compare(travel.price) > 0) ?
        travel : accumulator
    ), null);

    const fastest =  data.reduce((accumulator, travel) => (
        !accumulator || (accumulator.duration.compare(travel.duration) > 0) ?
        travel: accumulator
    ), null);

    if (client.preference === ClientModel.Preferences.TIME) {
        return fastest;
    } else if (client.preference === ClientModel.Preferences.COST) {
        return cheapest;
    } else {
        return null;
    }
}

function calculator(clients, flights) {
    const clientList = makeClients(clients);
    const flightList = makeFlights(flights);

    clientList.forEach((client) => {
        const travel = getMostAdequateTravel(client);
        const text = printTicket(client, [travel]);
        logger.log(text);
    });
}

// EXPORTS
module.exports = calculator;

//  MAIN EXECUTION STARTS HERE ! ////
if (typeof module != 'undefined' && require.main === module) {
    calculator(clients[0], flights);
}
