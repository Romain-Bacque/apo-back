/**
 * Catch system error(s) occuring in an async controller method
 * @param {Object} controller - the controller to handle
 * @returns {Promise<void>}
 */
module.exports = (controller) => {
  return async (req, res, next) => {
    try {
      await controller(req, res, next);
    } catch (err) {
      next(err); // Go to the next middleware that manage errors
    }
  };
};
