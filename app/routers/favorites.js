// const express = require("express");
// const favoritesController = require("../controllers/favorites");
// const router = express.Router();

// // SWAGGER CONFIGURATION

// /**
//  * @swagger
//  * components:
//  *   schemas:
//  *     category:
//  *       type: array
//  *       required:
//  *          - id
//  *          - tag
//  *       properties:
//  *         id:
//  *           type: integer
//  *           description: ID of the category
//  *         tag:
//  *           type: string
//  *           description: title of the category
//  *   parameters:
//  *     categoryId:
//  *       in: path
//  *       name: id
//  *       schema:
//  *         type: integer
//  *       required: true
//  *       description: the category id
//  */

// /**
//  * @swagger
//  * tags:
//  *  name: Category
//  *  description: the routes to manage categories
//  */

// // ROUTES

// /**
//  * @swagger
//  * /category:
//  *   get:
//  *     summary: Returns the list of all the categories
//  *     tags: [Category]
//  *     responses:
//  *       200:
//  *         description: the list of the categories
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/category'
//  *       404:
//  *          description: the category was not found
//  *       500:
//  *          description: internal server error
//  */
// router.post("/", favoritesController.setFavorites);

// module.exports = router;
