class TravelDurationModel {
    /**
     * @constructor
     * @memberof TravelDurationModel
     * @param {Object} data dictonary of properties to initialize an instance with
     */
    constructor(data) {
        this.totalTime = data.totalTime || 0;
        this.flightTime = data.flightTime || 0;
        this.waitTime = data.waitTime || 0;
    }

    /**
     * Returns whether the current instance is greater, equal or lesser than
     * the given argument duration.
     *
     * @memberof TravelDurationModel
     * @param {TravelDurationModel} duration an instance of duration
     * @returns
     */
    compare(duration) {
        if (!(duration instanceof TravelDurationModel)) {
            throw new TypeError('"TravelDurationModel.compare" takes an instance of TravelDurationModel as argument [duration]');
        }

        return (this.totalTime - duration.totalTime);
    }
}

module.exports = TravelDurationModel;
