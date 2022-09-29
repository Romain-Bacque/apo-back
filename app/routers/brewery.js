const express = require('express');
const breweryController = require('../controllers/brewery');
const router = express.Router();
const { checkAuthenticated } = require('../middlewares/middleware');
const { brewerySchema } = require('../validation/schemas');
const { validate } = require('../validation/validate');

router.route('/')
    .get(breweryController.getAllBreweries)
    // .post(checkAuthenticated, validate(brewerySchema), breweryController.addBrewery);

router.route('/:id')
    .put(checkAuthenticated, validate(brewerySchema), breweryController.editBrewery)
    // .delete(checkAuthenticated, breweryController.deleteBrewery);

module.exports = router;
