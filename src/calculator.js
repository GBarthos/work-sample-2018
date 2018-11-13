const ClientModel = require('./models/ClientModel.js');
const FlightModel = require('./models/FlightModel.js');
const TravelModel = require('./models/TravelModel.js');
const graph = require('./data/graph.js');
const Graph = require('./graph/Graph.js');

const { isString, logger } = require('./tools/utils.js');
const { findAllPaths } = require('./graph.js');

/**
 * Produce a collection of ClientModel.
 *
 * @param {Object[]|Object} items an item or collection of item representing a client object.
 * @returns {ClientModel[]} a collection of ClientModel instances.
 * @throws {TypeError} - when items is not an array of object, or an object.
 */
function makeClientList(items) {
    if (Array.isArray(items)) {
        return items.map((item) => (item instanceof ClientModel ? item : new ClientModel(item)));
    } else if (typeof items === 'object') {
        return items instanceof ClientModel ? [items] : [new ClientModel(items)];
    } else {
        throw new TypeError('"makeClientList" takes a collection of client items');
    }
}

/**
 * Produce a collection of FlightModel.
 *
 * @param {Object[]|Object} items an item or collection of item representing a flight object.
 * @returns {FlightModel[]} a collection of FlightModel instances.
 * @throws {TypeError} - when items is not an array of object, or an object.
 */
function makeFlightList(items) {
    if (Array.isArray(items)) {
        return items.map((item) => (item instanceof FlightModel ? item : new FlightModel(item)));
    } else if (typeof items === 'object') {
        return items instanceof FlightModel ? [items] : [new FlightModel(items)];
    } else {
        throw new TypeError('"makeFlightList" takes a collection of flight items');
    }
}

/**
 * Aggregate every airports from clients and flights
 * origins and destinations.
 *
 * @param {ClientModel[]} clients - a collection of {@link ClientModel}.
 * @param {FlightModel[]} flights - a collection of {@link FlightModel}.
 * @returns {string[]} - a collection of airports name.
 * @throws {TypeError} - when clients is not an array of ClientModel.
 * @throws {TypeError} - when flights is not an array of FlightModel.
 */
function makeAirportList(clients, flights) {
    if (!Array.isArray(clients) || !clients.every((item) => item instanceof ClientModel)) {
        throw new TypeError('"makeAirportList" takes an array of ClientModel as argument [clients]');
    }
    if (!Array.isArray(flights) || !flights.every((item) => item instanceof FlightModel)) {
        throw new TypeError('"makeAirportList" takes an array of FlightModel as argument [flights]');
    }

    return ([]
        .concat(clients.map((client) => client.origin))
        .concat(clients.map((client) => client.destination))
        .concat(flights.map((flight) => flight.origin))
        .concat(flights.map((flight) => flight.destination))
    ).reduce((accumulator, value) => {
        if (!accumulator.includes(value)) {
            accumulator.push(value);
        }
        return accumulator;
    }, []);
}

/**
 * Provides a graph linking flights to airports.
 *
 * @param {string[]} airports - a collection of airports.
 * @param {FlightModel[]} flights - a collection of flights.
 * @returns {Graph} - an instance of {@link Graph}.
 * @throws {TypeError} - when airports is not an array of string.
 * @throws {TypeError} - when flights is not an array of FlightModel.
 */
function makeGraph(airports, flights) {
    if (!Array.isArray(airports) || !airports.every((item) => isString(item) && item)) {
        throw new TypeError('"makeGraph" takes an array of string as argument [clients]');
    }
    if (!Array.isArray(flights) || !flights.every((item) => item instanceof FlightModel)) {
        throw new TypeError('"makeGraph" takes an array of FlightModel as argument [flights]');
    }

    const graph = new Graph();
    airports.forEach((airport) => {
        graph.addNode(airport);
    });

    flights.forEach((flight) => {
        graph.addEdge(flight.origin, flight.destination, { flight });
    });

    return graph;
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
    const clientList = makeClientList(clients);
    const flightList = makeFlightList(flights);
    const airportList = makeAirportList(clientList, flightList);
    const _graph = makeGraph(airportList, flightList);

    console.log('_graph'); // TODO: #remove
    console.log('<start>'); // TODO: #remove
    console.log(_graph.print()); // TODO: #remove
    console.log('<end>'); // TODO: #remove

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
    const clients = require('./data/clients.js');
    const flights = require('./data/flights.js');

    calculator(clients[0], flights);
}
