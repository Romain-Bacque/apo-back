const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../service/catchAsync');
const errorHandler = require('../service/errorHandler');

router.use('/', (req, res, next) => require('../controllers/home')(req, res, next));
router.post('/login', passport.authenticate('local'), catchAsync(userController.login));
router.post('/register', userController.register);
router.post('/logout', userController.logout);
router.put('/profile/:id', userController.editUser);
router.get('/delete/:id', userController.deleteAccount);
router.use('*', (req, res) => res.sendStatus(404));

// // gestion de la 404
//  router.use(errorHandler.notFound);

// // gestion des erreurs
//  router.use(errorHandler.manage);

module.exports = router;
