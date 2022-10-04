const debug = require('debug')('controller');
const { Category } = require('../models/');

const categoriesController = {
    async getAllCategories(_, res, next) {
        let categories = await Category.getAll();
    
        if(categories) {
            categories = categories.map(category => ({ 
                id: category.id,
                tag: category.tag
            }));
            res.status(200).json({ data: categories });
        } else next();
    }
}

module.exports = categoriesController;
