const express = require('express');
const userRoutes = require('./user');
const breweryRoutes = require('./brewery');
const categoryRoutes = require('./category');
const eventRoutes = require('./event');
const router = express.Router();

<<<<<<< HEAD
router.post('/', (req, res, next) => require('../controllers/home')(req, res, next));
=======
router.get('/', (req, res, next) => require('../controllers/home')(req, res, next));
>>>>>>> 1ec7f4ef3c8d726dede4428ae40074a8bb67d3c2
router.use('/user', userRoutes);
router.use('/brewery', breweryRoutes);
router.use('/category', categoryRoutes);
router.use('/event', eventRoutes);
router.use('*', (req, res) => res.sendStatus(404));

module.exports = router;
