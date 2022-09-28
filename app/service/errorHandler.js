const { appendFile } = require("fs");
const ExpressError = require('./ExpressError')
const path = require("path");

const errorHandler = {
    // Méthode de déclenchement d'une erreur si erreur 404
    notFound(_, __, next) {
        next(new ExpressError("Page Not Found", 404));
    },

    // Methode de gestion des erreurs
    manage(err, _, res, __) {        
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