const debug = require("debug")("errorHandler");
const ExpressError = require("./ExpressError");
const path = require("path");
const { appendFile } = require("fs");

const errorHandler = {
  /**
   * Method to manage 404 error
   */
  notFound() {
    throw new ExpressError("Page Not Found", 404);
  },
  /**
   * @param {Error} err error reported by the system
   * @param {*} _ unused parameter
   * @param {express.Response} res Express Response
   * @param {*} __ unused parameter
   * @returns {} 404 - not found
   * @returns {} 500 - internal server error
   */
  manage(err, _, res, __) {
    const now = new Date();
    const fileName = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}.log`;
    // path module is used to get file extensions and join paths,
    // because it is easy to make mistakes if you’re manipulating paths as strings.
    const filePath = path.join(__dirname, `../../logs/${fileName}`);

    const errorMessage = now.getHours() + "h - " + err + "\r";
    // Creation of log file
    appendFile(filePath, errorMessage, (err) => {});

    switch (err.statusCode) {
      case 404:
        res.sendStatus(404);
        break;
      default:
        res.sendStatus(500);
        break;
    }
  },
};

module.exports = errorHandler;
