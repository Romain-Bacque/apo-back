const ExpressError = require("../service/ExpressError");

module.exports.validate = schema => {
        return (req, _, next)=>{
            const { error } = schema.validate(req.body);

            if(error){
                const msg = error.details.map((el) => el.message).join(",");
                throw new ExpressError(msg, 400);
            }
            else{
                next();
            }
        }
    };
