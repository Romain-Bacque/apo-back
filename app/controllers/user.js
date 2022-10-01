const debug = require('debug')('controller');
const { User } = require('../models');

const userController = {    
    login(_, res) {
        res.sendStatus(200);
    },
    async register(req, res) {
        const { name, email, password, role } = req.body;    
                
        if(await User.getUserByEmail(email)) {
            return res.status(403).json({ message: 'user already exists' });
        }
        
        const hashedPassword = await User.hashPassword(password);
        const user = new User({ name, email, password: hashedPassword, role });
        
        const registeredUser = await user.register();

        if (registeredUser) {
            debug(registeredUser);
            res.sendStatus(200);
        } else res.sendStatus(500);
    },
    logout(req, res, next) {
        req.logout(err => {
            if (err) return next(err);
            res.sendStatus(200);
        });
    },
    async getUser(req, res) {

    },
    async editUser(req, res) {

    },
    async deleteAccount(req, res) {
    
    },
}

module.exports = userController;
