const debug = require('debug')('controller');
const { Brewery } = require('../models/');

const breweryController = {
    async getAllBreweries(_, res, next) {
        let breweries = await Brewery.getAll();

        if(breweries) {
            breweries = breweries.map(brewery => ({ 
                id: brewery.id,
                title: brewery.title,
                phone: brewery.phone,
                description: brewery.description,
                image: brewery.image,
                user_id: brewery.user_id,
                categories: brewery.categories
            }));
            res.status(200).json({ data: breweries });
        } else next();
    },
    async getBreweriesByUser(req, res, next) {
        const id = parseInt(req.params.userId);

        let breweries = await Brewery.getBreweriesByUser(id);

        if(breweries) {
            breweries = breweries.map(brewery => ({ 
                id: brewery.id,
                title: brewery.title,
                phone: brewery.phone,
                description: brewery.description,
                image: brewery.image,
                user_id: brewery.user_id,
                categories: brewery.categories
            }));
            res.status(200).json({ data: breweries });
        } else next();
    },
    async getBreweryById(req, res, next) {
        const id = parseInt(req.params.id);
        
        let brewery = await Brewery.getBreweryById(id);

        if(brewery) {
            brewery = brewery.map(brewery => ({ 
                id: brewery.id,
                title: brewery.title,
                phone: brewery.phone,
                description: brewery.description,
                image: brewery.image,
                user_id: brewery.user_id,
                categories: brewery.categories,
                events: brewery.events
            }));
            res.status(200).json({ data: brewery });
        } else next();
    },
    async addBrewery(req, res, next) { 
        const brewery = new Brewery(req.body);
        const breweries = await brewery.addBrewery();

        if(breweries) {
            res.status(200).json({ data: breweries });
        } else next();
    },
    async editBrewery(req, res, next) {
        const id = parseInt(req.params.id);

        const brewery = new Brewery(req.body);
        const updatedBrewery = await brewery.updateBrewery(id);

        if(updatedBrewery) {
            res.status(200).json({ data: updatedBrewery });
        } else next();        
    },
    async deleteBrewery(req, res, next) {
        const id = parseInt(req.params.id);

        const isDeleted = await Brewery.deleteBrewery(id);

        if(isDeleted) {
            res.sendStatus(200);
        } else next();
    }
}

module.exports = breweryController;
