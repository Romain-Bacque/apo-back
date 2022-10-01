const express = require('express');
const userRoutes = require('./user');
const breweryRoutes = require('./brewery');
const categoryRoutes = require('./category');
const eventRoutes = require('./event');
const errorHandler = require('../service/errorHandler');
const router = express.Router();

router.use('/', (req, res, next) => require('../controllers/home')(req, res, next));
router.use('/user', userRoutes);
router.use('/brewery', breweryRoutes);
router.use('/category', categoryRoutes);
router.use('/event', eventRoutes);

// 404 management
router.use(errorHandler.notFound);

// Errors management
router.use(errorHandler.manage);

module.exports = router;
