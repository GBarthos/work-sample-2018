/**
 * Expose a common interface for logging out things.
 * For now it's only the Console global.
 */
const logger = console;

/**
 * Log the given message, then immediately exit the process.
 *
 * @param {String} message  - error message to log out
 * @param {Number} exitCode - code to end the process with
 */
function handleError(message, exitCode = 1) {
    const msg = (!message || typeof message !== 'string') ? 'an error occured!' : message;
    logger.error(`[fatal] ${msg}\n`);
    process.exit(exitCode);
}

/**
 * Returns whether the given value is a boolean or not.
 *
 * @param {*} value - the value to test against.
 * @returns {boolean} - whether the given value is a boolean or not.
 */
function isBoolean(value) {
    return typeof value === 'boolean';
}

/**
 * Returns whether the given value is a function or not.
 *
 * @param {*} value - the value to test against.
 * @returns {boolean} - whether the given value is a function or not.
 */
function isFunction(value) {
    return typeof value === 'function';
}

/**
 * Returns whether the given value is a number or not.
 *
 * @param {*} value - the value to test against.
 * @returns {boolean} - whether the given value is a number or not.
 */
function isNumber(value) {
    return (
        typeof value === 'number' &&
        !isNaN(value)
    );
}

/**
 * Returns whether the given value is a plain-object or not.
 *
 * @param {*} value - the value to test against.
 * @returns {boolean} - whether the given value is a plain-object or not.
 */
function isPlainObject(value) {
    return (
        typeof value === 'object' &&
        value !== null &&
        value.constructor === Object
    );
}

/**
 * Returns whether the given value is a string or not.
 *
 * @param {*} value - the value to test against.
 * @returns {boolean} - whether the given value is a string or not.
 */
function isString(value) {
    return typeof value === 'string';
}

/**
 * Returns whether the given value is undefined or not.
 *
 * @param {*} value - the value to test against.
 * @returns {boolean} - whether the given value is undefined or not.
 */
function isUndefined(value) {
    return typeof value === 'undefined';
}

/**
 * Set a property with a value on the given object.
 * This property will be defined with the following descriptors:
 * {
 *  enumerable: false,
 *  configurable: true,
 *  writable: false
 * }
 * This property is "non-enumerable" because can not be enumerated
 * or assigned.
 *
 * @param {object} target - the object to set the property on.
 * @param {string} name - the name of the property to set.
 * @param {*} value - the value to set the property with.
 */
function setNonEnumerableProperty(target, name, value) {
    Object.defineProperty(target, name, {
        enumerable: false,
        configurable: true,
        writable: false,
        value
    });
}

/**
 * Set a property with a value on the given object.
 * This property will be defined with the following descriptors:
 * {
 *  enumerable: false,
 *  configurable: false,
 *  writable: true
 * }
 * This property is "private" because can not be enumerated
 * or modified.
 *
 * @param {object} target - the object to set the property on.
 * @param {string} name - the name of the property to set.
 * @param {*} value - the value to set the property with.
 */
function setPrivateProperty(target, name, value) {
    Object.defineProperty(target, name, {
        enumerable: false,
        configurable: false,
        writable: true,
        value
    });
}

module.exports = {
    handleError,
    isBoolean,
    isFunction,
    isNumber,
    isPlainObject,
    isString,
    isUndefined,
    logger,
    setNonEnumerableProperty,
    setPrivateProperty,
};
