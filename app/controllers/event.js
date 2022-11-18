const debug = require("debug")("controller");
const { Event, Brewery } = require("../models/");

const eventController = {
  async getEventsByParticipant(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const events = await Event.getEventsByParticipant(req.user.id);

    if (events) {
      res.status(200).json({ data: events });
    } else next();
  },
  async getEventsByBrewery(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const id = parseInt(req.params.id);

    const events = await Event.getEventsByBrewery(id);

    if (events) {
      res.status(200).json({ data: events });
    }
    next();
  },
  async addEvent(req, res, next) {
    if (!req.user?.id || !req.user.role === "brewer")
      return res.sendStatus(401);

    const event = new Event(req.body);
    const isAdded = await event.addEvent();

    if (isAdded) {
      res.status(200);
    }
    next();
  },
  async deleteEvent(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const id = parseInt(req.params.id);
    const breweries = await Brewery.getOwnerBreweries(req.user.id);

    if (
      !breweries ||
      !breweries.find((brewery) => brewery.id === req.body.breweryId)
    ) {
      return res.sendStatus(401);
    }

    const isDeleted = await Event.deleteEvent(id);

    if (isDeleted) {
      res.status(200);
    }
    next();
  },
  async setParticipant(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const participantId = parseInt(req.user.id);
    const eventId = parseInt(req.params.id);
    const result = await Event.setParticipant(participantId, eventId);

    if (result) {
      res.status(200).json({ data: result.message });
    } else next();
  },
  async deleteParticipant(req, res, next) {
    if (!req.user?.id) return res.sendStatus(401);

    const participantId = parseInt(req.user.id);
    const eventId = parseInt(req.params.id);

    const isDeleted = await Event.deleteParticipant(participantId, eventId);

    if (isDeleted) {
      res.sendStatus(200);
    }
    next();
  },
};

module.exports = eventController;
