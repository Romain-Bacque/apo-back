module.exports.validate = schema => {
        return (req, res, next)=>{
            const { error } = schema.validate(req.body);
            
            if(error){
                const message = error.details.map((el) => el.message).join(",");
                res.status(400).json({ message })
            }
            else{
                next();
            }
        }
    };
