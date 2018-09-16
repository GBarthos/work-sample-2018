/**
 * Expose a common interface for logging out things.
 * For now it's only the Console global.
 */
const logger = console;

/**
 * Log the given message, then immediately exit the process.
 *
 * @param {String} message error message to log out
 * @param {Number} exitCode code to end the process with
 */
function handleError(message, exitCode = 1) {
    const msg = (!message || typeof message !== 'string') ? 'an error occured!' : message;
    logger.error(`[fatal] ${msg}\n`);
    process.exit(exitCode);
}

module.exports = {
    handleError,
    logger
};
