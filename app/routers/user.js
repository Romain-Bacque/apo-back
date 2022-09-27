const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const passport = require('passport');

router.post('/login', userController.login, passport.authenticate('local'));
router.post('/register', userController.register);
router.get('/logout', userController.logout);
router.put('/profile/:id', userController.editUser);
router.get('/delete/:id', userController.deleteAccount);

module.exports = router;
