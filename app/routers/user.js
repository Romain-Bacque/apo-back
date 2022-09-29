const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../service/catchAsync');
const { loginSchema, registerSchema } = require('../validation/schemas');
const { validate } = require('../validation/validate');

router.post('/login', validate(loginSchema), passport.authenticate('local'), userController.login);
router.post('/register', validate(registerSchema), catchAsync(userController.register));
router.post('/logout', userController.logout);
router.get('/profile/:id', userController.getUser);
router.put('/profile/:id', userController.editUser);
router.delete('/delete/:id', userController.deleteAccount);

module.exports = router;
