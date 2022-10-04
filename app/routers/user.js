const express = require('express');
const userController = require('../controllers/user');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../service/catchAsync');
const { loginSchema, registerSchema } = require('../validation/schemas');
const { validate } = require('../validation/validate');
const { checkNotAuthenticated } = require('../middlewares/middleware');


// SWAGGER CONFIGURATION

/**
* @swagger
* components:
*   schemas:
*     Register:
*       type: object
*       required:
*          - name
*          - email
*          - password
*          - role
*       properties:
*         name:
*           type: string
*           description: firstname and lastname of the user
*         email:
*           type: string
*           description: email of the user
*         password:
*           type: string
*           description: password of the user
*         role:
*           type: string
*           description: role of the user
*     Login:
*       type: object
*       required:
*          - email
*          - password
*       properties:
*         email:
*           type: string
*           description: email of the user
*         password:
*           type: string
*           description: password of the user
*   parameters:
*     userId:   
*       in: path
*       name: id
*       schema:
*         type: integer
*       required: true
*       description: the user id
*/

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Sign in
 *     tags: [User]  
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *          description: user is successfully connected
 *          content:
 *            application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Register'
 *       400:
 *          description: bad request, error in the request body content
 *       401:
 *          description: unauthorized
 *       500:
 *          description: internal server error
 */

/**
 * @swagger 
 * tags:
 *  name: User
 *  description: the routes to manage user profile/authentification
 */



// ROUTES

router.post('/login', checkNotAuthenticated, validate(loginSchema), passport.authenticate('local'), userController.login);
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Sign up
 *     tags: [User]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                $ref: '#/components/schemas/Register' 
 *     responses:
 *       200:
 *          description: user is successfully registered
 *       400:
 *          description: bad request, error in the request body content
 *       403:
 *          description: user already exists
 *       500:
 *          description: internal server error
 */
router.post('/register', validate(registerSchema), catchAsync(userController.register));
/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Disconnect from the session
 *     tags: [User]
 *     responses:
 *       200:
 *          description: user is successfully disconnected from the session
 *       400:
 *          description: bad request, error in the request body content
 *       403:
 *          description: user already exists
 *       500:
 *          description: internal server error
 */
router.post('/logout', userController.logout);
router.route('/profile/:id([0-9]+)')
    .get(userController.getUser)
    .put(userController.editUser);
router.delete('/profile/:id([0-9]+)', userController.deleteAccount);

module.exports = router;
