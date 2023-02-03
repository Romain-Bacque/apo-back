const debug = require("debug")("controller");
const { Category } = require("../models/");
const express = require("express");

const categoriesController = {
  /**
   * Method to return a list of categories
   * @param {*} _ unused parameter
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async getAllCategories(_, res, next) {
    let categories = await Category.getAll();

    if (categories) {
      categories = categories.map((category) => ({
        id: category.id,
        tag: category.tag,
      }));
      res.status(200).json({ data: categories });
    } else next();
  },
};

module.exports = categoriesController;
