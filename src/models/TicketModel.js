const ClientModel = require('./ClientModel.js');
const TravelModel = require('./TravelModel.js');

/**
 * @class TicketModel
 */
class TicketModel {
    /**
     * @constructs TicketModel
     * @memberof TicketModel
     * @param {ClientModel} client - TODO
     * @param {TravelModel} goTrip - TODO
     * @param {TravelModel} returnTrip - TODO
     * @throws {TypeError}
     */
    constructor(client, goTrip, returnTrip) {
        const _client = client && client instanceof ClientModel ? client : null;
        const _go = goTrip && goTrip instanceof TravelModel ? goTrip : null;
        const _return = returnTrip && returnTrip instanceof TravelModel ? returnTrip : null;

        if (!_client) { throw new TypeError('"TicketModel" takes a ClientModel instance as argumetn [client]'); }
        if (!_go) { throw new TypeError('"TicketModel" takes a TravelModel instance as argumetn [goTrip]'); }
        if (!_return) { throw new TypeError('"TicketModel" takes a TravelModel instance as argumetn [returnTrip]'); }

        /**
         * @type {ClientModel} - the client having this ticket.
         */
        this.client = _client;

        /**
         * @type {TravelModel} - the go trip.
         */
        this.go = _go;

        /**
         * @type {TravelModel} - the return trip.
         */
        this.return = _return;
    }

    /**
     * Return a string representing this instance of {@link TicketModel}.
     *
     * @memberof TicketModel
     * @returns {string} - a string representing this instance
     */
    print() {
        const clientBlock = this.client.print();
        const travelsBlock = [this.go, this.return]
            .map((travel) => travel.print().split('\n'))
            .reduce((acc, travel) => acc.concat(travel), []);

        return [clientBlock].concat(travelsBlock).join('\n  |');
    }
}

module.exports = TicketModel;
