const debug = require('debug')('controller');

module.exports = (req, res, next) => {
    if(!req.user) return res.sendStatus(500);

    const { id, name, email, password, role } = req.user;

    res.status(200).json({ user: { id, name, email, password, role } });
}
