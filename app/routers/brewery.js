const debug = require('debug')('router');
const express = require('express');
const breweryController = require('../controllers/brewery');
const router = express.Router();
const catchAsync = require('../service/catchAsync');
const { checkAuthenticated, isOwner } = require('../middlewares/middleware');
const { postBrewerySchema, editBrewerySchema } = require('../validation/schemas');
const { validate } = require('../validation/validate');
const multer = require("multer");
const { storage } = require("../service/cloudinary");
const upload = multer({ storage });


// SWAGGER CONFIGURATION

/**
* @swagger
* components:
*   schemas:
*     Brewery:
*       type: object
*       required:
*          - id
*          - title
*          - phone
*          - description
*          - image
*          - categories
*       properties:
*         id:
*           type: integer
*           description: ID of the brewery
*         title:
*           type: string
*           description: title of the brewery
*         phone:
*           type: string
*           description: phone number of the brewery
*         description:
*           type: string
*           description: description of the brewery
*         image:
*           type: string
*           description: logo/image of the brewery
*         user_id:
*           type: integer
*           description: the brewery owner ID
*         categories:
*           type: array
*           description: the list of categorie(s) the brewery belongs to
*           items:
*             type: object
*             properties:
*               id:
*                  type: integer
*                  description: ID of the category
*               tag:
*                  type: string
*                  description: title of the category
*         events:
*           type: array
*           description: the list of categorie(s) the brewery belongs to
*           items:
*             type: object
*             properties:
*               id:
*                  type: integer
*                  description: ID of the event
*               title:
*                  type: integer
*                  description: title of the event
*               description:
*                  type: string
*                  description: description of the event
*               event_start:
*                  type: string
*                  description: start date of the event
*   requestBodies:
*     postBody:
*       content:
*         multipart/form-data:
*            schema:
*              type: object
*              required:
*                 - title
*                 - phone
*                 - description
*                 - image
*                 - user_id
*                 - categories
*              properties:
*                title:
*                  type: string
*                  description: title of the brewery
*                phone:
*                  type: string
*                  description: phone number of the brewery
*                description:
*                  type: string
*                  description: description of the brewery
*                image:
*                  type: string
*                  description: logo/image of the brewery
*                user_id:
*                  type: integer
*                  description: the brewery owner ID
*                categories:
*                  type: array
*                  description: the list of categorie(s) the brewery belongs to
*                  items:
*                    type: object
*                    properties:
*                      id:
*                         type: integer
*                         description: ID of the category
*     putBody:
*       content:
*         multipart/form-data:
*            schema:
*              type: object
*              required:
*                 - title
*                 - phone
*                 - description
*                 - image
*                 - categories
*              properties:
*                title:
*                  type: string
*                  description: title of the brewery
*                phone:
*                  type: string
*                  description: phone number of the brewery
*                description:
*                  type: string
*                  description: description of the brewery
*                image:
*                  type: string
*                  description: logo/image of the brewery
*                categories:
*                  type: array
*                  description: the list of categorie(s) the brewery belongs to
*                  items:
*                    type: object
*                    properties:
*                      id:
*                         type: integer
*                         description: ID of the category
*   parameters:
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
 *  name: Brewery
 *  description: the routes to manage breweries
 */


// ROUTES

router.route('/')
    /**
     * @swagger
     * /brewery:
     *   get:
     *     summary: Returns the list of all the breweries (WITHOUT the events details)
     *     tags: [Brewery]
     *     responses:
     *       200:
     *         description: the list of the breweries
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Brewery'
     *       404:
     *          description: the brewery was not found
     *       500:
     *          description: internal server error
     */
    .get(catchAsync(breweryController.getAllBreweries))
    /**
     * @swagger
     * /brewery:
     *   post:
     *     summary: Create a new brewery
     *     tags: [Brewery]
     *     requestBody:
     *       $ref: '#/components/requestBodies/postBody'
     *     responses:
     *       200:
     *         description: the brewery was successfully created
     *         content:
     *           application/json:
     *             schema:
     *                 $ref: '#/components/schemas/Brewery'
     *       400:
     *          description: bad request, error in the request body content
     *       401:
     *          description: unauthorized
     *       404:
     *          description: the brewery was not found
     *       500:
     *          description: internal server error
     */
    .post(checkAuthenticated, validate(postBrewerySchema), upload.single("file"), catchAsync(breweryController.addBrewery));

router.route('/:id([0-9]+)')
    /**
     * @swagger
     * /brewery/{id}:
     *   get:
     *     summary: Get the brewery by id
     *     tags: [Brewery]
     *     parameters:
     *       - $ref: '#/components/parameters/breweryId'
     *     responses:
     *       200:
     *         description: the brewery details by id
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Brewery'
     *       404:
     *          description: the brewery was not found
     *       500:
     *          description: internal server error
     */
    .get(catchAsync(breweryController.getBreweryById))
    /**
     * @swagger
     * /brewery/{id}:
     *   put:
     *     summary: Create a new brewery
     *     tags: [Brewery]
     *     parameters:
     *       - $ref: '#/components/parameters/breweryId'
     *     requestBody:
     *         $ref: '#/components/requestBodies/putBody'
     *     responses:
     *       200:
     *         description: the brewery was successfully created
     *         content:
     *           application/json:
     *             schema:
     *                 $ref: '#/components/schemas/Brewery'
     *       400:
     *          description: bad request, error in the request body content
     *       401:
     *          description: unauthorized
     *       404:
     *          description: the brewery was not found
     *       500:
     *          description: internal server error
     */
    .put(checkAuthenticated, isOwner, validate(editBrewerySchema), catchAsync(breweryController.editBrewery))
    /**
     * @swagger
     * /brewery/{id}:
     *   delete:
     *     summary: Delete a brewery by id
     *     tags: [Brewery]
     *     parameters:
     *       - $ref: '#/components/parameters/breweryId'
     *     responses:
     *       200:
     *          description: the brewery was successfully deleted
     *       401:
     *          description: unauthorized
     *       404:
     *          description: the brewery was not found
     *       500:
     *          description: internal server error
     */
    .delete(checkAuthenticated, isOwner, breweryController.deleteBrewery);
    /**
     * @swagger
     * /brewery/user:
     *   get:
     *     summary: Returns the list of all the breweries by user id (WITHOUT the 'events' details)
     *     tags: [Brewery]
     *     parameters:
     *       - $ref: '#/components/parameters/breweryId'
     *     responses:
     *       200:
     *         description: the list of the breweries
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Brewery'
     *       401:
     *          description: unauthorized
     *       404:
     *          description: the brewery was not found
     *       500:
     *          description: internal server error
     */
router.get('/user', checkAuthenticated, catchAsync(breweryController.getOwnerBreweries));

module.exports = router;
