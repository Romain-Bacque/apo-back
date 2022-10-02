const ExpressError = require('./ExpressError');
const debug = require('debug')('errorHandler');

const errorHandler = {
    /**
     * Method to manage 404 error
     */
    notFound() {
        throw new ExpressError("Page Not Found", 404);
    }, 
    /**
     * Method to manage error
     * @param {Error} err error reported by the system
     * @param {*} _ unused parameter
     * @param {Object} res Express response
     * @param {*} __ unused parameter
     */
    manage(err, _, res, __) {  
        debug(err);
        switch (err.statusCode) {
            case 404:
                res.status(404).json({ error: "Not found" });
                break;
            default:
                res.status(500).json({ error: "Internal error" });
                break;
        }
    }
};

module.exports = errorHandler;