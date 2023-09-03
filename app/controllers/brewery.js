const debug = require("debug")("controller");
const { Brewery } = require("../models/");
const { cloudinary } = require("../service/cloudinary");
const express = require("express");

function formattedBreweries(breweries) {
  return breweries?.length > 0
    ? breweries.map((brewery) => ({
        id: brewery.id,
        title: brewery.title,
        phone: brewery.phone,
        address: brewery.address,
        lat: brewery.lat,
        lon: brewery.lon,
        description: brewery.description,
        image: brewery.image,
        userId: brewery.user_id,
        categories: brewery.categories,
      }))
    : [];
}

const breweryController = {
  /**
   * Method to return a list of breweries
   * @param {*} _ unused parameter
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async getAllBreweries(_, res, next) {
    let breweries = await Brewery.getAll();

    if (breweries) {
      res.status(200).json({ data: formattedBreweries(breweries) });
    } else next();
  },
  /**
   * Method to return the owner breweries
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async getOwnerBreweries(req, res, next) {
    if (!req.user?.id || req.user.role !== "brewer") return res.sendStatus(401);

    let breweries = await Brewery.getOwnerBreweries(req.user.id);

    if (breweries) {
      res.status(200).json({ data: formattedBreweries(breweries) });
    } else next();
  },
  /**
   * Method to return the user favorites
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async getUserFavorites(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    let breweries = await Brewery.getUserFavorites(req.user.id);

    if (breweries) {
      res.status(200).json({ data: formattedBreweries(breweries) });
    } else next();
  },
  /**
   * Method to return the user favorite ids
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async getUserFavoriteIds(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    let favoriteIds = await Brewery.getUserFavoriteIds(req.user.id);

    if (favoriteIds) {
      const formattedFavoriteIds = favoriteIds.map(
        (favoriteId) => favoriteId.id
      );

      console.log(formattedFavoriteIds)

      res.status(200).json({ data: formattedFavoriteIds });
    } else next();
  },
  /**
   * Method to add a user favorite
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async addUserFavorite(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const { breweryId } = req.params;

    let isAdded = await Brewery.addUserFavorite(req.user.id, breweryId);

    if (isAdded) {
      res.sendStatus(200);
    } else next();
  },
  /**
   * Method to delete a user favorite
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async deleteUserFavorite(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const { breweryId } = req.params;

    let isDeleted = await Brewery.deleteUserFavorite(req.user.id, breweryId);

    if (isDeleted) {
      res.sendStatus(200);
    } else next();
  },
  /**
   * Method to return a brewery thanks to its id
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async getBreweryById(req, res, next) {
    const id = parseInt(req.params.id);

    let brewery = await Brewery.getBreweryById(id);

    if (brewery) {
      const formattedBrewery = {
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
        events: brewery.events,
      };

      res.status(200).json({ data: formattedBrewery });
    } else next();
  },
  /**
   * Method to return add a brewery
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async addBrewery(req, res, next) {
    if (!req.user?.id || req.user.role !== "brewer") return res.sendStatus(401);

    const image = req.file
      ? { path: req.file.path, filename: req.file.filename }
      : null;
    const categories = req.body.categories ? req.body.categories : [];

    const brewery = new Brewery({
      image,
      categories,
      user_id: req.user.id,
      ...req.body,
    });
    const updatedBreweries = await brewery.addBrewery();

    if (updatedBreweries?.length) {
      res.status(200).json({ data: updatedBreweries });
    } else next();
  },
  /**
   * Method to edit a brewery
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async editBrewery(req, res, next) {
    const id = parseInt(req.params.id);
    const image = req.file
      ? { path: req.file.path, filename: req.file.filename }
      : null;
    const categories = req.body.categories ? req.body.categories : [];

    const brewery = new Brewery({
      id,
      image,
      categories,
      user_id: req.user.id,
      ...req.body,
    });
    const updatedBreweries = await brewery.updateBrewery();

    if (updatedBreweries?.length) {
      res.status(200).json({ data: updatedBreweries });
    } else next();
  },
  /**
   * Method to delete a cocktail
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async deleteBrewery(req, res, next) {
    const id = parseInt(req.params.id);
    let brewery = await Brewery.getBreweryById(id);

    if (brewery) {
      brewery = brewery.map((brewery) => ({
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
        events: brewery.events,
      }));
    } else next();

    if (brewery[0].image?.filename) {
      const { result } = await cloudinary.uploader.destroy(
        brewery[0].image.filename
      );

      if (!result) return next();
    }

    const updatedBreweries = await Brewery.deleteBrewery(id);

    if (updatedBreweries?.length) {
      res.status(200).json({ data: updatedBreweries });
    } else next();
  },
};

module.exports = breweryController;
