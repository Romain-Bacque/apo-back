const express = require('express');
const categoriesController = require('../controllers/category');
const router = express.Router();

router.get('/', categoriesController.getAllCategories);
// router.get('/:id([0-9]+)', categoriesController.getBreweriesByCategorie);

module.exports = router;
