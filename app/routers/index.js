const express = require('express');
const authRoutes = require('./auth');
const breweryRoutes = require('./brewery');
const categoryRoutes = require('./category');
const eventRoutes = require('./event');
const router = express.Router();


router.use('/', reqLogger, (req, res, next) => require('../controllers/home')(req, res, next));
router.use('/auth', authRoutes);
router.use('/brewery', breweryRoutes);
router.use('/category', categoryRoutes);
router.use('/event', eventRoutes);

module.exports = router;
