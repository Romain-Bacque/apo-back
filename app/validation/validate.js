const ExpressError = require("../service/ExpressError");

module.exports.validate = schema => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        
        if(error){
            const message = error.details.map((el) => el.message).join(",");
            res.sendStatus(400);
            throw new ExpressError(400, message);
        } else {
            next();
        }
    }
};
