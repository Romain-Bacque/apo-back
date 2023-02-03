const debug = require("debug")("controller");
const { Brewery } = require("../models/");
const { cloudinary } = require("../service/cloudinary");
const express = require("express");

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
      breweries = breweries.map((brewery) => ({
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
      }));
      res.status(200).json({ data: breweries });
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
      breweries = breweries.map((brewery) => ({
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
      }));
      res.status(200).json({ data: breweries });
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

      res.status(200).json({ data: brewery });
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
