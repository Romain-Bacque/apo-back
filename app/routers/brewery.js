const express = require('express');
const breweryController = require('../controllers/brewery');
const router = express.Router();

router.route('/')
    .get(breweryController.getAllBreweries)
    .post(breweryController.addBrewery);

router.route(':id')
    .put(breweryController.editBrewery)
    .delete(breweryController.deleteBrewery);

module.exports = router;
