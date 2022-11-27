const express = require("express");
const eventController = require("../controllers/event");
const { isOwner, checkAuthenticated } = require("../middlewares/middleware");
const { postEventSchema } = require("../validation/schemas");
const { validate } = require("../validation/validate");
const catchAsync = require("../service/catchAsync");
const router = express.Router();

// SWAGGER CONFIGURATION

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *          - id
 *          - title
 *          - description
 *          - eventStart
 *          - total_participants
 *          - brewery
 *       properties:
 *         id:
 *           type: integer
 *           description: ID of the event
 *         title:
 *           type: string
 *           description: title of the event
 *         description:
 *           type: string
 *           description: description of the event
 *         eventStart:
 *           type: string
 *           description: date start of the event
 *         participants:
 *           type: array
 *           description: the list of participant(s) of the event
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                  type: string
 *                  description: name of the participant
 *               email:
 *                  type: string
 *                  description: email of the participant
 *         total_participants:
 *           type: integer
 *           description: total participants of the event
 *         brewery:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               description: ID of the brewery
 *             address:
 *               type: string
 *               description: address of the brewery
 *             title:
 *               type: string
 *               description: title of the brewery
 *   requestBodies:
 *     eventBody:
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              required:
 *                - title
 *                - description
 *                - eventStart
 *                - ownerId
 *              properties:
 *                title:
 *                  type: string
 *                  description: title of the event
 *                description:
 *                  type: string
 *                  description: description of the event
 *                eventStart:
 *                  type: string
 *                  description: date start of the event
 *                ownerId:
 *                  type: integer
 *                  description: owner id the event belongs to
 *   parameters:
 *     eventId:
 *       in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: the event id
 *     breweryId:
 *       in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: the brewery id
 */

/**
 * @swagger
 * tags:
 *  name: Event
 *  description: the routes to manage events
 */

// ROUTES

/**
 * @swagger
 * /event/owner:
 *   get:
 *     summary: Returns the list of all the events details by owner
 *     tags: [Event]
 *     responses:
 *       200:
 *         description: the list of the owner events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *          description: unauthorized
 *       404:
 *          description: the events was not found
 *       500:
 *          description: internal server error
 */
router.get(
  "/owner",
  checkAuthenticated,
  catchAsync(eventController.getEventsByOwner)
);

/**
 * @swagger
 * /event/participant:
 *   get:
 *     summary: Returns the list of all the events details by participant
 *     tags: [Event]
 *     responses:
 *       200:
 *         description: the list of the participant events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *          description: unauthorized
 *       404:
 *          description: the events was not found
 *       500:
 *          description: internal server error
 */
router.get(
  "/participant",
  checkAuthenticated,
  catchAsync(eventController.getEventsByParticipant)
);

router
  .route("/participant/:id([0-9]+)")
  /**
   * @swagger
   * /event/participant/{id}:
   *   post:
   *     summary: Register a new participant in an event
   *     tags: [Event]
   *     parameters:
   *       - $ref: '#/components/parameters/eventId'
   *     responses:
   *       200:
   *         description: the participant was successfully added
   *       400:
   *          description: bad request, error in the request body content
   *       401:
   *          description: unauthorized
   *       404:
   *          description: the event or/and user was not found
   *       500:
   *          description: internal server error
   */
  .post(checkAuthenticated, catchAsync(eventController.setParticipant))
  /**
   * @swagger
   * /event/participant/{id}:
   *   delete:
   *     summary: Delete a participant from an event
   *     tags: [Event]
   *     parameters:
   *       - $ref: '#/components/parameters/eventId'
   *     responses:
   *       200:
   *         description: the participant was successfully deleted
   *       400:
   *          description: bad request, error in the request body content
   *       401:
   *          description: unauthorized
   *       404:
   *          description: the participant was not found
   *       500:
   *          description: internal server error
   */
  .delete(checkAuthenticated, catchAsync(eventController.deleteParticipant));

router
  .route("/:id([0-9]+)")
  /**
   * @swagger
   * /event/{id}:
   *   get:
   *     summary: Returns the list of all the events details by brewery
   *     tags: [Event]
   *     responses:
   *       200:
   *         description: the list of the events
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Event'
   *       401:
   *          description: unauthorized
   *       404:
   *          description: the events was not found
   *       500:
   *          description: internal server error
   */
  .get(isOwner, eventController.getEventsByBrewery)
  /**
   * @swagger
   * /event/{id}:
   *   post:
   *     summary: Create a new event
   *     tags: [Event]
   *     parameters:
   *       - $ref: '#/components/parameters/breweryId'
   *     requestBody:
   *       $ref: '#/components/requestBodies/eventBody'
   *     responses:
   *       200:
   *         description: the event was successfully created
   *       400:
   *          description: bad request, error in the request body content
   *       401:
   *          description: unauthorized
   *       404:
   *          description: the event was not found
   *       500:
   *          description: internal server error
   */
  .post(isOwner, validate(postEventSchema), eventController.addEvent)
  /**
   * @swagger
   * /event/{id}:
   *   delete:
   *     summary: Delete an event
   *     tags: [Event]
   *     parameters:
   *       - $ref: '#/components/parameters/eventId'
   *     responses:
   *       200:
   *         description: the event was successfully deleted
   *       400:
   *          description: bad request, error in the request body content
   *       401:
   *          description: unauthorized
   *       404:
   *          description: the event was not found
   *       500:
   *          description: internal server error
   */
  .delete(eventController.deleteEvent);

module.exports = router;
