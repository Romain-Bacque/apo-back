
class ExpressError extends Error {
    message;
    statusCode;
    /**
     * Create custom error
     * @param {String} message - message about error
     * @param {Number} statusCode - http status code
     */
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
};

module.exports = ExpressError;