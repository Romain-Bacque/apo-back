const debug = require("debug")("controller");
const { Event } = require("../models/");
const express = require("express");

const eventController = {
  /**
   * Method to return owner's events
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async getEventsByOwner(req, res, next) {
    if (!req.user?.id || req.user.role !== "brewer") return res.sendStatus(401);

    const ownerId = +req.user.id;
    const events = await Event.getEventsByOwner(ownerId);

    if (events) {
      res.status(200).json({ data: events });
    } else next();
  },
  /**
   * Method to participant's events
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async getEventsByParticipant(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const participantId = +req.user.id;
    const events = await Event.getEventsByParticipant(participantId);

    if (events) {
      res.status(200).json({ data: events });
    } else next();
  },
  /**
   * Method to brewery's events
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async getEventsByBrewery(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const id = +req.params.id;

    const events = await Event.getEventsByBrewery(id);

    if (events) {
      res.status(200).json({ data: events });
    }
    next();
  },
  /**
   * Method to add an event
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async addEvent(req, res, next) {
    if (!req.user?.id || !req.user.role === "brewer")
      return res.sendStatus(401);

    const breweryId = +req.params.id;
    const ownerId = +req.user.id;
    const event = new Event({ ...req.body, breweryId, ownerId });
    const updatedEvents = await event.addEvent();

    if (updatedEvents && updatedEvents.length) {
      res.status(200).json({ data: updatedEvents });
    } else next();
  },
  /**
   * Method to delete an event
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async deleteEvent(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const eventId = +req.params.id;
    const events = await Event.getEventsByOwner(req.user.id);

    if (!events?.length || !events.find((event) => event.id === eventId)) {
      return res.sendStatus(401);
    }

    const isDeleted = await Event.deleteEvent(eventId);

    if (isDeleted) {
      res.sendStatus(200);
    } else next();
  },
  /**
   * Method to set a participant
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async setParticipant(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const participantId = +req.user.id;
    const eventId = +req.params.id;
    const events = await Event.getEventsByOwner(req.user.id);

    if (events?.length && events.find((event) => event.id === eventId)) {
      return res.sendStatus(409);
    }

    const result = await Event.setParticipant(participantId, eventId);

    if (result) {
      res.status(200).json({ data: result.message });
    } else next();
  },
  /**
   * Method to delete a participant
   * @param {express.Request} req Express request object
   * @param {express.Response} res Express response object
   * @param {express.NextFunction} next Express response function
   */
  async deleteParticipant(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const participantId = +req.user.id;
    const eventId = +req.params.id;
    const isDeleted = await Event.deleteParticipant(participantId, eventId);

    if (isDeleted) {
      res.sendStatus(200);
    } else next();
  },
};

module.exports = eventController;
