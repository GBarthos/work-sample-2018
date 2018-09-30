/**
 * @typedef {object} TravelPriceModelConstructorObject
 * @property {number} [totalPrice=0] - total cost of the travel
 * @property {string} [cumulativePrice=0] - cumulated cost of each flight
 * @property {Object<string, number>} [stopDiscounts={}] - map counting
 *  the number of stop-over by company traveling from origin to destination.
 */


/**
 * @class TravelPriceModel
 */
class TravelPriceModel {
    /**
     * @constructs TravelPriceModel
     * @memberof TravelPriceModel
     * @param {TravelPriceModelConstructorObject} data - properties to initialize an instance with
     */
    constructor(data) {
        let { totalPrice, cumulativePrice, stopDiscounts } = (data || {});

        totalPrice = typeof totalPrice === 'number' ? totalPrice : 0;
        cumulativePrice = typeof cumulativePrice === 'number' ? cumulativePrice : 0;
        stopDiscounts = typeof stopDiscounts === 'object' ? stopDiscounts : {};

        totalPrice = totalPrice > 0 ? totalPrice : 0;
        cumulativePrice = cumulativePrice > 0 ? cumulativePrice : 0;

        const numberOfStopDiscounts = Object.keys(stopDiscounts)
            .filter((company) => data.stopDiscounts[company] > 1)
            .length;

        /**
         * @type {number} - the total cost of the travel
         */
        this.totalPrice = totalPrice || 0;

        /**
         * @type {number} - the cumulated cost of each flight
         */
        this.cumulativePrice = cumulativePrice || 0;

        /**
         * @type {number} - the total cost of the travel
         */
        this.stopDiscounts = stopDiscounts || {};

        /**
         * @type {number} - the total cost of the travel
         */
        this.numberOfStopDiscounts = numberOfStopDiscounts || 0;
    }

    /**
     * Returns whether the current instance is greater, equal or lesser than
     * the given argument.
     *
     * @memberof TravelPriceModel
     * @param {TravelPriceModel} price - an instance of {@link TravelPriceModel}
     * @returns {number} the difference between the totalPrice of the current
     *  instance and the totalPrice of the given instance.
     * @throws {TypeError}
     */
    compare(price) {
        if (!(price instanceof TravelPriceModel)) {
            throw new TypeError('"TravelPriceModel.compare" takes an instance of TravelPriceModel as argument [price]');
        }

       return (this.totalPrice - price.totalPrice);
    }

    /**
     * TODO: #improve #typeProof
     *
     * @memberof TravelPriceModel
     */
    calculateNumberOfStopDiscounts() {
        this.numberOfStopDiscounts = Object.keys(this.stopDiscounts)
            .filter((company) => this.stopDiscounts[company] > 1)
            .length;
    }

    /**
     * Return a string representing the instance of {@link TravelPriceModel}.
     *
     * @memberof TravelPriceModel
     * @returns {string} - a string representing the instance.
     */
    print() {
        const numberOfStopDiscounts = this.numberOfStopDiscounts ? `, discounts: ${numberOfStopDiscounts}` : '';
        return `Price: ${this.totalPrice} {sum: ${this.cumulativePrice}${numberOfStopDiscounts}}`;
    }
}

module.exports = TravelPriceModel;
