class TravelPriceModel {
    /**
     * @constructor
     * @memberof TravelPriceModel
     * @param {Object} data dictonary of properties to initialize an instance with
     */
    constructor(data) {
        this.totalPrice = data.price || 0;
        this.cumulativePrice = data.cumulativePrice || 0;
        this.numberOfStopDiscounts = data.numberOfStopDiscounts || 0;
        this.stopDiscounts = data.stopDiscounts || {};
    }

    /**
     * Returns whether the current instance is greater, equal or lesser than
     * the given argument.
     *
     * @memberof TravelPriceModel
     * @param {TravelPriceModel} duration an instance of duration
     * @returns the difference between this instance and the given argument
     */
    compare(price) {
        if (!(price instanceof TravelPriceModel)) {
            throw new TypeError('"TravelPriceModel.compare" takes an instance of TravelPriceModel as argument [price]');
        }

       return (this.totalPrice - price.totalPrice);
    }
}

module.exports = TravelPriceModel;
