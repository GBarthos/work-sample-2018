const { setPrivateProperty, setNonEnumerableProperty, isString, isUndefined } = require('../tools/utils.js');

class GraphError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
        this.date = new Date();
    }

    inspect() {
        return this.stack || this.message;
    }
}

class InvalidArgumentGraphError extends GraphError {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.method = '';
        this.argument = '';
        this.expectedType = '';
        this.receivedType = '';
        this.receivedValue = '';
        Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
    }
}

class KeyUnknownGraphError extends GraphError {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.method = '';
        this.kind = '';
        this.key = '';
        Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
    }
}

function makeInvalidArgumentError(method, argument, received, expectedType = 'non-empty string') {
    const receivedType = typeof received;
    const receivedValue = (received && received.toString) ? (received).toString() : String(received);

    let text = '';
    if (method && isString(method)) {
        text += `"${method}" `;
    }
    if (argument && isString(argument)) {
        text += `argument [${argument}] `;
    }
    if (expectedType && isString(expectedType)) {
        const expectations = [`expected a <${expectedType}>.`];
        if (receivedType && isString(receivedType)) {
            expectations.push(`Received <${receivedType}>`);
        }
        if (isString(receivedValue) && receivedType !== receivedValue) {
            expectations.push(`"${receivedValue}"`);
        }
        text += expectations.join(' ');
    }
    text += (text && text[text.length - 1] !== '.') ? '.' : '';

    const error = new InvalidArgumentGraphError(text);
    error.method = method;
    error.argument = argument;
    error.expectedType = expectedType;
    error.receivedType = receivedType;
    error.receivedValue = receivedValue;

    return error;
}

function makeKeyUnknownError(method, kind, key) {
    let text = '';
    if (method && isString(method)) {
        text += `"${method}" `;
    }
    if (kind && isString(kind)) {
        text += `${kind} `;
    }
    text += 'key ';
    if (key && isString(key)) {
        text += `{${key}} `;
    }
    text +=  text ? 'does not exists.' : '';

    const error = new KeyUnknownGraphError(text);
    error.method = method;
    error.kind = kind;
    error.key = key;

    return error;
}

module.exports = {
    GraphError,
    InvalidArgumentGraphError,
    KeyUnknownGraphError,
    makeInvalidArgumentError,
    makeKeyUnknownError
};
