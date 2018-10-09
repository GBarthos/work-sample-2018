const tap = require('tap');
const {
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
} = require('./utils.js');

tap.test('src/tools/utils.js', async() => {
    const noop = () => {};
    const date = new Date();
    const map = new Map();
    const regex = /regex/;

    const nonBooleanValues = [0, 123, NaN, undefined, null, [], [1], {}, {a:1}, '', 'asdf', noop, regex, date, map];
    const nonFunctionValues = [true, false, 0, 123, NaN, undefined, null, [], [1], {}, {a:1}, '', 'asdf', regex, date, map];
    const nonNumberValues = [true, false, undefined, null, [], [1], {}, {a:1}, '', 'asdf', noop, regex, date, map];
    const nonPlainObjectValues = [true, false, 0, 123, NaN, undefined, null, [], [1], '', 'asdf', noop, regex, date, map];
    const nonStringValues = [true, false, 0, 123, NaN, undefined, null, [], [1], {}, {a:1}, noop, regex, date, map];
    const nonUndefinedValues = [true, false, 0, 123, NaN, null, [], [1], {}, {a:1}, '', 'asdf', noop, regex, date, map];
    // const values = [true, false, 0, 123, NaN, undefined, null, [], [1], {}, {a:1}, '', 'asdf', noop, regex, date, map];

    tap.todo('handleError', async() => {
        // TODO - how to mock process and stub logger ?
    });

    tap.test('isBoolean', async() => {
        tap.test('should return "false" when given non-boolean values', async() => {
            nonBooleanValues.forEach((value) => {
                tap.equal(isBoolean(value), false);
            });
        });

        tap.test('should return "true" when given boolean values', async() => {
            tap.equal(isBoolean(true), true);
            tap.equal(isBoolean(false), true);
        });
    });

    tap.test('isFunction', async() => {
        tap.test('should return "false" when given non-function values', async() => {
            nonFunctionValues.forEach((value) => {
                tap.equal(isFunction(value), false);
            });
        });

        tap.test('should return "true" when given function values', async() => {
            tap.equal(isFunction(noop), true);
            tap.equal(isFunction(Date), true);
            tap.equal(isFunction(Map), true);
        });
    });

    tap.test('isNumber', async() => {
        tap.test('should return "false" when given non-number values', async() => {
            nonNumberValues.forEach((value) => {
                tap.equal(isNumber(value), false);
            });
            tap.equal(isNumber(NaN), false);
        });

        tap.test('should return "true" when given number values', async() => {
            tap.equal(isNumber(0), true);
            tap.equal(isNumber(123), true);
        });
    });

    tap.test('isPlainObject', async() => {
        tap.test('should return "false" when given non-plain-object values', async() => {
            nonPlainObjectValues.forEach((value) => {
                tap.equal(isPlainObject(value), false);
            });
        });

        tap.test('should return "true" when given plain-object values', async() => {
            tap.equal(isPlainObject({a:1}), true);
            tap.equal(isPlainObject({}), true);
        });
    });

    tap.test('isString', async() => {
        tap.test('should return "false" when given non-string values', async() => {
            nonStringValues.forEach((value) => {
                tap.equal(isString(value), false);
            });
        });

        tap.test('should return "true" when given string values', async() => {
            tap.equal(isString('asdf'), true);
            tap.equal(isString(''), true);
        });
    });

    tap.test('isUndefined', async() => {
        tap.test('should return "false" when given non-undefined values', async() => {
            nonUndefinedValues.forEach((value) => {
                tap.equal(isUndefined(value), false);
            });
        });

        tap.test('should return "true" when given undefined values', async() => {
            tap.equal(isUndefined(undefined), true);
            tap.equal(isUndefined(void 0), true);
        });
    });

    tap.test('logger', async() => {
        tap.match(logger, { error: Function, info: Function, log: Function, warn: Function });
    });

    tap.test('setNonEnumerableProperty', async() => {
        const target = {};
        setNonEnumerableProperty(target, 'test', 'toto');

        // we can not enumerate the property
        tap.match(Object.keys(target), []);
        tap.equal(target.test, 'toto');

        // we can not set the property
        target.test = 'tata';
        tap.equal(target.test, 'toto');

        // we can delete the property
        const deleted = delete target.test;
        tap.equal(deleted, true);

        // we can not change the description of the property
        tap.doesNotThrow(() => {
            Object.defineProperty(target, 'test', { get() { return 1; } });
        });
    });

    tap.test('setPrivateProperty', async() => {
        const target = {};
        setPrivateProperty(target, 'test', 'toto');

        // we can not enumerate the property
        tap.match(Object.keys(target), []);
        tap.equal(target.test, 'toto');

        // we can not set the property
        target.test = 'tata';
        tap.equal(target.test, 'tata');

        // we can not delete the property
        const deleted = delete target.test;
        tap.equal(deleted, false);

        // we can not change the description of the property
        tap.throws(() => {
            Object.defineProperty(target, 'test', { get() { return 1; } });
        });
    });
});
