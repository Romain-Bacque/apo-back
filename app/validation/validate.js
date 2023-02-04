const debug = require("debug")("validate");
const ExpressError = require("../service/ExpressError");
const express = require("express");
const joi = require("joi");

/**
 * function that validate schema
 * @param {joi.ObjectSchema} schema The joi object schema
 * @returns {((req: express.Request, _: any, next: express.NextFunction) => void)}
 */
module.exports.validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const message = error.details.map((el) => el.message).join(",");

      debug(error);
      res.sendStatus(400);
      throw new ExpressError(400, message);
    } else next();
  };
};
