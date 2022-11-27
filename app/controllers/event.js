const debug = require("debug")("controller");
const { Event, Brewery } = require("../models/");

const eventController = {
  async getEventsByOwner(req, res, next) {
    if (!req.user?.id || req.user.role !== "brewer") return res.sendStatus(401);

    const ownerId = +req.user.id;
    const events = await Event.getEventsByOwner(ownerId);

    if (events) {
      res.status(200).json({ data: events });
    } else next();
  },
  async getEventsByParticipant(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const participantId = +req.user.id;
    const events = await Event.getEventsByParticipant(participantId);

    if (events) {
      res.status(200).json({ data: events });
    } else next();
  },
  async getEventsByBrewery(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const id = +req.params.id;

    const events = await Event.getEventsByBrewery(id);

    if (events) {
      res.status(200).json({ data: events });
    }
    next();
  },
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
