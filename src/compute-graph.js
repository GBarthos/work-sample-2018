const { timeToDuration } = require('./tools/time.js');

/**
 * Compute the total price for every possible paths
 * given in edges.
 *
 * @param {Array} edges array of possible paths
 * @returns array of object enhance with price info
 */
function computeTotalPrice(edges) {
    if (!Array.isArray(edges)) {
        throw new TypeError('"computeTotalPrice" takes a list of fligths');
    }

    const data = edges.reduce((accumulator, edge) => {
        accumulator.sum += edge.cost;

        if (accumulator.stopDiscounts[edge.company]) {
            accumulator.stopDiscounts[edge.company]++;
        } else {
            accumulator.stopDiscounts[edge.company] = 1;
        }

        return accumulator;
    }, { sum: 0, stopDiscounts: {}, flights: edges });

    const numberOfStopDiscounts = Object.keys(data.stopDiscounts)
        .filter((company) => data.stopDiscounts[company] > 1)
        .length;

    data.numberOfStopDiscounts = numberOfStopDiscounts;
    data.totalPrice = data.sum * ((numberOfStopDiscounts  * (1 - 0.25)) || 1);

    return data;
}

/**
 * Compute the total time for every possible paths
 * given in edges.
 *
 * @param {Array} edges array of possible paths
 * @returns array of object enhanced with time info
 */
function computeTotalDuration(edges) {
    if (!Array.isArray(edges)) {
        throw new TypeError('"computeTotalPrice" takes a list of fligths');
    }

    const data = edges.reduce((accumulator, edge, index, array) => {
        let wait = 0;
        if (index > 0) {
            previousArrival = array[index-1].arrival;
            interval = timeToDuration(previousArrival, edge.departure);

            wait = interval > 30 ? interval : (interval + 1440);
        }

        const flightDuration = timeToDuration(edge.departure, edge.arrival);

        accumulator.totalWait += wait;
        accumulator.totalFlightDuration += flightDuration;
        accumulator.totalTime += (wait + flightDuration);

        return accumulator;
    }, { totalWait: 0, totalFlightDuration: 0, totalTime: 0, flights: edges });

    return data;
}

module.exports = {
    computeTotalPrice,
    computeTotalDuration
};
