const TravelDurationModel = require('./TravelDurationModel.js');
const TravelPriceModel = require('./TravelPriceModel.js');

class TravelModel {
    /**
     * @constructor
     * @memberof TravelModel
     * @param {String} origin the origin of the travel
     * @param {String} destination the destination of the travel
     * @param {Object[]} flights the successive flights to go from origin to destination
     */
    constructor(origin, destination, flights) {
        const travel = typeof origin === 'object' ? origin : {};
        const _origin = origin && typeof origin === 'string' ? origin : travel.origin;
        const _destination = destination && typeof destination === 'string' ? destination : travel.destination;
        const _flights = flights && Array.isArray(flights) ? flights : travel.flights;

        if (!_origin) {
            throw new TypeError('"TravelModel" takes a non-empty string for argument [origin]');
        }
        if (!_destination) {
            throw new TypeError('"TravelModel" takes a non-empty string for argument [destination]');
        }
        if (!_flights) {
            throw new TypeError('"TravelModel" takes an array of flight for argument [flights]');
        }

        this.origin = _origin;
        this.destination = _destination;
        this.flights = _flights;

        this.duration = {};
        this.price = {};
    }

    setDuration(duration) {
        if (duration instanceof TravelDurationModel) {
            this.duration = duration;
        } else {
            throw new TypeError('"TravelModel.setDuration" takes an instance of TravelDurationModel for argument [duration]');
        }
    }

    setPrice(price) {
        if (price instanceof TravelPriceModel) {
            this.price = price;
        } else {
            throw new TypeError('"TravelModel.setPrice" takes an instance of TravelPriceModel for argument [price]');
        }
    }
}

module.exports = TravelModel;
