/**
 * Enum defining the preferences available in a {@link ClientModel}
 *
 * @enum {string}
 */
const CLIENT_PREFERENCES = Object.freeze({
    COST: 'Cost',
    TIME: 'Time'
});

/**
 * Enum defining the types available in a {@link ClientModel}
 *
 * @enum {string}
 */
const CLIENT_TYPES = Object.freeze({
    ONE_WAY: 'OneWay',
    ROUND_TRIP: 'RoundTrip'
});


/**
 * @typedef {object} ClientModelConstructorObject
 * @property {string} name - the name of the client
 * @property {string} origin - the origin of the client
 * @property {string} destination - the destination of the client
 * @property {string} preference - the time/cost preference of the client
 * @property {string} type - the kind of travel (one-way/round-trip) of the client
 */

 /**
  * Create a ClientModel, reprensenting the data for a client.
  *
  * @class ClientModel
  */
class ClientModel {
    /**
     * @memberof ClientModel
     * @static
     * @public
     * @readonly
     * @returns {CLIENT_PREFERENCES}
     */
    static get Preferences() {
        return CLIENT_PREFERENCES;
    }

    /**
     * @memberof ClientModel
     * @static
     * @public
     * @readonly
     * @returns {CLIENT_TYPES}
     */
    static get Types() {
        return CLIENT_TYPES;
    }

    /**
     * @constructs ClientModel
     * @memberof ClientModel
     * @param {ClientModelConstructorObject} data - properties to initialize an instance with
     * @throws {TypeError}
     */
    constructor(data) {
        let { name, origin, destination, preference, type } = (data || {});

        name = typeof name === 'string' ? name : null;
        origin = typeof origin === 'string' ? origin : null;
        destination = typeof destination === 'string' ? destination : null;
        preference = typeof preference === 'string' ? preference : null;
        type = typeof type === 'string' ? type : null;

        if (!name) { throw new TypeError('"ClientModel" takes a non-empty string as argument [name]'); }
        if (!origin) { throw new TypeError('"ClientModel" takes a non-empty string as argument [origin]'); }
        if (!destination) { throw new TypeError('"ClientModel" takes a non-empty string as argument [destination]'); }
        if (!preference) { throw new TypeError('"ClientModel" takes a non-empty string as argument [preference]'); }
        if (!type) { throw new TypeError('"ClientModel" takes a non-empty string as argument [type]'); }

        preference = Object.values(ClientModel.Preferences).find(
            (value) => String(value).toLowerCase() === String(preference).toLowerCase()
        ) || null;

        type = Object.values(ClientModel.Types).find(
            (value) => String(value).toLowerCase() === String(type).toLowerCase()
        ) || null;

        if (!preference) { throw new TypeError('"ClientModel" takes a string from "ClientModel#Preferences" enum as argument [preference]'); }
        if (!type) { throw new TypeError('"ClientModel" takes a string from "ClientModel#Types" enum as argument [type]'); }

        /**
         * @type {string} - the client's name.
         */
        this.name = name;

        /**
         * @type {string} - the client's origin.
         */
        this.origin = origin;

        /**
         * @type {string} - the client's destination.
         */
        this.destination = destination;

        /**
         * @type {CLIENT_PREFERENCES} - the client's preference between cost
         *  and time.
         */
        this.preference = preference;

        /**
         * @type {CLIENT_TYPES} - the client's type of flight between one-way
         *  trip and round trip.
         */
        this.type = type;
    }

    /**
     * Return a string representing the instance of {@link ClientModel}
     *
     * @memberof ClientModel
     * @returns {string} - a string representing the instance.
     */
    print() {
        return `${this.name} [${this.origin} => ${this.destination}] (${this.preference}) <${this.type}>`;
    }
}

module.exports = ClientModel;
