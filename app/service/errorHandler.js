const { appendFile } = require("fs");
const ExpressError = require('./ExpressError')
const path = require("path");

const errorHandler = {

    notFound() {
        throw new ExpressError("Not Found", 404);
    },    
    manage(err, _, res, __) {
        const now = new Date();
        const fileName = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}.log`;
        const filePath = path.join(__dirname,`../../log/${fileName}`);

        const errorMessage = now.getHours() + "h - " + err + "\r";
        appendFile(filePath,errorMessage,(error)=>{

        });
        
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