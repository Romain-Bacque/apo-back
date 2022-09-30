module.exports = (req, res, next) => {
    console.log(req.user);
    res.send(req.session);
}
