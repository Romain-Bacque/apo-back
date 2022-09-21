const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.put('/profile/:id', authController.editUser);
router.get('/delete/:id', authController.deleteAccount);

module.exports = router;
