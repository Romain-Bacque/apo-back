const express = require('express');
const eventController = require('../controllers/event');
const router = express.Router();

router.route('/')
    .get(eventController.getEventsByParticipant)
    .post(eventController.addEvent);

router.route('/:id([0-9]+)')
    .put(eventController.deleteEvent);

router.route('/:id([0-9]+)/user/:id([0-9]+)')
    .post(eventController.setParticipant)
    .delete(eventController.deleteParticipant);

module.exports = router;
