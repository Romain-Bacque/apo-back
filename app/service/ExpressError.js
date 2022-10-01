
class ExpressError extends Error {
    message;
    statusCode;
    
    constructor(message, statusCode) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
};

module.exports = ExpressError;