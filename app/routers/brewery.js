const express = require('express');
const breweryController = require('../controllers/brewery');
const router = express.Router();
const catchAsync = require('../service/catchAsync');
const { checkAuthenticated } = require('../middlewares/middleware');
const { brewerySchema } = require('../validation/schemas');
const { validate } = require('../validation/validate');

router.route('/')
    .get(catchAsync(breweryController.getAllBreweries))
    .post(checkAuthenticated, validate(brewerySchema), catchAsync(breweryController.addBrewery));

router.route('/:id([0-9]+)')
    .get(catchAsync(breweryController.getBreweryById))
    .put(checkAuthenticated, validate(brewerySchema), catchAsync(breweryController.editBrewery))
    .delete(checkAuthenticated, breweryController.deleteBrewery);

router.get('/:id([0-9]+)/user/:userId([0-9]+)', checkAuthenticated, catchAsync(breweryController.getBreweriesByUser));

module.exports = router;
