const debug = require('debug')('controller');
const { Brewery } = require('../models/');
const { cloudinary } = require("../service/cloudinary");

const breweryController = {
    async getAllBreweries(_, res, next) {
        let breweries = await Brewery.getAll();

        if(breweries) {
            breweries = breweries.map(brewery => ({ 
                id: brewery.id,
                title: brewery.title,
                phone: brewery.phone,
                address: brewery.address,
                lat: brewery.lat,
                lon: brewery.lon,
                description: brewery.description,
                image: brewery.image,
                user_id: brewery.user_id,
                categories: brewery.categories
            }));
            res.status(200).json({ data: breweries });
        } else next();
    },
    async getOwnerBreweries(req, res, next) {
        if(!req.user?.id || req.user.role !== "brewer") return res.sendStatus(401);

        let breweries = await Brewery.getOwnerBreweries(req.user.id);

        if(breweries) {
            breweries = breweries.map(brewery => ({ 
                id: brewery.id,
                title: brewery.title,
                phone: brewery.phone,
                address: brewery.address,
                lat: brewery.lat,
                lon: brewery.lon,
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
                address: brewery.address,
                lat: brewery.lat,
                lon: brewery.lon,
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
        if(!req.user?.id || req.user.role !== "user") return res.sendStatus(401);
        
        const brewery = new Brewery({...req.body, user_id: req.user.id});
        const breweries = await brewery.addBrewery();

        if(breweries) {
            res.status(200).json({ data: breweries });
        } else next();
    },
    async editBrewery(req, res, next) {
        const id = parseInt(req.params.id);

        const brewery = new Brewery({ id, ...req.body, user_id: req.user.id });
        const updatedBrewery = await brewery.updateBrewery();

        if(updatedBrewery) {
            res.status(200).json({ data: updatedBrewery });
        } else next();        
    },
    async deleteBrewery(req, res, next) {
        const id = parseInt(req.params.id);

        let brewery = await Brewery.getBreweryById(id);

        await cloudinary.uploader.destroy(brewery[0].image);

        const isDeleted = await Brewery.deleteBrewery(id);

        if(isDeleted) {
            res.sendStatus(200);
        } else next();
    }
}

module.exports = breweryController;
