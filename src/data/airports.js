const clients = require('./clients.js');
const flights = require('./flights.js');

/**
 * Aggregate every airports from clients and flights
 * origins and destinations.
 */
const result = ([]
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

module.exports = result;
