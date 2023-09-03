const debug = require("debug")("controller");
const { Event } = require("../models/");
const express = require("express");
const { appendFile } = require("fs");
const path = require("path");
const emailHandler = require("../service/emailHandler");

// the email for event news
async function sendEventNewsEmail(event, brewery, description, link) {
  try {
    const emails =
      event.participants?.length > 0
        ? event.participants
            .filter((participant) => participant?.email)
            .map((participant) => participant.email)
        : [];

    if (emails.length <= 0) return;

    emailHandler.init({
      service: "gmail",
      emailFrom: process.env.ADMIN_EMAIL,
      subject: `Evenement de la brasserie "${brewery.title}".`,
      template: path.join(__dirname, "../service/emailTemplate/eventNews.ejs"),
    });

    await emailHandler.sendEmail({
      name: null,
      emailTo: emails,
      content: {
        title: event?.title,
        event_start: event?.event_start,
        description,
        link,
      },
    });
  } catch (error) {
    console.error("Error sending email:", error);

    const now = new Date();
    const fileName = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()}.log`;
    // path module is used to get file extensions and join paths,
    // because it is easy to make mistakes if you’re manipulating paths as strings.
    const filePath = path.join(__dirname, `../../logs/${fileName}`);

    const errorMessage = now.getHours() + "h - " + error + "\r";
    // Creation of log file
    appendFile(filePath, errorMessage, (err) => {});
  }
}

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
      const formattedEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        event_start: event.event_start,
        participants: event.participants,
        total_participants: event.total_participants,
        brewery: event.brewery,
      }));

      res.status(200).json({ data: formattedEvents });
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
      const formattedEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        event_start: event.event_start,
        total_participants: event.total_participants,
        brewery: event.brewery,
      }));
console.log(formattedEvents)
      res.status(200).json({ data: formattedEvents });
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
      const formattedEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        event_start: event.event_start,
        participants: event.participants,
        total_participants: event.total_participants,
        brewery: event.brewery,
      }));

      res.status(200).json({ data: formattedEvents });
    } else next();
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
      const formattedUpdatedEvents = events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        event_start: event.event_start,
        participants: event.participants,
        total_participants: event.total_participants,
        brewery: event.brewery,
      }));

      res.status(200).json({ data: formattedUpdatedEvents });
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

    if (!events) return next();

    const formattedEvents = events.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      event_start: event.event_start,
      participants: event.participants,
      total_participants: event.total_participants,
      brewery: event.brewery,
    }));
    const event = formattedEvents?.length
      ? formattedEvents.find((formattedEvent) => formattedEvent.id === eventId)
      : null;

    if (!event) {
      return res.sendStatus(401);
    }

    const isDeleted = await Event.deleteEvent(eventId);
    // Website link
    const link = `${process.env.CLIENT_DOMAIN}/`;

    sendEventNewsEmail(
      event,
      event.brewery,
      "Cet événement a été malheureusement annulé, veuillez contacter la brasserie pour plus de détails.",
      link
    );

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
