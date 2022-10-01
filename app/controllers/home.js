const debug = require('debug')('controller');

module.exports = (req, res, next) => {
    debug(req.user);
    res.send(req.session);
}
