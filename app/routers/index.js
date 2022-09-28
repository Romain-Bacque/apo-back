const express = require('express');
const userRoutes = require('./user');
const breweryRoutes = require('./brewery');
const categoryRoutes = require('./category');
const eventRoutes = require('./event');
const router = express.Router();
// const errorHandler = require('../service/errorHandler');

router.get('/', (req, res, next) => require('../controllers/home')(req, res, next));
router.use('/user', userRoutes);
router.use('/brewery', breweryRoutes);
router.use('/category', categoryRoutes);
router.use('/event', eventRoutes);
router.use('*', (req, res) => res.sendStatus(404));

// // gestion de la 404
//  router.use(errorHandler.notFound);

// // gestion des erreurs
//  router.use(errorHandler.manage);

module.exports = router;
