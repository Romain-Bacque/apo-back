const debug = require('debug')('controller');
const { Category } = require('../models/');

const categoriesController = {
    async getAllCategories(req, res) {
        const categories = await Category.getAll();

        if(categories) {
            res.status(200).json({ data: categories });
        } else {
            next();
        }
    }
}

module.exports = categoriesController;
