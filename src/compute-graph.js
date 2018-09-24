const { timeToDuration } = require('./tools/time.js');
const TravelDurationModel = require('./models/TravelDurationModel.js');
const TravelPriceModel = require('./models/TravelPriceModel.js');

// TODO: #improve -
// enforce edges as a "type".
// create a class Flight and represent edges as an arry of it.
// could also make this for client and airports as well ?

/**
 * Compute the total price for every possible paths
 * given in edges.
 *
 * @param {Array} edges array of possible paths
 * @returns array of object enhance with price info
 */
function computeTravelPrice(edges) {
    if (!Array.isArray(edges)) {
        throw new TypeError('"computeTotalPrice" takes a list of fligths');
    }

    // TODO: #improve -
    // initialize data with a new instance of TravelDurationModel
    // then pass it to reducer and returns it.
    const data = edges.reduce((accumulator, edge) => {
        accumulator.cumulativePrice += edge.cost;

        if (accumulator.stopDiscounts[edge.company]) {
            accumulator.stopDiscounts[edge.company]++;
        } else {
            accumulator.stopDiscounts[edge.company] = 1;
            // accumulator.numberOfStopDiscounts++;
        }

        return accumulator;
    }, { totalPrice: 0, cumulativePrice: 0, stopDiscounts: {}, flights: edges });

    const numberOfStopDiscounts = Object.keys(data.stopDiscounts)
        .filter((company) => data.stopDiscounts[company] > 1)
        .length;

    data.numberOfStopDiscounts = numberOfStopDiscounts;
    // for (let i = 0; i++; i < numberOfStopDiscounts) {
    //     data.price = data.cumulativePrice * (1 - 0.25);
    // }
    data.totalPrice = data.cumulativePrice * ((numberOfStopDiscounts  * (1 - 0.25)) || 1);

    const price = new TravelPriceModel(data);

    return price;
}

/**
 * Compute the total time for every possible paths
 * given in edges.
 *
 * @param {Array} edges array of possible paths
 * @returns array of object enhanced with time info
 */
function computeTravelDuration(edges) {
    if (!Array.isArray(edges)) {
        throw new TypeError('"computeTotalPrice" takes a list of fligths');
    }

    // TODO: #improve -
    // initialize data with a new instance of TravelDurationModel
    // then pass it to reducer and returns it.
    const data = edges.reduce((accumulator, edge, index, array) => {
        let wait = 0;
        if (index > 0) {
            previousArrival = array[index-1].arrival;
            interval = timeToDuration(previousArrival, edge.departure);

            wait = interval > 30 ? interval : (interval + 1440);
        }

        const flightDuration = timeToDuration(edge.departure, edge.arrival);

        accumulator.waitTime += wait;
        accumulator.flightTime += flightDuration;
        accumulator.totalTime += (wait + flightDuration);

        return accumulator;
    }, { waitTime: 0, flightTime: 0, totalTime: 0, flights: edges });

    const duration = new TravelDurationModel(data);

    return duration;
}

module.exports = {
    computeTravelPrice,
    computeTravelDuration
};
