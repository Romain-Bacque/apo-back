const ExpressError = require("../service/ExpressError");

/**
 * Function to validate the body of a request
 * @param {Joi.ObjectSchema} schema - schema to heed
 */
module.exports.validate = schema => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        console.log(error)
        if(error){
            const message = error.details.map((el) => el.message).join(",");
            res.sendStatus(400);
            throw new ExpressError(400, message);
        } else next();
    }
};
