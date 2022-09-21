const express = require('express');
const eventController = require('../controllers/event');
const router = express.Router();

router.route('/')
    .get(eventController.getAllEvents)
    .post(eventController.addEvent);

router.put('/:id', eventController.editEvent);

router.route('/:id/user/:id')
    .post(eventController.setParticipant)
    .delete(eventController.deleteParticipant);

module.exports = router;
