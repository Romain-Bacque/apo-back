const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../service/catchAsync");
const {
  loginSchema,
  registerSchema,
  editProfileSchema,
  emailSchema,
  passwordSchema,
} = require("../validation/schemas");
const { validate } = require("../validation/validate");
const {
  checkNotAuthenticated,
  checkAuthenticated,
} = require("../middlewares/middleware");

// SWAGGER CONFIGURATION

/**
 * @swagger
 * components:
 *   schemas:
 *     Email:
 *       type: object
 *       required:
 *          - email
 *       properties:
 *         email:
 *           type: string
 *           description: user email
 *     Password:
 *       type: object
 *       required:
 *          - password
 *       properties:
 *         email:
 *           type: string
 *           description: user password
 *     Profile:
 *       type: object
 *       required:
 *          - name
 *          - email
 *          - actualPassword
 *          - newPassword
 *       properties:
 *         name:
 *           type: string
 *           description: user name/pseudo
 *         email:
 *           type: string
 *           description: user email
 *         actualPassword:
 *           type: string
 *           description: actual user password
 *         newPassword:
 *           type: string
 *           description: new password user password
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
 *           description: user name/pseudo
 *         email:
 *           type: string
 *           description: user email
 *         password:
 *           type: string
 *           description: user password
 *         role:
 *           type: string
 *           description: user role
 *     Login:
 *       type: object
 *       required:
 *          - email
 *          - password
 *       properties:
 *         email:
 *           type: string
 *           description: user email
 *         password:
 *           type: string
 *           description: user password
 *   parameters:
 *     userId:
 *       in: path
 *       name: id
 *       schema:
 *         type: integer
 *       required: true
 *       description: user id
 *     token:
 *       in: path
 *       name: token
 *       schema:
 *         type: integer
 *       required: true
 *       description: user jwt token
 */

/**
 * @swagger
 * tags:
 *  name: User
 *  description: the routes to manage user profile/authentication
 */

// ROUTES

/**
 * @swagger
 * /user:
 *   get:
 *     summary: user connection status verification
 *     tags: [User]
 *     responses:
 *       200:
 *         description: user is connected
 *       401:
 *          description: user is not connected
 *       500:
 *          description: internal server error
 */
router.get("/", checkAuthenticated, userController.userVerification);

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
 *       409:
 *          description: user is already connected
 *       500:
 *          description: internal server error
 */

router.post(
  "/login",
  checkNotAuthenticated,
  validate(loginSchema),
  passport.authenticate("local"),
  userController.login
);
/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Sign up
 *     tags: [User]
 *     parameters:
 *       - $ref: '#/components/parameters/id'
 *       - $ref: '#/components/parameters/token'
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
router.post(
  "/register",
  validate(registerSchema),
  catchAsync(userController.register)
);

router.get(
  "/email-confirm",
  catchAsync(userController.emailConfirm)
);

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
router.post("/logout", userController.logout);
/**
 * @swagger
 * /user/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags: [User]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                $ref: '#/components/schemas/Email'
 *     responses:
 *       200:
 *          description: user is successfully registered
 *       400:
 *          description: bad request, error in the request body content
 *       401:
 *          description: user doesn't exists
 *       500:
 *          description: internal server error
 */
router.post(
  "/forgot-password",
  checkNotAuthenticated,
  validate(emailSchema),
  catchAsync(userController.handleForgotPassword)
);
/**
 * @swagger
 * /user/reset-password/{id}/{token}:
 *   patch:
 *     summary: Reset password
 *     tags: [User]
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *             schema:
 *                $ref: '#/components/schemas/Password'
 *     parameters:
 *       - $ref: '#/components/parameters/userId'
 *       - $ref: '#/components/parameters/token'
 *     responses:
 *       200:
 *          description: user password is successfully updated
 *       400:
 *          description: bad request, error in the request body content
 *       401:
 *          description: user doesn't exists
 *       500:
 *          description: internal server error
 */
router.patch(
  "/reset-password/:id([0-9]+)/:token",
  validate(passwordSchema),
  catchAsync(userController.resetPassword)
);

router
  .route("/profile")
  /**
   * @swagger
   * /user/profile:
   *   patch:
   *     summary: Update profile
   *     tags: [User]
   *     requestBody:
   *        required: true
   *        content:
   *          application/json:
   *             schema:
   *                $ref: '#/components/schemas/Profile'
   *     responses:
   *       200:
   *          description: user profile is successfully updated
   *       400:
   *          description: bad request, error in the request body content
   *       401:
   *          description: user doesn't exists
   *       500:
   *          description: internal server error
   */
  .patch(
    checkAuthenticated,
    validate(editProfileSchema),
    catchAsync(userController.editUser)
  )
  /**
   * @swagger
   * /user/profile:
   *   delete:
   *     summary: Delete profile
   *     tags: [User]
   *     responses:
   *       200:
   *          description: account is successfully deleted
   *       401:
   *          description: user doesn't exists
   *       500:
   *          description: internal server error
   */
  .delete(checkAuthenticated, catchAsync(userController.deleteAccount));

module.exports = router;
