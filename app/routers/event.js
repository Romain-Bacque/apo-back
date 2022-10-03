const express = require('express');
const eventController = require('../controllers/event');
const router = express.Router();

router.route('/')
    .get(eventController.getAllEvents)
    .post(eventController.addEvent);

router.put('/:id([0-9]+)', eventController.editEvent);

router.route('/:id([0-9]+)/user/:id([0-9]+)')
    .post(eventController.setParticipant)
    .delete(eventController.deleteParticipant);

module.exports = router;
