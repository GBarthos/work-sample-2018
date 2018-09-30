/**
 * @typedef {object} FlightModelConstructorObject
 * @property {number|string} number - the number of the flight
 * @property {string} company - the company operating the flight
 * @property {string} origin - the origin of the flight
 * @property {string} destination - the destination of the flight
 * @property {TimeString} departure - a string representing the time of departure
 * @property {TimeString} arrival - a string representing the time of arrival
 * @property {number|string} cost - the cost of the flight
 */

/**
 * Create a FlightModel, reprensenting the data for a flight.
 *
 * @class FlightModel
 */
class FlightModel {
    /**
     * @constructs FlightModel
     * @memberof FlightModel
     * @param {FlightModelConstructorObject} data - properties to initialize an instance with
     * @throws {TypeError}
     */
    constructor(data) {
        let { number, company, origin, destination, departure, arrival, cost } = (data || {});

        number = (typeof number === 'string' || typeof number === 'number') ? String(number) : null;
        company = typeof company === 'string' ? company : null;
        origin = typeof origin === 'string' ? origin : null;
        destination = typeof destination === 'string' ? destination : null;
        departure = typeof departure === 'string' ? departure.replace(/Z/gi, '') : null;
        arrival = typeof arrival === 'string' ? arrival.replace(/Z/gi, '') : null;

        if (typeof cost === 'string' || typeof cost === 'number') {
            const numberValue = parseFloat(cost);
            cost = isFinite(numberValue) ? numberValue : null;
        }

        if (!number) { throw new TypeError('"FlightModel" takes a non-empty string or a finite number as argument [number]'); }
        if (!company) { throw new TypeError('"FlightModel" takes a non-empty string as argument [company]'); }
        if (!origin) { throw new TypeError('"FlightModel" takes a non-empty string as argument [origin]'); }
        if (!destination) { throw new TypeError('"FlightModel" takes a non-empty string as argument [destination]'); }
        if (!departure) { throw new TypeError('"FlightModel" takes a non-empty string as argument [departure]'); }
        if (!arrival) { throw new TypeError('"FlightModel" takes a non-empty string as argument [arrival]'); }
        if (!cost) { throw new TypeError('"FlightModel" takes a non-empty string or a finite number as argument [cost]'); }

        const _companyAcronyme = company
            .split(' ')
            .map((value) => value[0])
            .join('')
            .toUpperCase();

        /**
         * @type {string} - the flight number
         */
        this.number = number;

        /**
         * @type {string} - the company name for the flight
         */
        this.company = company;

        /**
         * @type {string} - the airport the flight departs from
         */
        this.origin = origin;

        /**
         * @type {string} - the airport the flight arrives to
         */
        this.destination = destination;

        /**
         * @type {string} - the time this flight departs at
         */
        this.departure = departure;

        /**
         * @type {string} - the time this flight arrives at
         */
        this.arrival = arrival;

        /**
         * @type {number} - the base cost for the flight
         */
        this.cost = cost;

        /**
         * @type {string} - name of the flight, composed of
         *  the acronym of the company name and flight number
         */
        this.name = `${_companyAcronyme}${number}`;
    }

    /**
     * Return a string representing the instance of {@link FlightModel}
     *
     * @memberof FlightModel
     * @returns {string} - a string representing the instance.
     */
    print() {
        return `${this.name} ${this.departure} (${this.origin}) / ${this.arrival} (${this.destination})`;
    }
}

module.exports = FlightModel;
