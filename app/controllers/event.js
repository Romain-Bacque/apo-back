const debug = require('debug')('controller');
const { Event } = require('../models/');

const eventController = {
    async getEventsByParticipant(req, res) {
        if(!req.user?.id) return res.sendStatus(401);

        const events = await Event.getAll(req.user.id);

        if(events) {
            res.status(200).json({ data: events });
        } next();
    },
    async getEventById(req, res) {
        if(!req.user?.id) return res.sendStatus(401);

        const id = parseInt(req.params.id);

        const breweries = await Brewery.getOwnerBreweries(req.user.id);

        if(!breweries || !breweries.find(brewery => brewery.id === req.body.brewery_id)) {
            return res.sendStatus(401);
        }

        const event = await Event.getEventById(id);

        if(event) {
            res.status(200).json({ data: event });
        } next();
    },
    async addEvent(req, res) {
        if(!req.user?.role === "brewer" || !req.user?.id) return res.sendStatus(401);

        const breweries = await Brewery.getOwnerBreweries(req.user.id);

        if(!breweries || !breweries.find(brewery => brewery.id === req.body.brewery_id)) {
            return res.sendStatus(401);
        }

        const event = await new Event(req.body);

        const isAdded =  await event.addEvent();

        if(isAdded) {
            res.status(200);
        } next();
    },
    async deleteEvent(req, res) {
        if(!req.user?.id) return res.sendStatus(401);

        const breweries = await Brewery.getOwnerBreweries(req.user.id);

        if(!breweries || !breweries.find(brewery => brewery.id === req.body.brewery_id)) {
            return res.sendStatus(401);
        }

        const isDeleted = await Event.deleteEvent(req.user.id);

        if(isDeleted) {
            res.status(200);
        } next();
    },
    async setParticipant(req, res) {
        if(!req.user?.id) return res.sendStatus(401);

        const participantId = req.user?.id;
        const eventId = parseInt(req.params.id);

        const event = await Event.getEventById(eventId);

        if(event.participants.find(participant => participant.id === req.user.id)) {
            return res.status(403).json({ message: 'user already participate in this event'});
        };

        const isDeleted = await Event.setParticipant(eventId, participantId);

        if(isDeleted) {
            res.status(200);
        } next();
    },
    async deleteParticipant(req, res) {
        if(!req.user?.id) return res.sendStatus(401);

        const participantId = req.user?.id;
        const eventId = parseInt(req.params.id);

        const isDeleted = await Event.deleteParticipant(eventId, participantId);

        if(isDeleted) {
            res.status(200);
        } next();
    }
}

module.exports = eventController;


