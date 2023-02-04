const { Brewery } = require("../models");
const express = require("express");

/**
 * Middleware to check if user is currently authenticated
 * @param {express.Request} req Express request object
 * @param {express.Response} res Express response object
 * @param {express.NextFunction} next Express response function
 */
module.exports.checkAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    // isAuthenticated() is a Passport.js method that returns 'true' if the user is authenticated
    return next();
  }
  res.status(401).json({ message: "User not authenticated" });
};

/**
 * Middleware to check if user is currently not authenticated
 * @param {express.Request} req Express request object
 * @param {express.Response} res Express response object
 * @param {express.NextFunction} next Express response function
 */
module.exports.checkNotAuthenticated = async (req, res, next) => {
  if (req.isAuthenticated()) {
    // isAuthenticated() is a Passport.js method that returns 'true' if the user is authenticated
    return res.status(409).json({ message: "User is already connected" });
  }
  next();
};

/**
 * Middleware to check if user is actually the owner
 * @param {express.Request} req Express request object
 * @param {express.Response} res Express response object
 * @param {express.NextFunction} next Express response function
 */
module.exports.isOwner = async (req, res, next) => {
  if (!req.user?.id || req.user.role !== "brewer") return res.sendStatus(401);

  const id = parseInt(req.params.id);
  const brewery = await Brewery.getBreweryById(id);

  if (!brewery?.user_id === req.user.id) {
    return res.sendStatus(401);
  }
  next();
};
