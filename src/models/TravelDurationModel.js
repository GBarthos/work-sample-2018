const { humanReadableDuration } = require('../tools/time.js');

/**
 * @typedef {object} TravelDurationModelConstructorObject
 * @property {string} [totalTime=0] - total amount of time spent on traveling
 * @property {string} [flightTime=0] - total amount of time cumulated during flights
 * @property {string} [waitTime=0] - total amount of time cumulated waiting between flights
 */


/**
 * @class TravelDurationModel
 */
class TravelDurationModel {
    /**
     * @constructs TravelDurationModel
     * @memberof TravelDurationModel
     * @param {TravelDurationModelConstructorObject} data - properties to initialize an instance with
     */
    constructor(data) {
        let { totalTime, flightTime, waitTime } = (data || {});

        totalTime = typeof totalTime === 'number' ? totalTime : 0;
        flightTime = typeof flightTime === 'number' ? flightTime : 0;
        waitTime = typeof waitTime === 'number' ? waitTime : 0;

        /**
         * @type {number} - total amount of time spent on traveling
         */
        this.totalTime = totalTime;

        /**
         * @type {number} - total amount of time cumulated during flights
         */
        this.flightTime = flightTime;

        /**
         * @type {number} - total amount of time cumulated waiting between flights
         */
        this.waitTime = waitTime;
    }

    /**
     * Returns whether the current instance is greater, equal or lesser than
     * the given argument duration.
     *
     * @memberof TravelDurationModel
     * @param {TravelDurationModel} duration - an instance of {@link TravelDurationModel}
     * @returns {number} - the difference between the totalTime of the current
     *   instance and the totalTime of the given instance.
     * @throws {TypeError}
     */
    compare(duration) {
        if (!(duration instanceof TravelDurationModel)) {
            throw new TypeError('"TravelDurationModel.compare" takes an instance of TravelDurationModel as argument [duration]');
        }

        return (this.totalTime - duration.totalTime);
    }

     /**
     * Return a string representing the instance of {@link TravelDurationModel}
     *
     * @memberof TravelDurationModel
     * @returns {string} - a string representing the instance.
     */
    print() {
        const totalTime = humanReadableDuration(this.totalTime);
        const flightTime = humanReadableDuration(this.flightTime);
        const waitTime = humanReadableDuration(this.waitTime) || 0;
        return `Duration: ${totalTime} {flight: ${flightTime}, wait: ${waitTime}}`;
    }
}

module.exports = TravelDurationModel;
