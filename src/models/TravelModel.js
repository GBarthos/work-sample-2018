const TravelDurationModel = require('./TravelDurationModel.js');
const TravelPriceModel = require('./TravelPriceModel.js');
const FlightModel = require('./FlightModel.js');
const { timeToDuration } = require('../tools/time.js');


/**
 * Enum defining the types available in a {@link TravelModel}
 *
 * @enum {string}
 */
const TRAVEL_TYPES = Object.freeze({
    GO_TRIP: 'Go',
    RETURN_TRIP: 'Return'
});


/**
 * @class TravelModel
 */
class TravelModel {
    /**
     * @memberof TravelModel
     * @static
     * @public
     * @readonly
     * @returns {TRAVEL_TYPES}
     */
    static get Types() {
        return TRAVEL_TYPES;
    }

    /**
     * Compute the total time for every possible paths
     * given in edges.
     *
     * @memberof TravelModel
     * @public
     * @static
     * @param {Object[]} edges - array of possible paths
     * @returns the instance itself
     */
    static computeDuration(edges) {
        if (!Array.isArray(edges)) {
            throw new TypeError('"TravelModel#computeDuration" takes a list of fligths');
        }

        const data = edges.reduce((accumulator, edge, index, array) => {
            let wait = 0;
            if (index > 0) {
                const previousArrival = array[index-1].arrival;
                const interval = timeToDuration(previousArrival, edge.departure);

                wait = interval > 30 ? interval : (interval + 1440);
            }

            const flightDuration = timeToDuration(edge.departure, edge.arrival);

            accumulator.waitTime += wait;
            accumulator.flightTime += flightDuration;
            accumulator.totalTime += (wait + flightDuration);

            return accumulator;
        }, new TravelDurationModel());

        return data;
    }

    /**
     * Compute the price for every possible paths
     * given in edges.
     *
     * @memberof TravelModel
     * @public
     * @static
     * @param {Object[]} edges - array of possible paths
     * @returns the instance itself
     */
    static computePrice(edges) {
        if (!Array.isArray(edges)) {
            throw new TypeError('"TravelModel#computePrice" takes a list of fligths');
        }

        const data = edges.reduce((accumulator, edge) => {
            accumulator.cumulativePrice += edge.cost;

            // TODO: #improve - if/else content - numberOfStopDiscounts
            if (accumulator.stopDiscounts[edge.company]) {
                accumulator.stopDiscounts[edge.company]++;
                accumulator.numberOfStopDiscounts++;
            } else {
                accumulator.stopDiscounts[edge.company] = 1;
            }

            return accumulator;
        }, new TravelPriceModel());

        // const numberOfStopDiscounts = Object.keys(data.stopDiscounts)
        //     .filter((company) => data.stopDiscounts[company] > 1)
        //     .length;
        // data.calculateNumberOfStopDiscounts();

        // data.numberOfStopDiscounts = numberOfStopDiscounts;

        // TODO: #improve - apply successive discounts
        data.totalPrice = data.cumulativePrice * ((data.numberOfStopDiscounts  * (1 - 0.25)) || 1);

        return data;
    }

    /**
     * @constructs TravelModel
     * @memberof TravelModel
     * @param {string} origin - origin of the travel
     * @param {string} destination - destination of the travel
     * @param {FlightModel[]} flights - the successive flights to go from origin to destination
     */
    constructor(origin, destination, flights, type) {
        const _origin = typeof origin === 'string' ? origin : null;
        const _destination = typeof destination === 'string' ? destination : null;
        let _flights = Array.isArray(flights) ? flights : null;
        let _type = typeof type === 'string' ? type : null;

        _flights = _flights.map((flight) => (flight instanceof FlightModel ? flight : new FlightModel(flight)));

        _type = Object.values(TravelModel.Types).find(
            (value) => String(value).toLowerCase() === String(type).toLowerCase()
        ) || null;

        if (!_origin) {
            throw new TypeError('"TravelModel" takes a non-empty string for argument [origin]');
        }
        if (!_destination) {
            throw new TypeError('"TravelModel" takes a non-empty string for argument [destination]');
        }
        if (!_flights) {
            throw new TypeError('"TravelModel" takes an array of FlightModel instances for argument [flights]');
        }

        /**
         * @type {string} - the origin of the travel
         */
        this.origin = _origin;

        /**
         * @type {string} - the destination of the travel
         */
        this.destination = _destination;

        /**
         * @type {string} - the successive flights to go from origin to destination
         */
        this.flights = _flights;

        /**
         * @type {TRAVEL_TYPES} - the kind of travel, whether it is a
         *  GO trip or RETURN trip.
         */
        this.type = _type || this.constructor.Types.GO_TRIP;

        /**
         * @type {TravelDurationModel} - an instance of {@link TravelDurationModel}
         *  representing the data for travel duration.
         */
        this.duration = this.constructor.computeDuration(flights);

        /**
         * @type {TravelPriceModel} - an instance of {@link TravelPriceModel}
         *  representing the data for travel cost.
         */
        this.price = this.constructor.computePrice(flights);
    }

    /**
     * Return a string representing the instance of {@link TravelModel}
     *
     * @memberof TravelModel
     * @returns {string} - a string representing the instance.
     */
    print() {
        const blocks = []
            .concat(`>> ${this.duration.print()}`)
            .concat(`>> ${this.price.print()}`)
            .concat(this.flights.map((flight) => `- ${flight.print()}`))
            .map((value) => `  ${value}`);

        return [`[Travel "${this.type}"]`].concat(blocks).join('\n');
    }
}

module.exports = TravelModel;
