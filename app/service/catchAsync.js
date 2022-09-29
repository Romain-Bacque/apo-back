module.exports = controller => {
    return async (req, res, next) => {
        try {
            await controller(req, res);
        } catch (err) {
            next(err); // Got to next middleware that manage error (after '404' middleware)
        }
    }
};
