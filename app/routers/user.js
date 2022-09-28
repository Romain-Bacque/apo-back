const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../service/catchAsync');
const { loginSchema, registerSchema } = require('../validation/schemas');
const { validate } = require('../validation/validate');

router.post('/login', validate(loginSchema), passport.authenticate('local'), catchAsync(userController.login));
router.post('/register', validate(registerSchema), userController.register);
router.post('/logout', userController.logout);
router.put('/profile/:id', userController.editUser);
router.get('/delete/:id', userController.deleteAccount);

module.exports = router;
