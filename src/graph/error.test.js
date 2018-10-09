const tap = require('tap');

const {
    GraphError,
    InvalidArgumentGraphError,
    KeyUnknownGraphError,
    makeInvalidArgumentError,
    makeKeyUnknownError
} = require('./errors.js');

tap.test('src/graph/error.js', async() => {
    const noop = () => {};
    const date = new Date();
    const map = new Map();
    const regex = /regex/;

    const nonStringValues = [true, false, 0, 123, NaN, undefined, null, [], [1], {}, {a:1}, noop, regex, date, map];

    tap.test('GraphError', async() => {
        tap.test('should identify as the correct type', async() => {
            const error = new GraphError();
            tap.isa(error, Error);
            tap.equal(error.name, 'GraphError');
        });

        tap.test('should provide the correct message', async() => {
            const error = new GraphError('message');
            tap.equal(error.message, 'message');
        });

        tap.test('should provide an empty message', async() => {
            const error = new GraphError();
            tap.equal(error.message, '');
        });
    });

    tap.test('InvalidArgumentGraphError', async() => {
        tap.test('should identify as the correct type', async() => {
            const error = new InvalidArgumentGraphError();
            tap.isa(error, Error);
            tap.isa(error, GraphError);
            tap.equal(error.name, 'InvalidArgumentGraphError');
        });

        tap.test('should provide the correct message', async() => {
            const error = new InvalidArgumentGraphError('message');
            tap.equal(error.message, 'message');
        });

        tap.test('should provide an empty message', async() => {
            const error = new InvalidArgumentGraphError();
            tap.equal(error.message, '');
        });
    });

    tap.test('KeyUnknownGraphError', async() => {
        tap.test('should identify as the correct type', async() => {
            const error = new KeyUnknownGraphError();
            tap.isa(error, Error);
            tap.isa(error, GraphError);
            tap.equal(error.name, 'KeyUnknownGraphError');
        });

        tap.test('should provide the correct message', async() => {
            const error = new KeyUnknownGraphError('message');
            tap.equal(error.message, 'message');
        });

        tap.test('should provide an empty message', async() => {
            const error = new KeyUnknownGraphError();
            tap.equal(error.message, '');
        });
    });

    tap.test('makeInvalidArgumentError', async() => {
        tap.test('should identify as the correct error type', async() => {
            const error = makeInvalidArgumentError();
            tap.isa(error, InvalidArgumentGraphError);
            tap.equal(error.name, 'InvalidArgumentGraphError');
        });

        tap.test('should contains the correct "method" string', async() => {
            nonStringValues.forEach((value) => {
                tap.notMatch(makeInvalidArgumentError(value).message, /^".*"/);
            });
            tap.notMatch(makeInvalidArgumentError('').message, /^".*"/);

            tap.match(makeInvalidArgumentError('method').message, /^"method"/);
        });

        tap.test('should contains the correct "argument" string', async() => {
            nonStringValues.forEach((value) => {
                tap.notMatch(makeInvalidArgumentError('', value).message, /^argument \[.*\]/);
            });
            tap.notMatch(makeInvalidArgumentError('', '').message, /^argument \[.*\]/);

            tap.match(makeInvalidArgumentError('', 'argument').message, 'argument [argument]');
            tap.match(makeInvalidArgumentError('method', 'argument').message, '"method" argument [argument]');
        });

        tap.test('should contains the correct "received" string', async() => {
            tap.match(makeInvalidArgumentError('', '', undefined).message, /Received <undefined>.$/);
            tap.match(makeInvalidArgumentError('', '', null).message, /Received <object> "null".$/);
            tap.match(makeInvalidArgumentError('', '', NaN).message, /Received <number> "NaN".$/);
            tap.match(makeInvalidArgumentError('', '', 123).message, /Received <number> "123".$/);
            tap.match(makeInvalidArgumentError('', '', '').message, /Received <string> "".$/);
            tap.match(makeInvalidArgumentError('', '', /regex/).message, /Received <object> "\/regex\/".$/);
            tap.match(makeInvalidArgumentError('', '', {}).message, /Received <object> ".+".$/);
            tap.match(makeInvalidArgumentError('', '', []).message, /Received <object> ".*".$/);
            tap.match(makeInvalidArgumentError('', '', ()=>{}).message, /Received <function> "\(\)=>{}".$/);
        });

        tap.test('should contains the correct "expectedType" string', async() => {
            const nonStringRegex = /^expected a <.*>\.$/;
            const defaultValueRegex = /^expected a <non-empty string>\./;

            nonStringValues.forEach((value) => {
                tap.notMatch(makeInvalidArgumentError('', '', '', value).message, nonStringRegex);
            });

            const defaultValues = [undefined, 'non-empty string'];
            defaultValues.forEach((value) => {
                tap.match(makeInvalidArgumentError('', '', '', value).message, defaultValueRegex);
            });
            tap.match(makeInvalidArgumentError('', '', '').message, defaultValueRegex);

            tap.match(makeInvalidArgumentError('', '', '', 'function').message, /^expected a <function>\./);
            tap.match(makeInvalidArgumentError('', '', '', 'plain object').message, /^expected a <plain object>\./);
        });
    });

    tap.test('makeKeyUnknownError', async() => {
        tap.test('should identify as the correct error type', async() => {
            const error = makeKeyUnknownError();
            tap.isa(error, KeyUnknownGraphError);
            tap.equal(error.name, 'KeyUnknownGraphError');
        });

        tap.test('should contains the correct "method" string', async() => {
            nonStringValues.forEach((value) => {
                tap.notMatch(makeKeyUnknownError(value).message, /^".*"/);
            });
            tap.notMatch(makeKeyUnknownError('').message, /^".*"/);

            tap.match(makeKeyUnknownError('method').message, /^"method"/);
        });

        tap.test('should contains the correct "keyType" string', async() => {
            nonStringValues.forEach((value) => {
                tap.match(makeKeyUnknownError('', value).message, /^key does not exists.$/);
            });
            tap.match(makeKeyUnknownError('', '').message, /^key does not exists.$/);

            tap.match(makeKeyUnknownError('', 'kind').message, /^kind/);
            tap.match(makeKeyUnknownError('method', 'kind').message, /^"method" kind/);
        });

        tap.test('should contains the correct "keyType" string', async() => {
            nonStringValues.forEach((value) => {
                tap.match(makeKeyUnknownError('', '', value).message, /^key does not exists.$/);
            });
            tap.match(makeKeyUnknownError('', '', '').message, /^key does not exists.$/);

            tap.match(makeKeyUnknownError('', '', 'key').message, /^key {key} does not exists.$/);
            tap.match(makeKeyUnknownError('method', 'kind', 'key').message, /^"method" kind key {key} does not exists.$/);
        });
    });
});
