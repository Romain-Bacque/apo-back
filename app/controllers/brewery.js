const debug = require('debug')('controller');
const { assert } = require('joi');
const { Brewery } = require('../models/');

const breweryController = {
    async getAllBreweries(req, res, next) {
        const breweries = await Brewery.getAll();

        if(breweries) {
            res.status(200).json({ data: breweries });
        } else {
            next();
        }
    },
    async addBrewery(req, res) {
        const { title, phone, description, image, user_id, categories } = req.body;
    
        const brewery = new Brewery({ title, phone, description, image, user_id, categories });
        const addedBrewery = await brewery.addBrewery();

        if(addedBrewery) {
            res.status(200).json({ data: addedBrewery });
        } else {
            next();
        }
    },
    async editBrewery(req, res) {
        const id = parseInt(req.params.id);
        const { title, phone, description, image, user_id, categories } = req.body;

        assert.ok(!isNaN(id), 'id must be a number');

        const brewery = new Brewery({ title, phone, description, image, user_id, categories });
        const updatedBrewery = await brewery.updateBrewery(id);

        if(updatedBrewery) {
            res.status(200).json({ data: updatedBrewery });
        } else {
            next();
        }
    },
    async deleteBrewery(req, res) {
        const id = parseInt(req.params.id);

        assert.ok(!isNaN(id), 'id must be a number');

        const deletedBrewery = await Brewery.deleteBrewery(id);

        if(deletedBrewery) {
            res.sendStatus(200);
        } else {
            next();
        }
    }
}

module.exports = breweryController;
