const express = require('express');
const eventController = require('../controllers/event');
const { isOwner } = require('../middlewares/middleware');
const { postEventSchema } = require('../validation/schemas');
const { validate } = require('../validation/validate');
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
*          - event_start
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
*         event_start:
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
*     postBody:
*       content:
*         application/json:
*            schema:
*              type: object
*              required:
*                - title
*                - description
*                - event_start
*                - brewery_id
*              properties:
*                title:
*                  type: string
*                  description: title of the event
*                description:
*                  type: string
*                  description: description of the event
*                event_start:
*                  type: string
*                  description: date start of the event
*                brewery_id:
*                  type: integer
*                  description: brewery id the event belongs to
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

router.route('/')
    /**
     * @swagger
     * /event:
     *   get:
     *     summary: Returns the list of all the events details by participant
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
    .get(eventController.getEventsByParticipant)

router.route('/:id([0-9]+)')
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
     *       $ref: '#/components/requestBodies/postBody'
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

router.route('/:id([0-9]+(\/user))')
    /**
     * @swagger
     * /event/{id}/user:
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
    .post(eventController.setParticipant)
    /**
     * @swagger
     * /event/{id}/user:
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
    .delete(eventController.deleteParticipant);

module.exports = router;
