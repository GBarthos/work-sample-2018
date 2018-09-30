/**
 * Convert time string into a number of minutes.
 *
 * @param {String} str - a string representing time of the day
 * @returns number of minutes represented by the time string
 */
function timeToMinutes(str) {
    if (!str || typeof str !== 'string') {
        throw new TypeError('"timeToMinutes" takes a non empty string as argument [str]');
    }

    const [hourString, minuteString] = str.split(':');
    const hours = parseInt(hourString, 10);
    const minutes = parseInt(minuteString, 10);

    // make sure that those variables are really numbers
    if (!isFinite(hours) || !isFinite(minutes)) {
        throw new Error(`Impossible to parse "${str}" into minutes`);
    }

    return 60 * hours + minutes;
}

/**
 * Given the amout of minutes between the two given time string.
 *
 * @param {String} time1 - a string representing time of the day
 * @param {String} time2 - a string representing time of the day
 * @returns number of minutes between time1 and time2
 */
function timeToDuration(time1, time2) {
    if (
        !time1 || typeof time1 !== 'string' ||
        !time2 || typeof time2 !== 'string'
    ) {
        throw new TypeError('"timeToDuration" takes non empty strings as arguments');
    }

    const minutes1 = timeToMinutes(time1);
    const minutes2 = timeToMinutes(time2);

    // minutes1 should be less than minutes2
    // otherwise it means that time2 is in the next day
    const res = minutes1 > minutes2 ?
        (minutesToMidnight(minutes1) + minutes2) :
        (minutes2 - minutes1);

    return res;
}

/**
 * Add an amount of minutes to a time string,
 * then reconvert it to a time string.
 *
 * @param {String} str - a string representing time of the day
 * @param {Number} nbr - an amount of minutes to add
 * @returns a time string
 */
function addMinutesToTime(str, nbr) {
    if (!str || typeof str !== 'string') {
        throw new TypeError('"addMinutesToTime" takes a non empty string as argument [str]');
    }
    if (!isFinite(nbr) || typeof nbr !== 'number') {
        throw new TypeError('"addMinutesToTime" takes a finite number as argument [nbr]');
    }

    const minutes = (timeToMinutes(str) + nbr) % 1440;
    return minutesToTime(minutes);
}

/**
 * Add a leading zero to a string representing a number.
 *
 * @param {Number} nbr - a finite number
 * @returns a string representing a number
 */
function addLeadingZero(nbr) {
    if (!isFinite(nbr) || typeof nbr !== 'number') {
        throw new TypeError('"addLeadingZero" takes a finite number as argument [nbr]');
    }

    return nbr < 10 ? '0' + nbr : nbr;
}

/**
 * Convert an amount of minutes into a time string.
 *
 * @param {Number} nbr - an amount of minutes
 * @returns a string representing time of the day
 */
function minutesToTime(nbr) {
    if (!isFinite(nbr) || typeof nbr !== 'number') {
        throw new TypeError('"timeToMinutes" takes a finite number as argument [nbr]');
    }

    const days = nbr % 1440;
    const minutes = days % 60;
    const hours = Math.floor(days / 60);

    return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}`;
}

/**
 * Provide the amount of minutes from the current amount
 * representing a time, to the current amount representing
 * midnight.
 *
 * @param {Number} nbr - an amount of minutes
 * @returns an amount of minutes
 */
function minutesToMidnight(nbr) {
    if (!isFinite(nbr) || typeof nbr !== 'number') {
        throw new TypeError('"timeToMinutes" takes a finite number as argument [nbr]');
    }

    return 1440 - nbr;
}

/**
 * Pretty print a duration into a human-readdable string.
 *
 * @param {Number} duration - an amount of minutes representing a duration
 * @returns a string representing a duration
 */
function humanReadableDuration(duration) {
    if (!isFinite(duration) || typeof duration !== 'number') {
        throw new TypeError('"humanReadableDuration" takes a finite number as argument [duration]');
    }

    const minutes = duration % 60;
    let remainder = Math.floor(duration / 60);
    const hours = remainder % 24;
    const days = Math.floor(remainder / 24);

    return `${days ? days+'d ' : ''}${hours ? hours+'h ' : ''}${minutes ? minutes+'m' : ''}`;
}

module.exports = {
    addLeadingZero,
    addMinutesToTime,
    humanReadableDuration,
    minutesToMidnight,
    minutesToTime,
    timeToDuration,
    timeToMinutes
}
