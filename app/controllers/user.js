const debug = require('debug')('controller');
const { User } = require('../models');

const userController = {    
    login(req, res, next) {
        if(!req.user) next();
        res.status(200).json({ message: 'connection success' })
    },
    async register(req, res) {
        const { name, email, password, role } = req.body;
        const hashedPassword = await User.hashPassword(password);
        const newUser = new User({ name, email, password: hashedPassword, role });
        const result = await newUser.register();

        if (result) {
            debug(result);
            res.status(200).json({ message: 'user successfully registered' });  
        } else res.status(200).json({ message: 'user already exists' });  
    },
    logout(req, res, next) {
        req.logout(err => {
            if (err) return next(err);
            res.status(200).json({ message: 'deconnection success' })
        });
    },
    async editUser(req, res) {

    },
    async deleteAccount(req, res) {
    
    },
}

module.exports = userController;
