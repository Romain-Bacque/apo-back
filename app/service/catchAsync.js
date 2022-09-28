const ExpressError = require("./ExpressError");

module.exports = catchAsync = controller => {
    return async (req, res, next) => {
        try {
            await controller(req, res);
        } catch (err) {
            next(err);
        }
    }
};
